// app/api/requests/route.ts (or wherever your route lives)

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-world-auth'
import { client } from '@/lib/db'
import type { Call } from '@/lib/types' // you already have this

export const POST = async (req: Request) => {
  const session = await getServerSession({})()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const requestId = body.id?.trim()
  if (!requestId) {
    return NextResponse.json({ error: 'request_id is required' }, { status: 400 })
  }

  // very light UUID sanity check (let the DB constraint be the ultimate judge)
  if (!/^[0-9a-fA-F-]{36}$/.test(requestId)) {
    return NextResponse.json({ error: 'request_id must be a UUID' }, { status: 400 })
  }

  const takerAddress = session.user.walletAddress
  const takerName = session.user.username

  if (!takerAddress) {
    return NextResponse.json({ error: 'Session missing wallet address' }, { status: 400 })
  }

  try {
    const insertSql = `
        WITH deleted AS (
        DELETE FROM calls
        WHERE request_id = $1 AND taker_address = $3
        )
        INSERT INTO calls (request_id, room_uuid, taker_name, taker_address, start_at)
        VALUES ($1, gen_random_uuid(), $2, $3, NOW())
        RETURNING *;`
    const { rows } = await client.query<Call>(insertSql, [
      requestId,
      takerName,
      takerAddress,
    ])

    const created = rows[0]
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('CIE', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export const DELETE = async (req: Request) => {
    const session = await getServerSession({})()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { id?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
  
    const callId = body.id
  
    try {
      const delSql = `
        DELETE FROM calls
        WHERE id = $1
        RETURNING id;
      `
      const { rowCount } = await client.query<{ id: string }>(delSql, [
        callId,
      ])
  
      return NextResponse.json(
        { deleted: rowCount ?? 0 },
        { status: 200 }
      )
    } catch (error) {
      console.error('CDE', error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}

export const GET = async (req: Request) => {
    const session = await getServerSession({})()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const callId = searchParams.get('id')
    if (!callId) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }
  
    try {
      const sql = `
        SELECT * FROM calls
        WHERE id = $1;
      `
      const { rowCount } = await client.query<{ id: string }>(sql, [
        callId,
      ])
  
      return NextResponse.json(
        { deleted: rowCount ?? 0 },
        { status: 200 }
      )
    } catch (error) {
      console.error('CDE', error)
      return NextResponse.json({ error: 'GET failed' }, { status: 500 })
    }
}