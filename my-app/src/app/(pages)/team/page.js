"use client";
import './Team.css';
import React from 'react';
import Pic from "../../Assets/TeamPerson.png";
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import Footer from "../../components/Footer/Footer";
import Image from 'next/image';
import { teamMembers } from "../../Data/team";
import Link from 'next/link';

const Team = () => {
  return (
    <div className="TeamPage-container">
      <div className="TeamPage-container-in">
        <div className="TeamPage-container-in-heading">
          <h1>Citramela Team</h1>
          <p>Meet the team that makes Citramela possible</p>
        </div>
        <div className="TeamPage-container-in-content">
          <div className="TeamPage-container-in-content-in">
            <div className="TeamPage-content-in-one">
              <div className="TeamPage-Profile">
                <Image src={Pic} alt="Chief" width={250} height={250} />
                <div className="description">
                  <p>Name</p>
                  <p>Chief</p>
                </div>
                <div className="social-icons">
                    <Link href="#" legacyBehavior>
                      <a className='media'><FaInstagram /></a>
                    </Link>
                    <Link href="#" legacyBehavior>
                      <a className='media'><FaTelegram /></a>
                    </Link>
                  </div>
              </div>
            </div>
          </div>
          <div className="TeamPage-content-in-two">
            <div className="TeamPage-content-in-two-in">
              <div className="TeamPage-Profile">
              {[1, 2].map((item) => (
                <div key={`static-member-${item}`} className="TeamPage-content-in-two-in-one">
                  <Image src={Pic} alt="Chief" width={200} height={200} />
                  <div className="description">
                    <p>Name</p>
                    <p>Chief</p>
                  </div>
                  <div className="social-icons">
                      <Link href="#" legacyBehavior>
                        <a className='media'><FaInstagram /></a>
                      </Link>
                      <Link href="#" legacyBehavior>
                        <a className='media'><FaTelegram /></a>
                      </Link>
                  </div>
                </div>
                ))}
              </div>  
            </div>
          </div>
          <div className="TeamPage-content-in-three">
            <div className="TeamPage-content-in-three-in">
                <div className="TeamPage-Profile">
                {teamMembers.map((member) => (
                <div key={member.id} className="TeamPage-content-in-three-in-one">
                  <Image src={Pic} alt={member.name} width={200} height={200} />
                  <div className="description">
                    <p>{member.name}</p>
                    <p>{member.designation}</p>
                  </div>
                  <div className="social-icons">
                      <Link href={member.instagram} legacyBehavior>
                        <a className='media'><FaInstagram /></a>
                      </Link>
                      <Link href={member.telegram || "#"} legacyBehavior>
                        <a className='media'><FaTelegram /></a>
                      </Link>
                    </div>
                </div>
              ))}
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="TeamPage-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Team;
