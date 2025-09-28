import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-world-auth'
import { client } from '@/lib/db'
import { Call } from '@/lib/types'

// Do not cache endpoint result
export const revalidate = 0

const ping = async (walletAddress: string, username?: string): Promise<void> => {
  try {
    const query = `
    INSERT INTO online (user_address, user_name, ping_at)
    VALUES ($1, $2, NOW())
      ON CONFLICT (user_address)
      DO UPDATE
      SET user_name = EXCLUDED.user_name,
          ping_at   = EXCLUDED.ping_at;`
    await client.query(query, [walletAddress, username])
  } catch(error) {
    console.log('PNG', 'Query failed', error)
  }
}

const calls = async (walletAddress: string): Promise<Call[] | null> => {
  try {
    const query = `
      SELECT
        c.*,
        (c.modified_at >= NOW() - INTERVAL '10 seconds') AS call_initiated,
        r.requester_name,
        r.requester_address,
        (ro.ping_at IS NOT NULL AND ro.ping_at >= NOW() - INTERVAL '10 seconds') AS requester_online,
        (r.requester_address = $1) AS requester_me
      FROM calls c
      JOIN requests r
        ON r.id = c.request_id
      LEFT JOIN online ro
        ON ro.user_address = r.requester_address
      JOIN online to_user
        ON to_user.user_address = c.taker_address
          AND to_user.ping_at >= NOW() - INTERVAL '10 seconds'   -- taker must be online
      WHERE r.requester_address = $1
        AND c.end_at IS NULL;`
    const r = await client.query(query, [walletAddress])
    return r.rows
  } catch(error) {
    console.log('PNG', 'Query failed', error)
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const session = await getServerSession({})()
  console.log('SES', session)
  if (!session || !session.isOrbVerified || !session.user || !session.user.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await ping(session?.user.walletAddress, session?.user.username)
  const c = await calls(session?.user.walletAddress)

  console.log('CCC', c)
  return NextResponse.json({ results: c }, { status: 200 })
}