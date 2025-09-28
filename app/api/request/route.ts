// app/api/requests/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-world-auth'
import { client } from '@/lib/db'


export const POST = async (req: Request) => {
  const session = await getServerSession({})()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    requester_name?: string
    description?: string
    languages?: string[]
    location?: { lat: number; lng: number }
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { description } = body

  if (!description || description.trim() === '') {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }

  const requesterAddress = session.user.walletAddress
  if (!requesterAddress) {
    return NextResponse.json({ error: 'Session missing wallet address' }, { status: 400 })
  }

  try {
    const insertSql = `
      INSERT INTO requests (
        requester_name,
        requester_address,
        description,
        languages
      )
      VALUES (
        $1, $2, $3, COALESCE($4, ARRAY[]::text[])
      )
      RETURNING *;
    `

    const { rows } = await client.query<Request>(insertSql, [
      session.user.username,
      requesterAddress,
      description,
      []
    ])

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('REQUESTS_INSERT_ERROR', error)
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
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
  
    const requestId = body.id
    if (!requestId) {
      return NextResponse.json({ error: 'request id is required' }, { status: 400 })
    }
  
    try {
      // Update the request status
      const updateSql = `
        UPDATE requests
        SET status = 'cancelled', modified_at = NOW()
        WHERE id = $1
        RETURNING *;
      `
      const updated = await client.query(updateSql, [requestId])
  
      return NextResponse.json(
        {
          deleted: updated.rowCount,
          request: updated.rows[0],
        },
        { status: 200 }
      )
    } catch (error) {
      console.error('CDE', error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
  }