import { Input, Button, Select } from '@/ui'
import { useSession } from 'next-auth/client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { User } from 'src/pages/members'
import toast, { Toaster } from 'react-hot-toast'

type Inputs = {
  userType: 'developer' | 'employer' | 'none'
  mobile: string
  isCurrentlyWorking: 'yes' | 'no' | 'none'
  lookingForWork: 'yes' | 'no' | 'none'
  company: string
  technologiesFamiliarWith: string[]
}

export default function OtherSettings() {
  const [session, loading] = useSession()
  const [user, setUser] = useState<User>({})
  const { register, handleSubmit, errors, watch } = useForm<Inputs>()
  const toastId = useRef('')
  const { isCurrentlyWorking } = watch()

  const { mutate } = useMutation(
    (data: Inputs) =>
      fetch(`/api/fauna/update-profile?id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            otherDetails: data,
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
              <Select
                defaultValue={user.otherDetails?.userType ?? 'none'}
                ref={register}
                name="userType"
                className="col-span-4 sm:col-span-2"
                label="How do you best describe yourself as?"
                key={`userType-${user.otherDetails?.userType ?? 'none'}`}
              >
                <option value="yes">Developer</option>
                <option value="no">Employer</option>
                <option value="none">Prefer not to say</option>
              </Select>
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
              <Select
                defaultValue={user.otherDetails?.isCurrentlyWorking ?? 'none'}
                ref={register}
                name="isCurrentlyWorking"
                className="col-span-4 sm:col-span-2"
                label="Are you currently working?"
                key={`isCurrentlyWorking-${
                  user.otherDetails?.isCurrentlyWorking ?? 'none'
                }`}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="none">Prefer not to say</option>
              </Select>
              {(isCurrentlyWorking === undefined ||
                isCurrentlyWorking === 'yes') && (
                <Input
                  label="Where are you working at?"
                  type="text"
                  name="company"
                  className="col-span-4 sm:col-span-2"
                  defaultValue={user.otherDetails?.company ?? ''}
                  ref={register}
                  hasError={Boolean(errors.company)}
                  errorMessage="Something went wrong!!!"
                  key={`company-${user.otherDetails?.company ?? ''}`}
                />
              )}
              {(isCurrentlyWorking === undefined ||
                isCurrentlyWorking === 'no') && (
                <Select
                  defaultValue={user.otherDetails?.lookingForWork ?? 'none'}
                  ref={register}
                  name="lookingForWork"
                  className="col-span-4 sm:col-span-2"
                  label="Are you looking for work?"
                  key={`lookingForWork-${
                    user.otherDetails?.lookingForWork ?? 'none'
                  }-${user.otherDetails?.isCurrentlyWorking ?? 'none'}`}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="none">Prefer not to say</option>
                </Select>
              )}
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
