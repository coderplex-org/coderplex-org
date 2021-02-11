import { Input, Button } from '@/ui'
import { useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { User } from 'src/pages/members'
import toast, { Toaster } from 'react-hot-toast'

type Inputs = {
  email: string
  careerGoal: string
}

export default function PrivateSettings() {
  const [session, loading] = useSession()
  const [user, setUser] = useState<User>({})
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const toastId = useRef('')

  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/update-profile?id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: data.email,
            account: {
              careerGoal: data.careerGoal,
            },
          },
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: () => {
        toast.success('Successfully updated!', { id: toastId.current })
      },
      onError: () => {
        toast.error('Something went wrong!!!', { id: toastId.current })
      },
    }
  )

  useEffect(() => {
    if (!loading && session) {
      setUser(session.user)
    }
  }, [loading, session])

  if (loading) {
    return <p>loding...</p>
  }

  if (!session) {
    return <p>You are not logged in...</p>
  }

  const onSubmit = async (data) => {
    const id = toast.loading('Updating user details...')

    toastId.current = id
    mutate(data)
  }

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-6 space-y-6 bg-white sm:p-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Private Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will <span className="font-bold">NOT</span> be
                displayed publicly unless you allow us to.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <Input
                label="Email"
                type="email"
                name="email"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.email}
                ref={register({
                  required: true,
                  validate: (email: string) => {
                    if (email === user.email) {
                      return true
                    }
                    return fetch(`/api/fauna/is-unique-email`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email }),
                    })
                      .then((res) => res.json())
                      .then((data) => data.isValid)
                  },
                })}
                hasError={Boolean(errors.email)}
                errorMessage={
                  errors.email?.type === 'validate'
                    ? 'There is another account with the same email'
                    : 'This field is required'
                }
              />
              <Input
                label="What is your current career goal?"
                type="text"
                name="careerGoal"
                className="col-span-4 sm:col-span-2 sm:row-start-2"
                defaultValue={user.account?.careerGoal ?? ''}
                ref={register}
                hasError={Boolean(errors.careerGoal)}
                errorMessage="Something went wrong!"
              />
            </div>
          </div>
          <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <Button variant="solid" variantColor="brand" type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
