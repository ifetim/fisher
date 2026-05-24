'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { demoProfiles } from '@/data'

export function DemoSwitcher() {
  const { user, switchDemo } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="demo-switcher">
      <button
        className="demo-switcher__trigger"
        onClick={() => setOpen((v) => !v)}
        title="Switch demo profile"
      >
        <span className="demo-switcher__label">Demo</span>
        <span className="demo-switcher__chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="demo-switcher__menu">
          {demoProfiles.map((p) => (
            <button
              key={p.id}
              className={`demo-switcher__option${p.id === user?.id ? ' active' : ''}`}
              onClick={() => {
                switchDemo(p.id)
                setOpen(false)
              }}
            >
              <span className="demo-switcher__avatar">{p.avatar}</span>
              <span className="demo-switcher__info">
                <span className="demo-switcher__name">{p.name}</span>
                <span className="demo-switcher__tag">{p.tag}</span>
              </span>
              {p.id === user?.id && <span className="demo-switcher__check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
