import { useSession } from 'next-auth/client'
import { useReducer } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { HomePageFeedUpdateType } from 'src/pages'
import { User } from 'src/pages/members'

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
  updateId,
  commentId,
  type,
  mutation,
}: {
  initialCount: number
  initialHasLiked: boolean
  updateId?: string
  commentId?: string
  type: 'UPDATE_LIKE' | 'COMMENT_LIKE'
  mutation: {
    endpoint: string
    body: any
  }
}) {
  const [session] = useSession()
  const queryClient = useQueryClient()

  const initialState: LikeData = {
    count: initialCount,
    hasLiked: initialHasLiked,
  }

  const { mutate } = useMutation(
    () => {
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
    },
    {
      onSuccess: (data, variables, context) => {
        if (type === 'UPDATE_LIKE') {
          queryClient.setQueryData<{ updates: HomePageFeedUpdateType[] }>(
            '/api/fauna/all-updates',
            (oldData) => ({
              updates: oldData.updates.filter((_update) => {
                if (_update.id === updateId) {
                  if (data.response.data.liked) {
                    _update.likes.data = [session.user, ..._update.likes.data]
                  } else {
                    _update.likes.data = _update.likes.data.filter(
                      (u) => u.id !== (session.user as User).id
                    )
                  }
                }
                return _update
              }),
            })
          )
        }

        if (type === 'COMMENT_LIKE') {
          queryClient.setQueryData<{ updates: HomePageFeedUpdateType[] }>(
            '/api/fauna/all-updates',
            (oldData) => ({
              updates: oldData.updates.filter((_update) => {
                if (_update.id === updateId) {
                  return _update.comments.data.map((_comment) => {
                    if (_comment.id === commentId) {
                      if (data.response.data.liked) {
                        _comment.likes.data = [
                          session.user,
                          ..._comment.likes.data,
                        ]
                      } else {
                        _comment.likes.data = _comment.likes.data.filter(
                          (u) => u.id !== (session.user as User).id
                        )
                      }
                    }
                    return _comment
                  })
                }
                return _update
              }),
            })
          )
        }
      },
    }
  )

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
