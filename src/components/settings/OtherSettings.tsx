import { Input, Button } from '@/ui'
import { useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { User } from 'src/pages/members'
import toast, { Toaster } from 'react-hot-toast'
import Checkbox from 'src/ui/form/Checkbox'

type Inputs = {
  userType: 'developer' | 'employer'
  mobile: string
  isCurrentlyWorking: boolean
  technologiesFamiliarWith: string[]
}

export default function OtherSettings() {
  const [session, loading] = useSession()
  const [user, setUser] = useState<User>({})
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const toastId = useRef('')

  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/update-other-settings?id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: data }),
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
                Other Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will not be displayed publicly unless you
                allow.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <Input
                label="Contact Number"
                type="number"
                name="mobile"
                className="col-span-4 sm:col-span-2"
                defaultValue={user.otherDetails?.mobile ?? ''}
                ref={register({ minLength: 10, maxLength: 10 })}
                hasError={Boolean(errors.mobile)}
                errorMessage="Mobile number should have 10 digits!!"
              />
              <Checkbox
                id="isCurrentlyWorkingInput"
                label="Are you currently working?"
                className="col-span-4 sm:col-span-3"
                name="isCurrentlyWorking"
                defaultChecked={user.otherDetails?.isCurrentlyWorking}
                ref={register}
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
