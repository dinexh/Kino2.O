"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import './Footer.css';
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import logo from '../../Assets/newlogo.png';
import SACLogo from "../../Assets/sac_logo.png";

const Footer = () => {
    const socialLinks = [
        { href: '#', icon: <FaFacebookF />, label: 'Facebook' },
        { href: '#', icon: <FaInstagram />, label: 'Instagram' },
        { href: '#', icon: <FaYoutube />, label: 'YouTube' }
    ];

    const router = useRouter();
    const GoToLogin = () => {
        router.push('/auth/login');
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>About <span>Chitramela</span></h3>
                    <p>Chitramela is KL University&apos;s annual film festival, celebrating the art of storytelling through cinema. From captivating activities to exciting competitions, it&apos;s a platform for creativity, innovation, and fun.</p>
                    <div className="social-links">
                        {socialLinks.map((link, index) => (
                            <Link href={link.href} key={index} className="social-icon" aria-label={link.label}>
                                {link.icon}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="footer-section logos">
                    <Image src={logo} alt="Chitramela logo" className="footer-logo" />
                    <Image src={SACLogo} alt="Student Activity Center Logo" className="footer-logo" />
                </div>

                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <Link href="tel:+919492485741">+91 9492485741 (Amish Kumar)</Link>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <Link href="mailto:klsacphotography@gmail.com">klsacphotography@gmail.com</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-links">
                    <Link href="/terms">Terms & Conditions</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/report">Report Bugs</Link>
                    <button className="login-button" onClick={GoToLogin}>
                        <FaUser />
                        <span>Login</span>
                    </button>
                </div>
                <div className="footer-credits">
                    <p>Designed by <Link href="https://in.linkedin.com/in/dinesh-korukonda-513855271">Dinesh Korukonda</Link> & <Link href="https://in.linkedin.com/in/pavankarthikgaraga">Pavan Karthik Garaga</Link> </p>
                    <p>&copy; 2024 <span>Chitramela</span>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
