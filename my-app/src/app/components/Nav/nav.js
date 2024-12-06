'use client'
import { useState } from 'react'
import Link from 'next/link'
import './nav.css'
import Image from 'next/image'
import logo from '../../Assets/newlogo.png'

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { href: 'about-info', label: 'About' },
    { href: 'events', label: 'Events' },
    { href: 'gallery', label: 'Gallery' },
    { href: 'faq', label: 'FAQ' }
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="logo-container">
          <Image 
            src={logo} 
            alt="Chitramela Logo" 
            width={45} 
            height={45} 
            priority
          />
        </Link>

        <button 
          className={`menu-button ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <Link 
              key={href}
              href={`#${href}`}
              onClick={() => handleNavClick(href)}
              className="nav-link"
            >
              {label}
            </Link>
          ))}
          <Link href="/events/register" className="register-button-in">
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
} 