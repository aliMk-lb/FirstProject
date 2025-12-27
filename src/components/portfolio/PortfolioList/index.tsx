import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { portfolioinfo } from '@/app/api/data'

const PortfolioList = () => {
  return (
    <section id='portfolio' className='md:pb-24 pb-16 pt-8 dark:bg-darkmode'>
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {portfolioinfo.map((item, index) => (
            <Link key={index} href={`/portfolio/#!`} passHref className='group block h-full'>
              <div className={`h-full w-full max-w-sm mx-auto ${item.Class}`}>
                <div className='relative overflow-hidden rounded-lg group-hover:scale-[1.1] group-hover:cursor-pointer transition-all duration-500'>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <h4 className='pb-[0.3125rem] pt-[2.1875rem] group-hover:text-primary group-hover:cursor-pointer text-2xl text-midnight_text font-bold dark:text-white'>
                  {item.title}
                </h4>
                <p className='text-secondary font-normal text-lg group-hover:text-primary group-hover:cursor-pointer dark:text-white/50'>
                  {item.info}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortfolioList
