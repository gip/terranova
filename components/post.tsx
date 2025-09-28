import { useState, type ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "./ui/textarea"

export const Post = ({ done }: { done: () => void }) => {
  const [request, setRequest] = useState('Looking to video chat with a real human based anywhere speaking English or Spanish for an open and fun discussion.')
  
  const handleSubmit = async () => {
    await fetch('/api/request', {
        method: 'POST',
        body: JSON.stringify({ description: request })
      })
    done()
  }

  const handleCancel = () => {
    done()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center pt-4">
        Request
      </div>
      <div className="px-4 py-3">
        <Textarea
          placeholder="Write your answer here..."
          value={request}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRequest(e.target.value)}
          className="min-h-48 mb-4 text-lg"
        />
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="text-3xl rounded-full px-6 py-8 w-4/5 border-2 border-green-500"
            disabled={!request.trim()} // Disable button if answer is empty
          >
            Submit
          </Button>
        </div>
        <div className="flex justify-center">Free today (normally 0.1 WLD)</div>
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleCancel}
            className="text-3xl rounded-full px-6 py-8 w-4/5 border-2 border-red-500"
          >
            Cancel
          </Button>
        </div>
      </div>

    </div>
  )
}