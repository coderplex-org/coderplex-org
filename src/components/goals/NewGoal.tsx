import { Button, Input, TextArea } from '@/ui'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useRef, useState } from 'react'
import { useSession } from 'next-auth/client'
import { User } from 'src/pages/members'
import { Tabs, Markdown } from '@/components'

type Inputs = {
  title: string
}

export default function NewGoal() {
  const [isInPreviewMode, setIsInPreviewMode] = useState(false)
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const toastId = useRef('')
  const [session] = useSession()
  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/goals/create-and-participate-in-a-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: () => {
        toast.success('You have successfully set your goal.', {
          id: toastId.current,
        })
        queryClient.refetchQueries([
          '/api/fauna/goals/all-goals-by-user',
          (session.user as User).id,
        ])
      },
      onError: () => {
        toast.error('Something went wrong!!!', { id: toastId.current })
      },
    }
  )

  const onSubmit = (data: Inputs) => {
    const id = toast.loading('Setting your goal...')
    toastId.current = id
    mutate(data)
  }
  return (
    <>
      <Toaster />
      <div className="mt-6">
        <div className="flex space-x-3">
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                ref={register({ required: true })}
                name="title"
                label="Goal Title"
                type="text"
                placeholder="Participate in #100DaysOfCode"
                hasError={Boolean(errors.title)}
                errorMessage="Title is required"
              />
              <Tabs
                tabs={[
                  {
                    name: 'Write',
                    value: 'write',
                    isSelected: !isInPreviewMode,
                    onClick: () => setIsInPreviewMode(false),
                  },
                  {
                    name: 'Preview',
                    value: 'preview',
                    isSelected: isInPreviewMode,
                    onClick: () => setIsInPreviewMode(true),
                  },
                ]}
                className="mt-4 mb-1"
              />
              {isInPreviewMode ? (
                <div className="prose max-w-none mt-2">
                  <Markdown>{description}</Markdown>
                </div>
              ) : (
                <TextArea
                  name="description"
                  label="Goal description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="I will code for atleast 2 hours everyday."
                  helpText="Basic markdown is supported."
                  onKeyDown={(e) => {
                    console.log(e.shiftKey, e.ctrlKey)
                    if (e.code === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSubmit(onSubmit)()
                    }
                  }}
                ></TextArea>
              )}

              <div className="mt-6 flex items-center justify-end space-x-4">
                <Button variant="solid" variantColor="brand" type="submit">
                  Set my goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
