import React, { useState } from 'react'
import '../App.css'
import Nav from '../Components/Nav'
export default function Form() {
  const [form, setForm] = useState({ name: '', age: '', bikeNo: '' })
  const [photo, setPhoto] = useState(null)
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')

    const data = new FormData()
    data.append('name', form.name)
    data.append('age', form.age)
    data.append('bikeNo', form.bikeNo)
    if (photo) data.append('photo', photo)

    try {
      const res = await fetch('https://race-form.onrender.com/api/registrations', {
        method: 'POST',
        body: data
      })
      const json = await res.json()
      if (!res.ok) {
        setStatus(json.message || 'Submit failed')
        return
      }
      setStatus(`Submitted. Photo ID: ${json.data.photoId}`)
      setForm({ name: '', age: '', bikeNo: '' })
      setPhoto(null)
    } catch (err) {
      setStatus('Network error')
    }
  }

  return (
    <div className='Form'>
      <Nav/>
      <form className='box-form' onSubmit={handleSubmit}>
        <input className='input-box' name='name' type='text' placeholder='Enter Name' value={form.name} onChange={handleChange} />
        <input className='input-box' name='age' type='text' placeholder='Enter Age' value={form.age} onChange={handleChange} />
        <input className='input-box' name='bikeNo' type='text' placeholder='Enter Bike No' value={form.bikeNo} onChange={handleChange} />
        <input className='input-box' type='file' onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        <button className='submit-btn' type='submit'>Submit</button>
        {status && <p className='status-text'>{status}</p>}
      </form>
    </div>
  )
}
