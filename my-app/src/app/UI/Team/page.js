import { teamMembers } from "../../Data/team";
import "./team.css";
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import Link from "next/link";
import Image from "next/image";

const Team = () => {
    return (
        <div className="team-container">
            <div className="team-container-in">
                <div className="team-container-in-one">
                    <h1>Team Behind Chitramela</h1>
                    <p>Chitramela is a collaborative effort of students from the KL Movie Makers. It is a platform for students to showcase their talents and to promote the art of cinema.</p>
                </div>
                <div className="team-container-in-two">
                    <div className="team-container-in-two-in">
                        {teamMembers.concat(teamMembers).map((member, index) => (
                            <div key={`${member.id}-${index}`} className="team-member">
                                <Image src={member.picture} alt={member.name} width={250} height={250} />
                                <div className="description">
                                    <p>{member.name}</p>
                                    <p>{member.designation}</p>
                                </div>
                                {/* <div className="social-icons">
                                    <a href={member.instagram} className='media'><FaInstagram /></a>
                                    <a href={member.telegram || "#"} className='media'><FaTelegram /></a>
                                </div> */}
                                <div className="view-more">
                                    <Link href="/team" legacyBehavior>
                                        <a rel="noopener noreferrer"> view more </a>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Team;
