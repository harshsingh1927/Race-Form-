import React, { useEffect, useState } from 'react'
import Nav from '../Components/Nav'
import { Link } from 'react-router-dom'
import map from '../Assets/map-route.png'
import Gif from '../Assets/gif.gif'
import '../App.css'

export default function Home() {
  const quotes = [
    'Ride fast, stay focused.',
    'Every lap is a lesson.',
    'Speed is nothing without control.',
    'Chase the finish, not the crowd.'
  ]
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (quotes.length === 0) return
    const current = quotes[quoteIndex]

    if (!isDeleting && text === current) {
      const id = setTimeout(() => setIsDeleting(true), 1200)
      return () => clearTimeout(id)
    }

    if (isDeleting && text === '') {
      const id = setTimeout(() => {
        setIsDeleting(false)
        setQuoteIndex((i) => (i + 1) % quotes.length)
      }, 300)
      return () => clearTimeout(id)
    }

    const id = setTimeout(() => {
      const next = isDeleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1)
      setText(next)
    }, isDeleting ? 45 : 85)

    return () => clearTimeout(id)
  }, [text, isDeleting, quoteIndex])

  return (
    <div className='Home'>
      <Nav/>
      <div className='quote-wrap'>
        <p className='quote-text'>
          {text}<span className='quote-cursor'>|</span>
        </p>
      </div>
      <img className='Gif' src={Gif} alt='' />
      <Link to={'/form'}><button className='join-race'>Join Race🏁</button></Link>
      <img className='map-img' src={map} alt='' />
    </div>
  )
}
