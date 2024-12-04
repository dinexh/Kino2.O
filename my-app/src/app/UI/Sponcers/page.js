import "./sponcers.css"
import sponcer from "../../Assets/Aavanflix.png"
import Image from "next/image";


const Sponcers = () => {
    return (
        <div className="sponcers-container">
            <div className="sponcers-container-in">
                <div className="sponcer-container-two">
                    <h1>Our Sponcers</h1>
                </div>
                <div className="sponcers-container-in-one">
                    <div className="sponcer-container-in-one-image">
                        <Image src={sponcer} alt="Sponcer"  width={300} height={100} />
                    </div>
                    <div className="sponcer-container-in-one-description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque facere id quia, vel error necessitatibus veniam saepe quis, cumque molestiae dignissimos dolorem quas placeat quos cum deserunt adipisci voluptates sit accusamus eos deleniti eum corrupti. Excepturi voluptates corrupti dolorum animi impedit qui quas, voluptatibus illo laborum reiciendis. Corrupti, numquam sint?
                    </div>
                </div>
                <div className="sponcers-container-in-one two">
                    <div className="sponcer-container-in-one-image">
                        <Image src={sponcer} alt="Sponcer"  width={300} height={100} />
                    </div>
                    <div className="sponcer-container-in-one-description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque facere id quia, vel error necessitatibus veniam saepe quis, cumque molestiae dignissimos dolorem quas placeat quos cum deserunt adipisci voluptates sit accusamus eos deleniti eum corrupti. Excepturi voluptates corrupti dolorum animi impedit qui quas, voluptatibus illo laborum reiciendis. Corrupti, numquam sint?
                    </div>
                </div>
            </div>
        </div>
    );
}




export default Sponcers;