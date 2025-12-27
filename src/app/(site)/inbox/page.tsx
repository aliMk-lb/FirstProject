'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@/utils/api'

type Message = {
  id: number
  name: string
  email: string
  subject: string
  message?: string
  status?: 'new' | 'read'
  created_at?: string
}

const InboxPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [userName, setUserName] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const badgeStyles = (status?: 'new' | 'read') => {
    const base =
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors'
    if (status === 'read') {
      return `${base} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/30`
    }
    return `${base} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30`
  }

  const actionButton =
    'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B1E3A]'

  const fetchMessages = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token') || ''
      const response = await fetch(`${API_BASE}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token) {
      window.location.href = '/signin'
      return
    }

    if (!storedUser) {
      window.location.href = '/signin'
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      if (!parsedUser?.email) {
        window.location.href = '/signin'
        return
      }
      if (parsedUser.email !== 'admin@gmail.com') {
        alert('Admin only')
        window.location.href = '/'
        return
      }
      setUserName(parsedUser.name || parsedUser.email || 'User')
      setAuthorized(true)
    } catch (_err) {
      window.location.href = '/signin'
    }
  }, [])

  useEffect(() => {
    if (authorized) {
      fetchMessages()
    }
  }, [authorized])

  useEffect(() => {
    if (!authorized) return
    const header = document.querySelector('header') as HTMLElement | null
    if (header) {
      const previousDisplay = header.style.display
      header.style.display = 'none'
      return () => {
        header.style.display = previousDisplay
      }
    }
  }, [authorized])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const updateStatus = async (id: number, status: 'new' | 'read') => {
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token') || ''
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
      )
      setSuccess('Status updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const deleteMessage = async (id: number) => {
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token') || ''
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete message')
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== id))
      setSuccess('Message deleted successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message')
    }
  }

  return (
    <main className='min-h-screen bg-white dark:bg-[#0B1E3A] text-slate-900 dark:text-white px-4 pt-28 pb-12'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-slate-500 dark:text-white/60'>
              Messages
            </p>
            <h1 className='text-3xl font-bold tracking-tight'>Inbox</h1>
          </div>
          <div className='flex items-center gap-3 flex-wrap justify-end'>
            {userName && (
              <span className='px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-white'>
                {userName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className={`${actionButton} bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500`}>
              Logout
            </button>
            <button
              onClick={fetchMessages}
              className={`${actionButton} bg-primary hover:bg-primary/80 text-white focus-visible:ring-primary`}>
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <p className='text-slate-600 dark:text-white/70 mb-4'>
            Loading messages...
          </p>
        )}
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {success && <p className='text-green-500 mb-4'>{success}</p>}

        {messages.length === 0 && !loading ? (
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/50'>
            No messages found.
          </div>
        ) : isMobile ? (
          <div className='space-y-4'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className='rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-white/10 dark:bg-white/5'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='space-y-1'>
                    <div className='font-semibold text-slate-900 dark:text-white/90'>
                      {msg.name}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className='text-primary text-sm hover:underline break-all'>
                      {msg.email}
                    </a>
                    <div className='text-sm text-slate-600 dark:text-white/70'>
                      {msg.subject}
                    </div>
                  </div>
                  <span className={badgeStyles(msg.status)}>
                    {msg.status ?? 'new'}
                  </span>
                </div>
                <div className='mt-3 text-sm text-slate-700 dark:text-white/80 break-words'>
                  <div
                    className={`${
                      expandedId === msg.id
                        ? 'whitespace-pre-wrap'
                        : 'max-h-16 overflow-hidden'
                    }`}>
                    {msg.message || '-'}
                  </div>
                  {msg.message && msg.message.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === msg.id ? null : msg.id)
                      }
                      className='mt-1 text-xs font-medium text-primary hover:underline'>
                      {expandedId === msg.id ? 'Collapse' : 'View more'}
                    </button>
                  )}
                </div>
                <div className='mt-3 text-xs text-slate-500 dark:text-white/60'>
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleString()
                    : '-'}
                </div>
                <div className='mt-4 flex flex-wrap gap-2'>
                  <button
                    onClick={() => updateStatus(msg.id, 'read')}
                    className={`${actionButton} bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500`}>
                    Mark read
                  </button>
                  <button
                    onClick={() => updateStatus(msg.id, 'new')}
                    className={`${actionButton} bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400`}>
                    Mark new
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className={`${actionButton} bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500`}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-white/5'>
            <table className='min-w-full text-left text-sm'>
              <thead className='bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-white/80'>
                <tr>
                  <th className='px-5 py-3 font-semibold'>Name</th>
                  <th className='px-5 py-3 font-semibold'>Email</th>
                  <th className='px-5 py-3 font-semibold'>Subject</th>
                  <th className='px-5 py-3 font-semibold'>Message</th>
                  <th className='px-5 py-3 font-semibold'>Status</th>
                  <th className='px-5 py-3 font-semibold'>Date</th>
                  <th className='px-5 py-3 font-semibold text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className='border-b border-slate-200 last:border-none hover:bg-slate-100/60 dark:border-white/10 dark:hover:bg-white/5 transition-colors'>
                    <td className='px-5 py-4 align-top'>
                      <div className='font-semibold text-slate-900 dark:text-white/90'>
                        {msg.name}
                      </div>
                    </td>
                    <td className='px-5 py-4 align-top'>
                      <a
                        href={`mailto:${msg.email}`}
                        className='text-primary hover:underline break-all'>
                        {msg.email}
                      </a>
                    </td>
                    <td className='px-5 py-4 align-top text-slate-700 dark:text-white/80'>
                      {msg.subject}
                    </td>
                    <td className='px-5 py-4 align-top text-slate-700 dark:text-white/80'>
                      <div
                        className={`break-words ${
                          expandedId === msg.id
                            ? 'whitespace-pre-wrap'
                            : 'max-h-12 overflow-hidden'
                        }`}>
                        {msg.message || '-'}
                      </div>
                      {msg.message && msg.message.length > 0 && (
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === msg.id ? null : msg.id)
                          }
                          className='mt-2 text-xs font-medium text-primary hover:underline'>
                          {expandedId === msg.id ? 'Collapse' : 'View'}
                        </button>
                      )}
                    </td>
                    <td className='px-5 py-4 align-top'>
                      <span className={badgeStyles(msg.status)}>
                        {msg.status ?? 'new'}
                      </span>
                    </td>
                    <td className='px-5 py-4 align-top text-slate-600 dark:text-white/70'>
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleString()
                        : '-'}
                    </td>
                    <td className='px-5 py-4 align-top text-right'>
                      <div className='flex flex-wrap gap-2 justify-end'>
                        <button
                          onClick={() => updateStatus(msg.id, 'read')}
                          className={`${actionButton} bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500`}>
                          Mark read
                        </button>
                        <button
                          onClick={() => updateStatus(msg.id, 'new')}
                          className={`${actionButton} bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400`}>
                          Mark new
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className={`${actionButton} bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500`}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

export default InboxPage
