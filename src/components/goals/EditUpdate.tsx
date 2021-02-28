import { User } from 'src/pages/members'
import { Avatar, Button, TextArea } from '@/ui'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/client'
import { useMutation, useQueryClient } from 'react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useRef, useState } from 'react'
import { Markdown, A } from '@/components'
import { GoalResponse } from 'src/pages/[username]'
import { HomePageFeedUpdateType } from 'src/pages'

type Inputs = {
  description: string
}

export default function EditUpdate({
  goalId,
  update,
  updateFromHomePage = false,
  cancelEditMode,
}: {
  goalId: string
  update: { id: string; description: string }
  updateFromHomePage?: boolean
  cancelEditMode: () => void
}) {
  const [descriptionStorage, setDescriptionStorage] = useState(
    update.description
  )
  const queryClient = useQueryClient()
  const [session, loading] = useSession()
  const { handleSubmit, register, errors, reset } = useForm<Inputs>()
  const toastId = useRef('')
  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/goals/edit-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: update.id,
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
        toast.success('You have successfully edited the update.', {
          id: toastId.current,
        })

        queryClient.setQueryData<GoalResponse[]>(
          '/api/fauna/goals/all-goals-by-user',
          (oldData) => {
            if (!oldData) {
              return oldData
            }
            return oldData.map((goalResponse) => {
              if (goalResponse.id === goalId) {
                goalResponse.updates = {
                  data: goalResponse.updates.data.map((_update) => {
                    if (_update.id === update.id) {
                      _update = {
                        id: data.id,
                        description: data.description,
                        createdAt: data.createdAt,
                        postedBy: data.postedBy,
                      }
                    }
                    return _update
                  }),
                }
              }
              return goalResponse
            })
          }
        )

        if (updateFromHomePage) {
          if (queryClient.getQueryState('/api/fauna/all-updates')) {
            queryClient.setQueryData<{ updates: HomePageFeedUpdateType[] }>(
              '/api/fauna/all-updates',
              (oldData) => ({
                updates: oldData.updates.map((_update) => {
                  if (_update.id === update.id) {
                    _update = data
                  }
                  return _update
                }),
              })
            )
          }

          if (
            queryClient.getQueryState(['/api/fauna/recent-updates', goalId])
          ) {
            queryClient.setQueryData<{ response: GoalResponse }>(
              ['/api/fauna/recent-updates', goalId],
              (oldData) => ({
                response: {
                  ...oldData.response,
                  updates: {
                    data: oldData.response.updates.data.map((_update) => {
                      if (_update.id === update.id) {
                        _update = {
                          id: data.id,
                          description: data.description,
                          createdAt: data.createdAt,
                          postedBy: data.postedBy,
                        }
                      }
                      return _update
                    }),
                  },
                },
              })
            )
          }
        }
        reset()
        cancelEditMode()
      },
      onError: () => {
        toast.error('Something went wrong!!!', { id: toastId.current })
      },
    }
  )
  const onSubmit = (data: Inputs) => {
    const id = toast.loading('Posting your update...')
    toastId.current = id
    mutate(data)
    setDescriptionStorage(update.description)
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
                <Avatar src={(session.user as User).image} />
              </A>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextArea
                ref={register({ required: true })}
                label="Update"
                name="description"
                defaultValue={update.description}
                hideLabel={true}
                rows={3}
                placeholder="What did you do today to move towards your goal?"
                hasError={Boolean(errors.description)}
                errorMessage="Update is required!!!"
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
                  Save Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
