"use client";
import { teamMembers } from "../../Data/team";
import "./team.css";
import { FaInstagram, FaTelegram, FaLinkedin } from 'react-icons/fa';
import Link from "next/link";
import Image from "next/image";

const Team = () => {
    return (
        <div className="team-container">
            <div className="team-container-in">
                <div className="team-container-in-one">
                    <h1>Our Creative Team</h1>
                </div>
                <div className="team-container-in-two">
                    <div className="team-container-in-two-in">
                        {teamMembers.concat(teamMembers).map((member, index) => (
                            <div key={`${member.id}-${index}`} className="team-member">
                                <div className="member-image-container">
                                    <Image 
                                        src={member.picture} 
                                        alt={member.name} 
                                        width={250} 
                                        height={250}
                                        className="member-image" 
                                    />
                                </div>
                                {/* <div className="social-icons">
                                    <a href={member.instagram} className='media'><FaInstagram /></a>
                                    <a href={member.telegram || "#"} className='media'><FaTelegram /></a>
                                </div> */}
                                <div className="view-more">
                                    <Link href="/team" legacyBehavior>
                                        <a target="_blank" rel="noopener noreferrer"> view more </a>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="team-link">
                    <Link href="/team">View All</Link>
                </div>
            </div>
        </div>
    );
}

export default Team;
