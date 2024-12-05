import "./sponcers.css";
import Image from "next/image";
import { sponsorsData } from "../../Data/sponsors";

const Sponsors = () => {
    return (
        <div className="sponsors-container">
            <div className="sponsors-header">
                <h1>Our Elite Sponsors</h1>
            </div>
            
            <div className="sponsors-grid">
                {sponsorsData.map((sponsor) => (
                    <div key={sponsor.id} className="sponsor-card">
                        <div className="sponsor-image">
                            <Image 
                                src={sponsor.image} 
                                alt={sponsor.name} 
                                width={300} 
                                height={100} 
                            />
                        </div>
                        <div className="sponsor-content">
                            <h2>{sponsor.name}</h2>
                            <span className="sponsor-caption">{sponsor.caption}</span>
                            <p>{sponsor.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sponsors;
