import './page.css';
import logo from '../../Assets/newlogo.png';
import Image from 'next/image';
import Footer from '../../components/Footer/Footer';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

export default function Schedule() {
    return (
        <div className="schedule-page">
            <div className="schedule-page-in">
                <Link href="/" className="back-home">
                    <IoArrowBack size={20} />
                    Back to Home
                </Link>
                
                <div className="schedule-header">
                    <Image src={logo} alt="Chitramela Logo" width={300} height={150} priority />
                    <h1>Events Schedule</h1>
                </div>

                <div className="schedule-section">
                    <h2>Main Schedule</h2>
                    <table className="schedule-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Event Name</th>
                                <th>Venue(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>9:00 AM - 10:00 AM</td>
                                <td>Inauguration</td>
                                <td className="venue">R&D Auditorium</td>
                            </tr>
                            <tr>
                                <td>10:00 AM - 12:30 PM</td>
                                <td>Short Film Review & Photography Contest</td>
                                <td className="venue">News Seminar Hall & Peacock Hall</td>
                            </tr>
                            <tr className="break-row">
                                <td>12:30 PM - 1:30 PM</td>
                                <td>Lunch Break</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>1:30 PM - 4:30 PM</td>
                                <td>Short Film Review & Photography Review</td>
                                <td className="venue">News Seminar Hall & Peacock Hall</td>
                            </tr>
                            <tr className="break-row">
                                <td>4:30 PM - 5:30 PM</td>
                                <td>Break</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>5:30 PM - 9:30 PM</td>
                                <td>Main Event</td>
                                <td className="venue">Open Air Theatre</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="schedule-section">
                    <h2>Main Event Schedule</h2>
                    <table className="schedule-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Event Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>6:00 PM - 6:10 PM</td>
                                <td>Swara Performance</td>
                            </tr>
                            <tr>
                                <td>6:10 PM - 6:20 PM</td>
                                <td>Narthana Performance</td>
                            </tr>
                            <tr>
                                <td>6:20 PM - 6:30 PM</td>
                                <td>Guest of Honor</td>
                            </tr>
                            <tr>
                                <td>6:30 PM - 7:00 PM</td>
                                <td>Photography Contest Awards</td>
                            </tr>
                            <tr>
                                <td>7:00 PM - 7:10 PM</td>
                                <td>Fusion Performance</td>
                            </tr>
                            <tr>
                                <td>7:10 PM - 7:30 PM</td>
                                <td>Guest of Honor Speech</td>
                            </tr>
                            <tr>
                                <td>7:30 PM - 8:00 PM</td>
                                <td>Reel Making Contest Awards</td>
                            </tr>
                            <tr>
                                <td>8:00 PM - 8:30 PM</td>
                                <td>Filmmakers' Club Interaction & Teaser Launch of King of Kotha</td>
                            </tr>
                            <tr>
                                <td>8:30 PM - 9:00 PM</td>
                                <td>Short Film Contest Awards</td>
                            </tr>
                            <tr>
                                <td>9:00 PM - 10:00 PM</td>
                                <td>DJ Night</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}