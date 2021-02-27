import { useEffect, useReducer } from 'react'
import { useMutation, useQuery } from 'react-query'

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
  query,
  mutation,
}: {
  initialCount: number
  query: {
    key: string | string[]
    endpoint: string
    body: any
  }
  mutation: {
    endpoint: string
    body: any
  }
}) {
  const initialState: LikeData = { count: initialCount, hasLiked: false }
  const { isLoading, isError, data } = useQuery(query.key, () => {
    return fetch(query.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query.body),
    }).then((res) => res.json())
  })

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

  useEffect(() => {
    if (!isLoading && !isError) {
      dispatch({
        type: 'set',
        payload: { hasLiked: data.liked, count: initialCount },
      })
    }
  }, [data?.liked, initialCount, isError, isLoading])

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
