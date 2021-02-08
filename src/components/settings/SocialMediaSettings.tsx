import { Input, Button } from '@/ui'
import { useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { User } from 'src/pages/members'
import toast, { Toaster } from 'react-hot-toast'

type Inputs = {
  github: string
  facebook: string
  twitter: string
  linkedin: string
  codepen: string
}

export default function ProfileSettings() {
  const [session, loading] = useSession()
  const [user, setUser] = useState<User>({})
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const toastId = useRef('')

  const { mutate } = useMutation(
    (socials: Inputs) =>
      fetch(`/api/fauna/update-socials?id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ socials }),
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

  const onSubmit = async (data: Inputs) => {
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
                Social Media
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Share your social media links so that others can connect with
                you easily. Please fill only the usernames.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <Input
                label="GitHub"
                type="text"
                leadingAddon="github.com/"
                name="github"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.socials?.github ?? ''}
                ref={register}
                hasError={Boolean(errors.github)}
                errorMessage="Something went wrong!!"
              />
              <Input
                label="Facebook"
                type="text"
                leadingAddon="facebook.com/"
                name="facebook"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.socials?.facebook ?? ''}
                ref={register}
                hasError={Boolean(errors.facebook)}
                errorMessage="Something went wrong!!"
              />
              <Input
                label="Twitter"
                type="text"
                leadingAddon="twitter.com/"
                name="twitter"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.socials?.twitter ?? ''}
                ref={register}
                hasError={Boolean(errors.twitter)}
                errorMessage="Something went wrong!!"
              />
              <Input
                label="LinkedIn"
                type="text"
                leadingAddon="linkedin.com/in/"
                name="linkedin"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.socials?.linkedin ?? ''}
                ref={register}
                hasError={Boolean(errors.linkedin)}
                errorMessage="Something went wrong!!"
              />
              <Input
                label="CodePen"
                type="text"
                leadingAddon="codepen.io/"
                name="codepen"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.socials?.codepen ?? ''}
                ref={register}
                hasError={Boolean(errors.codepen)}
                errorMessage="Something went wrong!!"
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
