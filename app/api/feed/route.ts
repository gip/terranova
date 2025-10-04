import { NextResponse } from 'next/server'
import { getServerSession } from 'next-world-auth'
import { client } from '@/lib/db'
import { Request } from '@/lib/types'

export const GET = async () => {
  const session = await getServerSession({})()
  console.log('SES', session)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const results: Request[] = await getRequests(session.user.walletAddress!)
  console.log('RRR', results)
  return NextResponse.json(results)
}

const getRequests = async (walletAddress: string): Promise<Request[]> => {

  let results
  try {
    const query = `
      SELECT
        r.*,
        (o.ping_at IS NOT NULL AND o.ping_at >= NOW() - INTERVAL '6 seconds') AS requester_online,
        (r.requester_address = $1) AS requester_me
      FROM requests r
      LEFT JOIN online o
        ON o.user_address = r.requester_address
      WHERE r.created_at >= NOW() - INTERVAL '336 hours'
      ORDER BY r.created_at DESC;
    `
    results = await client.query(query, [walletAddress])
  } catch(error) {
    console.log('REQ', 'Query failed', error)
  }

  return results!.rows
}