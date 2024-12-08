'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import './nav.css'
import Image from 'next/image'
import logo from '../../Assets/newlogo.png'

export default function Nav() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      const heroHeight = heroSection?.offsetHeight || 0

      if (window.scrollY > heroHeight - 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })

      // After smooth scrolling, adjust the scroll position with a delay
      setTimeout(() => {
        const yOffset = -80
        const yPosition = element.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: yPosition, behavior: 'smooth' })
      }, 100)
    }
    setIsMobileMenuOpen(false) // Close mobile menu after clicking
  }

  const navLinks = [
    { href: 'about-info', label: 'About' },
    { href: 'events', label: 'Events' },
    { href: 'team', label: 'Team' },           // Scroll to Team
    { href: 'sponsors', label: 'Partners' },   // Renamed from Sponsors
    { href: 'gallery', label: 'Gallery' },
  ]

  return (
    <nav className={`navigation ${isVisible ? 'visible' : ''}`}>
      <div className="nav-in">
        <div className="nav-in-one">
          <Link href="/" className="nav-in-one-link">
          <Image
            src="https://i.imghippo.com/files/FHCK9908LI.png"
            alt="Chitramela Logo"
            width={100} /* Larger dimensions to preserve quality */
            height={20}
            layout="intrinsic" /* Keeps the image's natural dimensions */
            priority
          />
          </Link>
        </div>

        <button 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-in-two ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <Link 
              key={href}
              href={`#${href}`}
              onClick={() => handleNavClick(href)}
              className="navigation-link"
            >
              {label}
            </Link>
          ))}
          <Link href="/events/register" className="navigation-link-register">
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}
