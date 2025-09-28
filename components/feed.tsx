import { Badge } from "@/components/ui/badge"
import { MessageSquare, MoreHorizontal } from "lucide-react"
import { Request } from '@/lib/types'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export const Feed = ({ posts }: { posts: Request[], setPost: (post: Request) => void }) => {
  const [filter, setFilter] = useState<string>('Active')

  const statusMap = {
    'Active': 'open',
    'Yours': 'pending_payment',
    'Paid': 'paid',
    'Rejected': 'rejected'
  }

  const initiateCall =async (id: string) => {
    const result = await fetch('/api/call', { method: 'POST', body: JSON.stringify({ id }) })
    if(result.ok) {
        window.location.href = `/call?id=${id}`
    }
  }

  const filteredPosts = posts.filter(post => 
    filter === 'All' ? true : post.status === statusMap[filter as keyof typeof statusMap]
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3 px-4 mb-4 mt-4">
        {['All', 'Active', 'Yours', 'Paid', 'Rejected'].map((status) => (
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
              <div className="flex items-center gap-6 mt-3 text-[#6b7280]">
                <button className="flex items-center gap-1.5">
                  <MessageSquare className="w-[18px] h-[18px]" />
                  <span className="text-sm"></span>
                </button>
                <button className="flex items-center gap-1.5">
                  <span className="text-sm">0.1 WLD</span>
                </button>
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
                {!post.requester_me && post.requester_online &&
                    <Button className="relative border-green-500 text-white bg-gradient-to-r from-red-500 to-blue-500 bg-[length:200%_200%] animate-gradient" 
                            size='sm' 
                            variant="outline"
                            onClick={() => initiateCall(post.id)}>Start Chat</Button>}
                {!post.requester_me && !post.requester_online &&
                    <Button className="relative" 
                            size='sm' 
                            variant="outline"
                            onClick={() => null}>Offline</Button>}
              </div>
            </div>
          </div>
        </article>
      ))}

    {/* <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="bg-black border-2 border-[#1c1c1f] max-w-[90%] rounded-xl">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className={`text-2xl font-bold text-center ${
              modalContent.accepted ? 'text-green-500' : 'text-red-500'
            }`}>
              {modalContent.accepted ? 'Answer Accepted' : 'Answer Not Accepted'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-center text-gray-300">
              {modalContent.reason}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction 
              onClick={handleModalClose}
              className="text-xl rounded-full px-6 py-4 w-full sm:w-2/3 border-2 border-[#8b5cf6] bg-transparent hover:bg-[#8b5cf6]/20 transition-colors"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}


    </div>
  )
}