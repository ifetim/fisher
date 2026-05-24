'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const links = [
  { label: 'HOME', href: '/', isRoute: true },
  { label: 'SIGN UP', href: '/login', isRoute: true },
  { label: 'LOG IN', href: '/login', isRoute: true },
]

export default function Navbar() {
  const router = useRouter()
  const [flipping, setFlipping] = useState<string | null>(null)

  const handleNav = (label: string, href: string, isRoute: boolean) => {
    setFlipping(label)
    setTimeout(() => {
      if (isRoute) router.push(href)
      else {
        const target = document.querySelector(href)
        target?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 200)
    setTimeout(() => setFlipping(null), 1500)
  }

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {links.map(({ label, href, isRoute }) => (
          <li key={label} className="nav-link-wrapper">
            {isRoute ? (
              <Link
                href={href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  handleNav(label, href, true)
                }}
              >
                {label}
              </Link>
            ) : (
              <a
                href={href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  handleNav(label, href, false)
                }}
              >
                {label}
              </a>
            )}
            <div className="coin-container">
              <div className={`coin ${flipping === label ? 'flipping' : ''}`} />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}
