import { useReducer } from 'react'
import { useMutation } from 'react-query'

type LikeData = {
  count: number
  hasLiked: boolean
}

function reducer(state: LikeData, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'toggle':
      return {
        hasLiked: !state.hasLiked,
        count: state.hasLiked
          ? Number(state.count) - 1
          : Number(state.count) + 1,
      }
    case 'set':
      return { count: action.payload.count, hasLiked: action.payload.hasLiked }
    default:
      throw new Error()
  }
}

export function useLikes({
  initialCount,
  initialHasLiked,
  mutation,
}: {
  initialCount: number
  initialHasLiked: boolean
  mutation: {
    endpoint: string
    body: any
  }
}) {
  const initialState: LikeData = {
    count: initialCount,
    hasLiked: initialHasLiked,
  }

  const { mutate } = useMutation(() => {
    return fetch(mutation.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mutation.body),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('something went wrong!!!')
      }
      return res.json()
    })
  })

  const [{ count, hasLiked }, dispatch] = useReducer(reducer, initialState)

  const toggleLike = () => {
    dispatch({ type: 'toggle' })
    mutate()
  }

  return {
    count,
    hasLiked,
    toggleLike,
  }
}
