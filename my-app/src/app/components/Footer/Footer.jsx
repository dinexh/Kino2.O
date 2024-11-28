"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import './footer.css';
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaUser } from 'react-icons/fa';
import logo from '../../Assets/newlogo.png';
import SACLogo from "../../Assets/sac_logo.png";

const Footer = () => {
    
    const socialLinks = [
        { href: '#', icon: <FaFacebookF />, label: 'Facebook' },
        { href: '#', icon: <FaInstagram />, label: 'Instagram' },
        { href: '#', icon: <FaYoutube />, label: 'YouTube' },
        { href: '#' , icon: <FaUser/> , label: 'user'}
    ];
        const router = useRouter();
      
        const GoToLogin = () => {
          router.push('/auth/login');
        };
    return (
        <div className="footer-component">
            <div className="footer-component-in">
                <div className="footer-component-in-top">
                    <div className="footer-component-in-top-one">
                        <p>Terms and Conditions</p>
                        <p>Privacy Policy</p>
                    </div>
                    <div className="footer-component-in-top-two">
                        <p>Report Bugs</p>
                        <p className='login-button' onClick={GoToLogin}>
                            <FaUser/>
                            Login
                        </p>
                    </div>
                </div>
                <div className="footer-component-in-main">
                    <div className="footer-component-main-in">
                        <div className="footer-component-main-in-one">
                            <Image src={logo} alt="Chitramela logo" className="Logo" />
                            <Image src={SACLogo} alt="Student Activity Center Logo" className="Logo" />
                        </div>
                        <div className="footer-component-main-in-two">
                            <p>Contact Us!</p>
                            <div className="footer-component-main-in-two-icons">
                                {socialLinks.map((link, index) => (
                                    <Link href={link.href} key={index} className="footer-social-link" aria-label={link.label} rel="noopener noreferrer">
                                        {link.icon}
                                    </Link>
                                ))}
                            </div>
                            <div className="footer-component-main-in-two-number">
                                <Link href="tel:+911234567890">
                                    +91 9492485741 {`{Amish Kumar}`}
                                </Link>
                                <Link href="mailto:klsacphotography@gmail.com">
                                    klsacphotography@gmail.com
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-in-component-copyright">
                    <div className="footer-component-copyright-one">
                        <p>Designed and Developed by <Link href="https://in.linkedin.com/in/dinesh-korukonda-513855271">Dinesh Korukonda</Link> & <Link href="https://in.linkedin.com/in/pavankarthikgaraga">Pavan Karthik Garaga</Link></p>
                    </div>
                    <div className="footer-component-copyright-two">
                        <p>&copy; 2024 <span>Chitramela</span>. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
