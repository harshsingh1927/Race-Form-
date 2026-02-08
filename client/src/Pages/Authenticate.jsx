import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import Nav from '../Components/Nav'

export default function Authenticate() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const correct = (process.env.REACT_APP_ADMIN_PASSWORD || 'admin123').trim()
    if (password.trim() === correct) {
      setError('')
      navigate('/admin')
    } else {
      setError('Wrong password')
    }
  }

  return (
    <div className='Form'>
      <Nav />
      <form className='box-form' onSubmit={handleSubmit}>
        <input
          className='input-box'
          type='password'
          placeholder='Enter Admin Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='submit-btn' type='submit'>Login</button>
        {error && <p className='status-text'>{error}</p>}
      </form>
    </div>
  )
}
