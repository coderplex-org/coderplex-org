import { Button, Input, TextArea } from '@/ui'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import { Markdown, GoalType } from '@/components'

type Inputs = {
  title: string
  description: string
  deadline: Date
}

export default function EditGoal({
  goal,
  onCancelClick,
}: {
  goal: GoalType
  onCancelClick: () => void
}) {
  const [descriptionStorage, setDescriptionStorage] = useState(goal.description)
  useEffect(() => {
    setDescriptionStorage(goal.description)
  }, [goal.description])
  const queryClient = useQueryClient()
  const { register, handleSubmit, errors, trigger } = useForm<Inputs>()
  const toastId = useRef('')
  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/goals/update-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: goal.id,
          title: data.title,
          description: data.description,
          creatorId: goal.creatorId,
          deadline: data.deadline,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: () => {
        toast.success('You have successfully updated your goal.', {
          id: toastId.current,
        })
        queryClient.refetchQueries('/api/fauna/goals/all-goals-by-user')
        onCancelClick()
      },
      onError: () => {
        toast.error('Something went wrong!!!', { id: toastId.current })
      },
    }
  )

  const onSubmit = (data: Inputs) => {
    const id = toast.loading('Updating your goal...')
    toastId.current = id
    mutate(data)
  }
  return (
    <>
      <Toaster />
      <div className="mt-6">
        <div className="flex space-x-3">
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Input
                ref={register({ required: true, maxLength: 50 })}
                defaultValue={goal.title}
                name="title"
                label="What is your goal?"
                type="text"
                placeholder="Participate in #100DaysOfCode"
                hasError={Boolean(errors.title)}
                errorMessage={
                  errors.title?.type === 'maxLength'
                    ? 'Title should have less than 50 chars'
                    : 'Title is required'
                }
              />

              <Input
                type="date"
                label="By what time do you want to achieve this goal?"
                ref={register({ valueAsDate: true, required: true })}
                name="deadline"
                defaultValue={goal.deadline.toISODate()}
                hasError={Boolean(errors.deadline)}
                errorMessage="You must set the deadline."
              />

              <TextArea
                ref={register}
                defaultValue={goal.description}
                name="description"
                label="What is your plan to achieve this goal?"
                rows={5}
                placeholder="I will code for atleast 2 hours everyday."
                helpText="[Basic Markdown](/markdown) is supported."
                hasError={Boolean(errors.description)}
                errorMessage="Something went wrong!!!"
                onKeyDown={async (e) => {
                  if (e.code === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    await trigger()
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
                <Button onClick={() => onCancelClick()}>Cancel</Button>
                <Button variant="solid" variantColor="brand" type="submit">
                  Update my goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
