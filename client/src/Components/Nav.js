import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css';

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <div className='Navbar'>
      <Link className='nav-link' to='/'><span className='title'>Race Form Page</span></Link>
      <Link className='nav-link nav-item' to='/about'>About</Link>
      <Link className='nav-link nav-item nav-admin' to='/auth'>Admin</Link>
      <button
        className='nav-menu'
        type='button'
        aria-label='Menu'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      {open && (
        <div className='nav-dropdown'>
          <Link className='nav-link' to='/about' onClick={() => setOpen(false)}>About</Link>
        </div>
      )}
    </div>
  )
}
