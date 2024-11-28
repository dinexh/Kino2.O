import './team.css'
import { teamMembers } from '../../../data/team';
const Team = () => {
    return ( 
        <div className="team-container">
            <div className="team-container-in">
                <div className="team-container-in-one">
                    <h1>Meet The Team which made chiramela 2k25</h1>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla corporis quaerat omnis? Cumque id unde expedita possimus voluptate dolorem voluptas, provident neque maxime iusto commodi veniam amet aliquam labore reprehenderit.</p>
                </div>
                <div className="team-container-in-two">
                {teamMembers && teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                        <div className="team-card" key={member.id}>
                        <div className="team-card-img">
                            <img src={member.image} alt="team-member" />
                        </div>
                        <div className="team-card-info">
                            <h3>{member.name}</h3>
                            <p>{member.designation}</p>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p>No team members found.</p>
                    )}
                </div>
            </div>
        </div>
     );
}
 
export default Team;