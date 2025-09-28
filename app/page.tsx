'use client'

import { useState } from "react"
import { useWorldAuth } from 'next-world-auth/react'
import { Permission } from '@worldcoin/minikit-js'
import GoogleMapReact from 'google-map-react'

import { Button } from '@/components/ui/button'
import { Home, DollarSign, MessageSquare } from "lucide-react"


const mapsApiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

const BottomNav = ({ tab, setTab }: { tab: string, setTab: (tab: string) => void }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-12">
      <nav className="bg-[#1c1c1f] rounded-full px-6 py-3 flex items-center gap-8 shadow-lg">
        <button 
          onClick={() => setTab('home')} 
          className={`${tab === 'home' ? 'text-[#8b5cf6]' : 'text-gray-500'}`}
        >
          <Home className="w-12 h-12" />
        </button>
        <button 
          onClick={() => setTab('messages')} 
          className={`${tab === 'messages' ? 'text-[#8b5cf6]' : 'text-gray-500'}`}
        >
          <MessageSquare className="w-10 h-10" />
        </button>
        <button 
          onClick={() => setTab('payments')} 
          className={`${tab === 'payments' ? 'text-[#8b5cf6]' : 'text-gray-500'}`}
        >
          <DollarSign className="w-10 h-10" />
        </button>
      </nav>
    </div>
  )
}

export default function Page() {
  const { session, signInWallet, signOut: signOut0, getLocation, minikit } = useWorldAuth()
  const [, setPermissions] = useState([])
  const [tab, setTab] = useState('home')

  // const tip = async (amount: number) => {
  //   const r = await pay({ amount, token: Tokens.WLD, recipient: '0x2Eb67DdFf6761bC0938e670bf1e1ed46110DDABb' })
  //   if(r.success) {
  //     setTipAmount(amount)
  //   }
  // }

  const signOut = async () => {
    await signOut0()
    setTab('home')
  }

  const signIn = async () => {
    const signInResult = await signInWallet()
    if(!signInResult) return;
  
    // @ts-expect-error - minikit instance from hook may not have commandsAsync property in type definition
    const { finalPayload } = await minikit!.commandsAsync.getPermissions()
    const permissions = finalPayload.permissions
    setPermissions(permissions)
    if(!permissions.microphone) {
      // @ts-expect-error - minikit instance from hook may not have commandsAsync property in type definition
      await minikit.commandsAsync.requestPermission({ permission: Permission.Microphone })
    }
    // if(!permissions.Notifications) {
    //   // @ts-expect-error - minikit instance from hook may not have commandsAsync property in type definition
    //   await minikit.commandsAsync.requestPermission({ permission: Permission.Notifications })
    // }
    // @ts-expect-error - minikit instance from hook may not have commandsAsync property in type definition
    const { finalPayload: finalPayload1 } = await minikit!.commandsAsync.getPermissions()
    const permissions1 = finalPayload1.permissions
    setPermissions(permissions1)

    // @ts-expect-error - minikit instance from hook may not have commandsAsync property in type definition
    await minikit.commandsAsync.sendHapticFeedback({ hapticsType: 'notification', style: 'success' })
  }

  const isTextVisible = !session?.user

  return (<>
     <div className="min-h-screen flex flex-col pt-2">
      <main className="flex-1 pb-16">
        {tab === 'payments' && <>
          <div className="flex flex-col items-center justify-center h-full mt-10">
            <p className="text-2xl py-6">Amount to be paid</p>
            {/* @ts-expect-error - null || '0.00' is intentionally falsy for placeholder */}
            <p className="text-2xl italic py-6">USDC ${null || '0.00'}</p>
          </div>
        </>}
        {/* {tab === 'post' && post&& <Post post={post} setPost={async () => { setPost(null); await fetchPosts(); setTab('messages') }} />}
        {tab === 'messages' && <Feed posts={posts} setPost={(post) => { setPost(post); setTab('post') }} />} */}
        {tab === 'home' && (
          <div className="flex flex-col items-center justify-center h-full mt-2">
            <h1 className="text-2xl italic py-6">Terranova</h1>
            <div
              className={`
                overflow-hidden transition-[height,transform] duration-1000 ease-in-out
                ${isTextVisible ? 'h-[120px]' : 'h-0'}
              `}
            >
              <div className={`
                transition-transform duration-1000 ease-in-out
                ${isTextVisible ? 'translate-y-0' : '-translate-y-full'}
              `}>
                <p className="text-md italic text-center">Share your knowledge with the world</p>
                <p className="text-md italic py-6 text-center">Be part of a new economic chain</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 items-center w-full max-w-md">
              <div className="flex flex-col items-center w-full">
                <Button
                  className={`text-3xl rounded-full px-6 py-8 w-4/5 ${session?.user ? 'opacity-50 cursor-not-allowed border-2 border-green-500' : 'border-2 border-white'}`}
                  onClick={signIn}
                  disabled={!!session?.user}
                >
                  <span className={session?.user ? 'text-green-500' : ''}>
                    {session?.user ? '✅ ' : ''}Sign in
                  </span>
                </Button>
                {!session?.user && (
                  <p className="text-md italic text-center mt-2">To get started, sign in with your wallet</p>
                )}
              </div>

              {session?.user && !session?.isOrbVerified && (<>
                <p className="text-md italic text-center mt-2 text-red-500">This app is for verified humans</p>
                <p className="text-md italic text-center mt-2">Please find an Orb to confirm your humanity</p>
              </>)}
              {session?.user && session?.isOrbVerified && (<>
                {session?.user?.username && (<p className="text-md italic text-center mt-2">Welcome @{session?.user?.username}</p>)}
                <div className="flex flex-col items-center w-full">
                  <Button
                    className={`text-3xl rounded-full px-6 py-8 w-4/5 ${!session.user ? 'border-2 border-yellow-500' : (session.extra.location ? 'cursor-not-allowed border-2 border-green-500' : 'border-2 border-white')}`}
                    onClick={getLocation}
                    disabled={false}
                  >
                    <span className={session?.user ? (!session.extra.location ? 'text-yellow-500' : 'text-green-500') : ''}>
                      {!session.extra.location && 'Share location'}
                      {session.extra.location && (!session?.extra.location ? '🟡 ' : '✅ ') + 'Update location'}
                    </span>
                  </Button>
                  {!session?.extra?.location && (
                    <p className="text-md italic text-center mt-2">Share your location to act as a local expert</p>
                  )}
                  {session?.extra.location &&
                    <div className="my-8" style={{ height: '15vh', width: '90%' }}>
                      <GoogleMapReact
                        bootstrapURLKeys={{ key: mapsApiKey }}
                        defaultCenter={{ lat: session.extra.location.latitude!, lng: session.extra.location.longitude! }}
                        defaultZoom={11}
                      >
                      </GoogleMapReact>
                    </div>}
                  {/* {location && !location.success && (
                    <p className="text-md italic text-center mt-4">Could not get location</p>
                  )} */}
                </div>
                {session?.user && location && (<>
                  <Button
                    className="text-6xl font-bold rounded-full mt-2 w-32 h-32 bg-green-500 hover:bg-green-600 transition-colors"
                    onClick={() => setTab('messages')}
                  >
                    GO
                  </Button>
                  <Button onClick={signOut}>Sign Out</Button>
                  <Button onClick={() => window.location.href = '/call'}>Call</Button>
                  <p className="text-md text-center mt-2">You are all set!<br />Press GO to start sharing your knowledge</p>
                </>)}
              </>)}

            </div>
          </div>
        )}
      </main>
      {session && session.user && <div className={`fixed bottom-0 w-full transition-all duration-700 ease-in-out ${
        session?.user && location ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} >
        <BottomNav tab={tab} setTab={setTab} />
      </div>}
    </div>
  </>)
}