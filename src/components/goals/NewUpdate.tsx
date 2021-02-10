import { User } from 'src/pages/members'
import { Avatar, Button } from '@/ui'

export default function NewUpdate({ user }: { user: User }) {
  return (
    <>
      <div className="mt-6">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar src={user.image} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <form>
              <div>
                <label htmlFor="comment" className="sr-only">
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-brand-700 focus:border-brand-700 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Leave a comment"
                ></textarea>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-4">
                <Button variant="solid" variantColor="brand" type="submit">
                  Comment
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
