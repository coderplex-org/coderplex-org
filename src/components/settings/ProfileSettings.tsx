import { Input, TextArea, Button } from '@/ui'
import { useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { User } from 'src/pages/members'
import toast, { Toaster } from 'react-hot-toast'

type Inputs = {
  username: string
  firstName: string
  lastName: string
  bio: string
}

export default function ProfileSettings() {
  const [session, loading] = useSession()
  const [user, setUser] = useState<User>({})
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const toastId = useRef('')

  const { isError, isLoading, isSuccess, mutate, data: response } = useMutation(
    (data: { username: string; firstName: string; lastName: string }) =>
      fetch(`/api/fauna/update-profile?id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: data }),
      }).then((res) => res.json()),
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
    const id = toast.loading('updating user details...')

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
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <Input
                label="Username"
                type="text"
                leadingAddon="coderplex.org/"
                name="username"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.username}
                ref={register({ required: true })}
                hasError={Boolean(errors.username)}
                errorMessage="This field is required"
              />

              <TextArea
                className="col-span-4 sm:col-span-3"
                label="About"
                name="bio"
                rows={3}
                placeholder="Software Engineer, Tech Blogger..."
                helpText="Brief description for your profile. URLs are hyperlinked."
                ref={register}
                hasError={Boolean(errors.bio)}
                errorMessage="Something went wrong!!"
                defaultValue={user.account?.bio ?? ''}
              ></TextArea>

              <Input
                label="First name"
                type="text"
                name="firstName"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.account?.firstName ?? user.name}
                ref={register({ required: true })}
                hasError={Boolean(errors.firstName)}
                errorMessage="This field is required"
              />

              <Input
                label="Last name"
                type="text"
                name="lastName"
                className="col-span-4 sm:col-span-2"
                ref={register}
                hasError={Boolean(errors.lastName)}
                errorMessage="Something went wrong!!"
                defaultValue={user.account?.lastName ?? ''}
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
