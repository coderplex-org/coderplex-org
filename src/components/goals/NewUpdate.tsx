import { User } from 'src/pages/members'
import { Avatar, Button, TextArea } from '@/ui'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/client'
import { useMutation, useQueryClient } from 'react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useRef, useState } from 'react'
import { Markdown, A } from '@/components'
import { HomePageFeedUpdateType } from 'src/pages'
import { GoalResponse } from 'src/pages/[username]'

type Inputs = {
  description: string
}

export default function NewUpdate({
  goal,
  updateFromHomePage = false,
}: {
  goal: { id: string; title: string }
  updateFromHomePage?: boolean
}) {
  const [descriptionStorage, setDescriptionStorage] = useState('')
  const queryClient = useQueryClient()
  const [session, loading] = useSession()
  const { handleSubmit, register, errors, reset } = useForm<Inputs>()
  const toastId = useRef('')
  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/goals/add-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId: goal.id,
          description: data.description,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: (data, variables, context) => {
        toast.success('You have successfully added an update.', {
          id: toastId.current,
        })

        queryClient.setQueryData<GoalResponse[]>(
          '/api/fauna/goals/all-goals-by-user',
          (oldData) => {
            if (!oldData) {
              return oldData
            }
            return oldData.map((goalResponse) => {
              if (goalResponse.id === goal.id) {
                goalResponse.updates = {
                  data: [
                    ...goalResponse.updates.data,
                    {
                      id: data.response.id,
                      description: data.response.description,
                      createdAt: data.response.createdAt,
                      postedBy: data.response.postedBy,
                    },
                  ],
                }
              }
              return goalResponse
            })
          }
        )

        if (updateFromHomePage) {
          queryClient.setQueryData<{ updates: HomePageFeedUpdateType[] }>(
            '/api/fauna/all-updates',
            (oldData) => {
              if (!oldData) {
                return oldData
              }
              return {
                updates: [data.response, ...oldData.updates],
              }
            }
          )

          queryClient.setQueryData<{ response: GoalResponse }>(
            ['/api/fauna/recent-updates', goal.id],
            (oldData) => {
              // If the recent-updates panel is not opened yet
              // then this oldData will be undefined
              // since the corresponsing query is not execcuted even once
              if (!oldData) {
                return oldData
              }
              return {
                response: {
                  ...oldData.response,
                  updates: {
                    data: [
                      ...oldData.response.updates.data,
                      {
                        id: data.response.id,
                        description: data.response.description,
                        createdAt: data.response.createdAt,
                        postedBy: data.response.postedBy,
                      },
                    ],
                  },
                },
              }
            }
          )
        }

        reset()
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
                label="Update"
                name="description"
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
                <Button variant="solid" variantColor="brand" type="submit">
                  Post Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
