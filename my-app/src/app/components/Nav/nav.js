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
    // Prevent default behavior
    event.preventDefault();
    
    // Add a small delay to ensure the element exists
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const yOffset = -80 // Adjust this value based on your nav height
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        })
      }
      setIsMobileMenuOpen(false)
    }, 100)
  }

  const navLinks = [
    { href: 'about-info', label: 'About' },
    { href: 'events', label: 'Events' },
    { href: 'gallery', label: 'Gallery' },
    { href: 'team', label: 'Team' },
    { href: 'sponsors', label: 'Partners' },
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
