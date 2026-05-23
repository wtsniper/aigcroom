'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name: string | null
  image: string | null
}

interface CommentType {
  id: string
  content: string
  createdAt: string
  user: User
  replies?: CommentType[]
}

interface CommentSectionProps {
  toolId?: string
  reviewId?: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CommentItem({
  comment,
  currentUser,
  onReply,
  onDelete,
}: {
  comment: CommentType
  currentUser: User | null
  onReply: (parentId: string, userName: string) => void
  onDelete: (commentId: string) => void
}) {
  const isOwner = currentUser && currentUser.id === comment.user.id
  const isAdmin = currentUser && (currentUser as any).role === 'ADMIN'

  return (
    <div className="flex gap-3 group">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {(comment.user.name || 'U')[0].toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {comment.user.name || 'Anonymous'}
          </span>
          <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
        <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {currentUser && (
            <button
              onClick={() => onReply(comment.id, comment.user.name || 'User')}
              className="text-xs text-gray-400 hover:text-blue-600"
            >
              Reply
            </button>
          )}
          {(isOwner || isAdmin) && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-gray-400 hover:text-red-600"
            >
              Delete
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ml-2 pl-3 border-l-2 border-gray-100 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                onReply={onReply}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentSection({ toolId, reviewId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchComments()
  }, [toolId, reviewId])

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams()
      if (toolId) params.set('toolId', toolId)
      if (reviewId) params.set('reviewId', reviewId)

      const res = await fetch(`/api/comments?${params}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Fetch comments error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !currentUser) return

    setLoading(true)
    try {
      const body: Record<string, string> = { content: content.trim() }
      if (toolId) body.toolId = toolId
      if (reviewId) body.reviewId = reviewId
      if (replyTo) body.parentId = replyTo.id

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setContent('')
        setReplyTo(null)
        fetchComments()
      }
    } catch (error) {
      console.error('Submit comment error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (parentId: string, userName: string) => {
    setReplyTo({ id: parentId, name: userName })
    setContent(`@${userName} `)
  }

  const handleDelete = async (commentId: string) => {
    if (!currentUser || !confirm('Delete this comment?')) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) fetchComments()
    } catch (error) {
      console.error('Delete comment error:', error)
    }
  }

  const totalComments = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  )

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comments ({totalComments})
      </h3>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {(currentUser.name || 'U')[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              {replyTo && (
                <div className="flex items-center gap-2 mb-2 text-sm text-blue-600">
                  <span>Replying to {replyTo.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null)
                      setContent('')
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={replyTo ? `Reply to ${replyTo.name}...` : 'Share your thoughts...'}
                rows={3}
                maxLength={2000}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{content.length}/2000</span>
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-3">Join the conversation</p>
          <Link
            href={`/login${typeof window !== 'undefined' ? '?redirect=' + encodeURIComponent(window.location.pathname) : ''}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
          >
            Log in to comment
          </Link>
        </div>
      )}

      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  )
}
