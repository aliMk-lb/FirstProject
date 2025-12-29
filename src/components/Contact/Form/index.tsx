'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { API_BASE } from '@/utils/api'
import { getImgPath } from '@/utils/image'

const ContactForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    setLoading(true)

    try {
      const fullName = `${firstName} ${lastName}`.trim()
      const subject = specialist
        ? `Consultation - ${specialist}`
        : 'Consultation'
      const friendlyDate = date ? new Date(date).toDateString() : ''
      const friendlyTime = time ? time : ''
      const composedMessage = [
        friendlyDate && `Preferred date: ${friendlyDate}`,
        friendlyTime && `Preferred time: ${friendlyTime}`,
      ]
        .filter(Boolean)
        .join(' | ')

      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName || 'Anonymous',
          email,
          subject,
          message: composedMessage || 'No extra details provided.',
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        const message =
          errorBody?.error || errorBody?.message || 'Failed to send message'
        throw new Error(message)
      }

      setSuccessMessage('Your message has been sent successfully.')
      setFirstName('')
      setLastName('')
      setEmail('')
      setSpecialist('')
      setDate('')
      setTime('')
    } catch (error: any) {
      setErrorMessage(
        error?.message ||
          'There was an error sending your message. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className='dark:bg-darkmode md:pb-24 pb-16'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='grid md:grid-cols-12 grid-cols-1 gap-8'>
            <div className='col-span-6'>
              <h2 className='max-w-72 text-[40px] leading-tight font-bold mb-9 text-midnight_text dark:text-white'>
                Get Online Consultation
              </h2>
              <form
                className='flex flex-wrap w-full m-auto justify-between'
                onSubmit={handleSubmit}>
                <div className='sm:flex gap-3 w-full'>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='first-name'
                      className='pb-3 inline-block text-base'>
                      First Name*
                    </label>
                    <input
                      className='w-full text-base px-4 rounded-lg py-2.5 border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                      type='text'
                      id='first-name'
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      required
                    />
                  </div>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='last-name'
                      className='pb-3 inline-block text-base'>
                      Last Name*
                    </label>
                    <input
                      className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                      type='text'
                      id='last-name'
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className='sm:flex gap-3 w-full'>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='email'
                      className='pb-3 inline-block text-base'>
                      Email address*
                    </label>
                    <input
                      type='email'
                      className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:border-dark_border border-solid dark:text-white  dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary focus:border-solid focus:outline-0'
                      id='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='Specialist'
                      className='pb-3 inline-block text-base'>
                      Specialist*
                    </label>
                    <select
                      className='w-full text-base px-4 py-2.5 rounded-lg border-border dark:text-white border-solid dark:bg-darkmode border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'
                      id='specialist'
                      value={specialist}
                      onChange={(event) => setSpecialist(event.target.value)}
                      required>
                      <option value=''>Choose a specialist</option>
                      <option value='Baking &amp; Pastry'>Baking &amp; Pastry</option>
                      <option value='Exotic Cuisine'>Exotic Cuisine</option>
                      <option value='French Desserts'>French Desserts</option>
                      <option value='Seafood &amp; Wine'>Seafood &amp; Wine</option>
                    </select>
                  </div>
                </div>
                <div className='sm:flex gap-3 w-full'>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='date'
                      className='pb-3 inline-block text-base'>
                      Date*
                    </label>
                    <input
                      className='w-full text-base px-4 rounded-lg  py-2.5 outline-hidden dark:text-white dark:bg-darkmode border-border border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'
                      type='date'
                      id='date'
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      required
                    />
                  </div>
                  <div className='mx-0 my-2.5 flex-1'>
                    <label
                      htmlFor='time'
                      className='pb-3 inline-block text-base'>
                      Time*
                    </label>
                    <input
                      className='w-full text-base px-4 rounded-lg py-2.5 border-border outline-hidden dark:text-white dark:bg-darkmode border-solid border transition-all duration-500 focus:border-primary dark:focus:border-primary dark:border-dark_border focus:border-solid focus:outline-0'
                      type='time'
                      id='time'
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className='mx-0 my-2.5 w-full'>
                  <button
                    className='bg-primary rounded-lg text-white py-4 px-8 mt-4 inline-block hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed'
                    type='submit'
                    disabled={loading}>
                    Make an appointment
                  </button>
                  {successMessage && (
                    <p className='text-green-600 mt-3'>{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className='text-red-600 mt-3'>{errorMessage}</p>
                  )}
                </div>
              </form>
            </div>
            <div className='col-span-6'>
              <Image
                src={getImgPath('/images/contact-page/contact.jpg')}
                alt='Contact'
                width={1300}
                height={0}
                quality={100}
                style={{ width: '100%', height: 'auto' }}
                className='bg-no-repeat bg-contain'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactForm
