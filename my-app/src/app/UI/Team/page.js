"use client";
import { teamMembers } from "../../Data/team";
import "./team.css";
import { FaInstagram, FaTelegram, FaLinkedin } from 'react-icons/fa';
import Link from "next/link";
import Image from "next/image";

const Team = () => {
    return (
        <div className="team-container" id="team">
            <div className="team-container-in">
                <div className="team-container-in-one">
                    <h2>Our Creative Team</h2>
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
                                <div className="description">
                                    <h3>{member.name}</h3>
                                    <p className="designation">{member.designation}</p>
                                    {/* <div className="social-icons">
                                        <a href={member.instagram} target="_blank" className='media'><FaInstagram /></a>
                                        <a href={member.telegram || "#"} target="_blank" className='media'><FaTelegram /></a>
                                        <a href={member.linkedin || "#"} target="_blank" className='media'><FaLinkedin /></a>
                                    </div> */}
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