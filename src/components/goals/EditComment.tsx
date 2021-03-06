import { User } from 'src/pages/members'
import { Avatar, Button, TextArea } from '@/ui'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/client'
import { useMutation, useQueryClient } from 'react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useRef, useState } from 'react'
import { Markdown, A } from '@/components'
import { HomePageFeedUpdateType, UpdateCommentType } from 'src/pages'

type Inputs = {
  description: string
}

export default function EditComment({
  comment,
  cancelEditMode,
}: {
  comment: UpdateCommentType
  cancelEditMode: () => void
}) {
  const [descriptionStorage, setDescriptionStorage] = useState(
    comment.description
  )
  const queryClient = useQueryClient()
  const [session, loading] = useSession()
  const { handleSubmit, register, errors, reset } = useForm<Inputs>()
  const toastId = useRef('')
  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/goals/edit-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: comment.id,
          description: data.description,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: (data) => {
        toast.success('You have successfully updated your comment.', {
          id: toastId.current,
        })
        if (queryClient.getQueryState('/api/fauna/all-updates')) {
          queryClient.setQueryData<{ updates: HomePageFeedUpdateType[] }>(
            '/api/fauna/all-updates',
            (oldData) => ({
              updates: oldData.updates.map((_update) => {
                if (_update.id === comment.updateId) {
                  _update.comments.data = _update.comments.data.map(
                    (_comment) => {
                      if (_comment.id === comment.id) {
                        _comment = data.response
                      }
                      return _comment
                    }
                  )
                }
                return _update
              }),
            })
          )
        }
        cancelEditMode()
        reset()
      },
      onError: () => {
        toast.error('Something went wrong!!!', { id: toastId.current })
      },
    }
  )
  const onSubmit = (data: Inputs) => {
    const id = toast.loading('Saving your comment...')
    toastId.current = id
    mutate(data)
    setDescriptionStorage('')
  }
  if (loading) {
    return <p>loading...</p>
  }
  return (
    <>
      <Toaster />
      <div className="mt-6">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="relative">
              <A href={`/${(session.user as User).username}`}>
                <Avatar
                  src={(session.user as User).image}
                  alt={(session.user as User).account?.firstName}
                />
              </A>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextArea
                ref={register({ required: true })}
                label="Comment"
                defaultValue={comment.description}
                name="description"
                hideLabel={true}
                rows={3}
                placeholder="Give suggestions or ask questions related to the update."
                hasError={Boolean(errors.description)}
                errorMessage="Comment is required!!!"
                helpText="[Basic Markdown](/markdown) is supported."
                onKeyDown={(e) => {
                  if (e.code === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmit(onSubmit)()
                  }
                }}
                onChange={(e) => {
                  setDescriptionStorage(e.target.value)
                }}
              ></TextArea>
              {descriptionStorage && (
                <div className="prose max-w-none mt-2 border rounded p-4">
                  <Markdown>{descriptionStorage}</Markdown>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end space-x-4">
                <Button onClick={() => cancelEditMode()}>Cancel</Button>
                <Button variant="solid" variantColor="brand" type="submit">
                  Add Comment
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
