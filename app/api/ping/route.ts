import { NextRequest, NextResponse } from 'next/server'

// Do not cache endpoint result
export const revalidate = 0


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Not ready' }, { status: 400 })
}