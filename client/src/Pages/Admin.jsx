import React, { useEffect, useState } from 'react'
import '../App.css'
import Nav from '../Components/Nav'

export default function Admin() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('Loading...')
  const [actionStatus, setActionStatus] = useState('')

  const loadLatest = async () => {
    try {
      const res = await fetch('/api/registrations/latest')
      const json = await res.json()
      if (!res.ok) {
        setData(null)
        setStatus(json.message || 'No data')
        return
      }
      setData(json.data)
      setStatus('')
    } catch (err) {
      setData(null)
      setStatus('Network error')
    }
  }

  useEffect(() => {
    loadLatest()
  }, [])

  const handleReject = async () => {
    if (!data?.photoId) return
    setActionStatus('Deleting...')
    try {
      const res = await fetch(`/api/registrations/${data.photoId}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (!res.ok) {
        setActionStatus(json.message || 'Delete failed')
        return
      }
      setActionStatus('Deleted')
      await loadLatest()
    } catch (err) {
      setActionStatus('Network error')
    }
  }

  return (
    <div className='Admin'>
      <Nav />
      <div className='admin-card'>
        <div className='admin-photo'>
          {data?.photoId ? (
            <img src={`/api/photos/${data.photoId}`} alt='Rider' />
          ) : (
            <div className='admin-empty'>{status || 'No photo'}</div>
          )}
        </div>
        <div className='admin-details'>
          <h2 className='admin-title'>Rider Details</h2>
          {data ? (
            <>
              <p><span>Name:</span> {data.name}</p>
              <p><span>Age:</span> {data.age}</p>
              <p><span>Bike No:</span> {data.bikeNo}</p>
            </>
          ) : (
            <p>{status}</p>
          )}
          <button className='reject-btn' type='button' onClick={handleReject}>Reject</button>
          {actionStatus && <p className='status-text'>{actionStatus}</p>}
        </div>
      </div>
    </div>
  )
}
