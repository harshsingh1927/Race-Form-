import React, { useEffect, useState } from 'react'
import '../App.css'
import Nav from '../Components/Nav'

export default function Admin() {
  const [list, setList] = useState([])
  const [status, setStatus] = useState('Loading...')
  const [actionStatus, setActionStatus] = useState('')

  const loadAll = async () => {
    try {
      const res = await fetch('https://race-form.onrender.com/api/registrations')
      const json = await res.json()
      if (!res.ok) {
        setList([])
        setStatus(json.message || 'No data')
        return
      }
      setList(json.data || [])
      setStatus('')
    } catch (err) {
      setList([])
      setStatus('Network error')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleReject = async (photoId) => {
    if (!photoId) return
    setActionStatus('Deleting...')
    try {
      const res = await fetch(`https://race-form.onrender.com/api/registrations/${photoId}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (!res.ok) {
        setActionStatus(json.message || 'Delete failed')
        return
      }
      setActionStatus('Deleted')
      await loadAll()
    } catch (err) {
      setActionStatus('Network error')
    }
  }

  return (
    <div className='Admin'>
      <Nav />
      {list.length === 0 ? (
        <div className='admin-card'>
          <div className='admin-details'>
            <h2 className='admin-title'>Rider Details</h2>
            <p>{status}</p>
          </div>
        </div>
      ) : (
        list.map((item) => (
          <div className='admin-card' key={item.photoId}>
            <div className='admin-photo'>
              <img src={`https://race-form.onrender.com/api/photos/${item.photoId}`} alt='Rider' />
            </div>
            <div className='admin-details'>
              <h2 className='admin-title'>Rider Details</h2>
              <p><span>Name:</span> {item.name}</p>
              <p><span>Age:</span> {item.age}</p>
              <p><span>Bike No:</span> {item.bikeNo}</p>
              <button className='reject-btn' type='button' onClick={() => handleReject(item.photoId)}>Reject</button>
              {actionStatus && <p className='status-text'>{actionStatus}</p>}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
