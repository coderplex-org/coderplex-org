import { Input, TextArea, Button, Avatar } from '@/ui'
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
  image: string
}

export default function ProfileSettings() {
  const [session, loading] = useSession()
  const [user, setUser] = useState<User>({})
  const { register, handleSubmit, errors, watch } = useForm<Inputs>()
  const toastId = useRef('')
  const { image } = watch()

  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/update-profile?id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: data.username,
            image: data.image,
            account: {
              firstName: data.firstName,
              lastName: data.lastName,
              bio: data.bio,
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
                Public Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-4 flex flex-col-reverse md:grid md:grid-cols-4">
                <div className="flex md:col-span-3 flex-col gap-6 max-w-lg">
                  <Input
                    label="Username"
                    type="text"
                    leadingAddon="coderplex.org/"
                    name="username"
                    defaultValue={user.username}
                    ref={register({
                      required: true,
                      validate: (username: string) => {
                        if (username === user.username) {
                          return true
                        }
                        return fetch(`/api/fauna/is-unique-username`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ username }),
                        })
                          .then((res) => res.json())
                          .then((data) => data.isValid)
                      },
                    })}
                    hasError={Boolean(errors.username)}
                    errorMessage={
                      errors.username?.type === 'validate'
                        ? 'Username is already taken'
                        : 'This field is required'
                    }
                  />

                  <Input
                    label="Profile Picture"
                    type="url"
                    name="image"
                    defaultValue={user.image ?? ''}
                    ref={register({ required: true })}
                    hasError={Boolean(errors.image)}
                    errorMessage="This field is required"
                  />
                </div>
                <div className="md:col-span-1 grid place-items-center">
                  {image && <Avatar src={image} className="w-32 h-32" />}
                </div>
              </div>

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
                defaultValue={user.account?.firstName}
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
