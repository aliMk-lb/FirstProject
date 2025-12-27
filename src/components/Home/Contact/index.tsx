'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getImgPath } from '@/utils/image'
import { API_BASE } from '@/utils/api'

const Contactform = () => {
  const [name, setName] = useState({ first: '', last: '' })
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Online Consultation')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    setLoading(true)

    try {
      const fullName = `${name.first} ${name.last}`.trim()
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          subject,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccessMessage('Your message has been sent successfully.')
      setName({ first: '', last: '' })
      setEmail('')
      setSubject('Online Consultation')
      setMessage('')
      setAgreed(false)
    } catch (error) {
      setErrorMessage('There was an error sending your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='overflow-x-hidden bg-darkmode dark:bg-darklight'>
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='grid md:grid-cols-12 grid-cols-1 md:gap-7 gap-0'>
          <div
            className='row-start-1 col-start-1 row-end-2 md:col-end-7 col-end-12'
            data-aos='fade-left'
            data-aos-delay='200'
            data-aos-duration='1000'>
            <div className='flex gap-2 items-center justify-start'>
              <span className='w-3 h-3 rounded-full bg-success'></span>
              <span className='font-medium text-sm text-white'>
                build everything
              </span>
            </div>
            <h2 className='sm:text-4xl text-[28px] leading-tight font-bold text-white py-12'>
              Let's discuss your project and take it to the next level.
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12 border-b border-dark_border'>
              <div className='flex flex-col gap-2'>
                <span className='text-white/50 text-lg'>Phone</span>
                <p className='bg-transparent border-0 text-white text-lg'>
                  +961 71 123 456
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-white/50 text-lg'>Email</span>
                <p className='bg-transparent border-0 text-white text-lg'>
                  me@portfolio.edu.com
                </p>
              </div>
              <div className='flex flex-col gap-2 sm:col-span-2'>
                <span className='text-white/50 text-lg'>Location</span>
                <p className='bg-transparent border-0 text-white text-lg'>
                  Lebanon, Beirut, Borj Al Brajni
                </p>
              </div>
            </div>
            <div className='pt-12'>
              <p className='text-white/50 pb-4 text-base'>Trusted by</p>
              <div className='flex items-center flex-wrap md:gap-14 gap-7'>
                <Image
                  src={getImgPath('/images/contact/google-pay.png')}
                  alt='Google-pay'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-28 w-full h-5'
                />
                <Image
                  src={getImgPath('/images/contact/play-juction.png')}
                  alt='play-juction'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-24 w-full h-6'
                />
                <Image
                  src={getImgPath('/images/contact/stripe.png')}
                  alt='stripe'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-14 w-full h-6'
                />
                <Image
                  src={getImgPath('/images/contact/wise.png')}
                  alt='wise'
                  width={100}
                  height={20}
                  style={{ width: 'auto', height: 'auto' }}
                  quality={100}
                  className='w_f max-w-16 w-full h-4'
                />
              </div>
            </div>
          </div>
          <div
            data-aos='fade-right'
            data-aos-delay='200'
            data-aos-duration='1000'
            className="relative before:content-[''] before:absolute before:bg-[url('/images/contact/form-line.png')] before:bg-no-repeat before:w-[13rem] before:h-24 before:top-5% before:bg-contain before:left-[35%] before:z-1 before:translate-x-full lg:before:inline-block before:hidden after:content-[''] after:absolute after:bg-[url('/images/contact/from-round-line.png')] after:bg-no-repeat after:w-[6.3125rem] after:h-[6.3125rem] after:bg-contain after:top-1/2 after:-left-[25%] after:z-1 after:translate-x-1/2 after:translate-y-1/2 md:after:inline-block after:hidden md:row-start-1 row-start-2 md:col-start-8 col-start-1 row-end-2 col-end-13">
            <div className='lg:mt-0 mt-8  bg-white dark:bg-darkmode max-w-[50rem] m-auto pt-[2.1875rem] pb-8 px-[2.375rem] rounded-md relative z-10'>
              <h2 className='sm:text-3xl text-lg font-bold text-midnight_text mb-3 dark:text-white'>
                Start the project
              </h2>
              <form
                className='flex w-full m-auto justify-between flex-wrap gap-4'
                onSubmit={handleSubmit}>
                <div className='flex flex-col md:flex-row gap-4 w-full'>
                  <input
                    className='text-midnight_text w-full md:flex-1 text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    type='text'
                    value={name.first}
                    onChange={(event) =>
                      setName((prev) => ({ ...prev, first: event.target.value }))
                    }
                    placeholder='First name'
                  />
                  <input
                    className='text-midnight_text w-full md:flex-1 text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    type='text'
                    value={name.last}
                    onChange={(event) =>
                      setName((prev) => ({ ...prev, last: event.target.value }))
                    }
                    placeholder='Last name'
                  />
                </div>
                <div className='w-full'>
                  <input
                    type='email'
                    className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='youremail@website.com'
                  />
                </div>
                <div className='w-full'>
                  <input
                    className='text-midnight_text w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border border-border border-solid focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    type='text'
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder='Subject'
                  />
                </div>
                <div className='w-full'>
                  <textarea
                    className='text-midnight_text h-[9.375rem] w-full text-base transition-[0.5s] bg-transparent dark:border-dark_border dark:text-white px-[0.9375rem] py-[0.830rem] border! border-border border-solid! focus:border-primary dark:focus:border-primary placeholder:text-grey rounded-lg focus-visible:outline-0'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder='Let us know about your project'></textarea>
                </div>
                <div className='flex'>
                  <input
                    id='wp-comment-cookies-consent'
                    name='wp-comment-cookies-consent'
                    type='checkbox'
                    value='yes'
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="hover:opacity-100 checked:bg-primary checked:opacity-100 relative border-2 border-solid border-primary rounded-xs bg-none cursor-pointer leading-none mr-2 outline-0 p-0! align-text-top h-[1.25rem] sm:w-[1.25rem] w-[2.25rem] opacity-[0.5] before:content-[''] before:absolute before:right-1/2 before:top-1/2 before:w-1 before:h-2 before:z-2 before:-mt-[0.0625rem] before:-ml-[0.0625rem] before:-mr-[0.0625rem] before:transform before:rotate-45 before:translate-x-[-50%] before:translate-y-[-50%] dark:focus:border-primary"
                  />
                  <div className='text-grey dark:text-white/50'>
                    I have read and acknowledge the{' '}
                    <p className='text-primary inline cursor-pointer'>
                      Terms and Conditions{' '}
                    </p>
                  </div>
                </div>
                <div className='w-full'>
                  <button
                    className='w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed'
                    type='submit'
                    disabled={loading || !agreed}>
                    {loading ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                  {successMessage && (
                    <p className='text-green-500 mt-2'>{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className='text-red-500 mt-2'>{errorMessage}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contactform
