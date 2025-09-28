import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Request } from '@/lib/types'
import { useState } from 'react'

export const Feed = ({ posts, setPost }: { posts: Request[], setPost: (post: Request | null) => void }) => {
  const [filter, setFilter] = useState<string>('Active')

  const statusMap = {
    'Active': 'open',
    'Yours': 'pending_payment',
    'Paid': 'paid',
    'Cancelled': 'cancelled'
  }

  const initiateCall = async (id: string) => {
    const result = await fetch('/api/call', { method: 'POST', body: JSON.stringify({ id }) })
    const json = await result.json()
    if(result.ok) {
        window.location.href = `/call?id=${json.id}`
    }
  }

  const remove = async (id: string) => {
    await fetch('/api/request', { method: 'DELETE', body: JSON.stringify({ id })})
    setPost(null)
  }

  const filteredPosts = posts.filter(post => 
    filter === 'All' ? true : post.status === statusMap[filter as keyof typeof statusMap]
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3 px-4 mb-4 mt-4">
        {['All', 'Active', 'Yours', 'Paid', 'Cancelled'].map((status) => (
          <Badge
            key={status}
            variant="secondary"
            className={`cursor-pointer hover:opacity-80 text-[14px] py-0 px-3 ${
              filter === status 
                ? 'bg-yellow-500 text-black' 
                : 'bg-transparent border border-yellow-500 text-yellow-500'
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </Badge>
        ))}
      </div>
      {filteredPosts.map((post) => (
        <article 
          key={post.id} 
          className={`px-4 py-3 border-b border-[#1c1c1f] ${false ? 'cursor-pointer hover:bg-gray-900' : 'cursor-not-allowed'}`} 
          onClick={() => null}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[15px]">By <span className="font-semibold">@{post.requester_name || post.requester_address}</span></span>
                  {true && (<>
                    {/* <span className="text-gray-500 text-sm">in</span> */}
                    {(post.requester_me ? 'You' : 'Verified Human').split(',').map((community, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-transparent border border-[#8b5cf6] text-[#8b5cf6] mx-2 px-2 py-0 text-xs rounded-md"
                      >
                        {community.trim()}
                      </Badge>
                    ))}
                  </>)}
                </div>
                <button className="text-gray-500">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-1 text-[15px] whitespace-pre-wrap font-bold italic"></p>
              <p className="mt-4 text-[15px] whitespace-pre-wrap">{post.description}</p>
              <div className="flex items-center justify-between mt-3 text-[#6b7280]">
                <div className="flex items-center gap-6">
                  {/* <button className="flex items-center gap-1.5">
                    <MessageSquare className="w-[18px] h-[18px]" />
                    <span className="text-sm"></span>
                  </button>
                  <button className="flex items-center gap-1.5">
                    <span className="text-sm">0.1 WLD</span>
                  </button> */}
                  {/* <Badge 
                    variant="secondary" 
                    className={`bg-transparent border px-1.5 py-0 text-xs rounded-md ${post.status === 'open' ? 'border-green-500 text-green-500' : 
                      post.status === 'pending_payment' ? 'border-yellow-500 text-yellow-500' : 
                      post.status === 'paid' ? 'border-green-500 text-green-500' : 
                      post.status === 'rejected' ? 'border-red-500 text-red-500' : ''}`}
                  >
                    {post.status === 'open' ? 'Open' : 
                      post.status === 'pending_payment' ? 'To Be Paid' : 
                      post.status === 'paid' ? 'Paid' : 
                      post.status === 'rejected' ? 'Rejected' : ''}
                  </Badge> */}
                  {!post.requester_me && !post.requester_online &&
                      <Badge className="relative" 
                              variant="default"
                              onClick={() => null}>Offline</Badge>}
                  {post.requester_me && post.status === 'open' &&
                    <Badge className="relative text-yellow-500" 
                            variant="outline"
                            onClick={() => remove(post.id)}>Cancel</Badge>}
                  {post.requester_me && post.status === 'cancelled' &&
                    <Badge className="relative text-green-500" 
                            variant="outline"
                            >Cancelled</Badge>}
                </div>
                {!post.requester_me && post.requester_online &&
                      <Badge className="relative border-green-500 text-white bg-gradient-to-r from-red-500 to-blue-500 bg-[length:200%_200%] animate-gradient" 
                              variant="secondary"
                              onClick={() => initiateCall(post.id)}>Start Chat</Badge>}
              </div>
            </div>
          </div>
        </article>
      ))}

    </div>
  )
}