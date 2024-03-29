'use client'

import { Disclosure } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

const navigation = [
  { name: '视频风格转换', href: '/', current: true },
  { name: '提交记录', href: '/history', current: false },
]

export function Navbar() {
  const pathname = usePathname()

  const isActive = useCallback((href: string) => href === pathname, [pathname])

  return (
    <div className="bg-indigo-600 pb-32">
      <Disclosure as="nav" className="border-b border-indigo-300/25 bg-indigo-600 lg:border-none">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-400/25">
                {/* Logo and navigation */}
                <div className="flex items-center px-2 lg:px-0">
                  <div className="shrink-0">
                    <Image
                      className="block"
                      src="/favicon.ico"
                      alt="Logo"
                      width={32}
                      height={32}
                    />
                  </div>

                  <div className="hidden lg:ml-10 lg:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            isActive(item.href)
                              ? 'bg-indigo-700 text-white'
                              : 'text-white hover:bg-indigo-500/75',
                            'rounded-md py-2 px-3 text-sm font-medium'
                          )}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="hidden lg:ml-4 lg:block">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative shrink-0 rounded-full bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={clsx(
                      isActive(item.href)
                        ? 'bg-indigo-700 text-white'
                        : 'text-white hover:bg-indigo-500/75',
                      'block rounded-md py-2 px-3 text-base font-medium'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">OmniV2V</h1>
        </div>
      </header>
    </div>
  )
}
