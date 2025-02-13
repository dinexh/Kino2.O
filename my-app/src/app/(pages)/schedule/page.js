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
                                <td>6:30 PM</td>
                                <td>Vote of Thanks & Inauguration</td>
                            </tr>
                            <tr>
                                <td>6:30 PM - 6:35 PM</td>
                                <td>Classical Dance Performance</td>
                            </tr>
                            <tr>
                                <td>6:35 PM - 6:40 PM</td>
                                <td>Felicitation of Guest with Speech</td>
                            </tr>
                            <tr>
                                <td>6:40 PM - 6:45 PM</td>
                                <td>3rd Prize - Photography Contest</td>
                            </tr>
                            <tr>
                                <td>6:45 PM - 6:50 PM</td>
                                <td>Music Performance</td>
                            </tr>
                            <tr>
                                <td>6:50 PM - 6:55 PM</td>
                                <td>2nd Prize - Photography Contest</td>
                            </tr>
                            <tr>
                                <td>6:55 PM - 7:00 PM</td>
                                <td>Music Performance</td>
                            </tr>
                            <tr>
                                <td>7:00 PM - 7:05 PM</td>
                                <td>1st Prize - Photography Contest</td>
                            </tr>
                            <tr>
                                <td>7:05 PM - 7:10 PM</td>
                                <td>Felicitation of Guest with Speech</td>
                            </tr>
                            <tr>
                                <td>7:10 PM - 7:15 PM</td>
                                <td>3rd Prize - Reel Making Contest</td>
                            </tr>
                            <tr>
                                <td>7:15 PM - 7:20 PM</td>
                                <td>Music Performance</td>
                            </tr>
                            <tr>
                                <td>7:20 PM - 7:25 PM</td>
                                <td>2nd Prize - Reel Making Contest</td>
                            </tr>
                            <tr>
                                <td>7:25 PM - 7:35 PM</td>
                                <td>Music Performance</td>
                            </tr>
                            <tr>
                                <td>7:35 PM - 7:40 PM</td>
                                <td>1st Prize - Reel Making Contest</td>
                            </tr>
                            <tr>
                                <td>7:40 PM - 7:45 PM</td>
                                <td>Felicitation of Guest with Speech</td>
                            </tr>
                            <tr>
                                <td>7:45 PM - 8:05 PM</td>
                                <td>3rd Prize - Short Film Contest</td>
                            </tr>
                            <tr>
                                <td>8:05 PM - 8:15 PM</td>
                                <td>Dance Performance</td>
                            </tr>
                            <tr>
                                <td>8:15 PM - 8:35 PM</td>
                                <td>2nd Prize - Short Film Contest</td>
                            </tr>
                            <tr>
                                <td>8:35 PM - 8:45 PM</td>
                                <td>Dance Performance</td>
                            </tr>
                            <tr>
                                <td>8:45 PM - 9:05 PM</td>
                                <td>1st Prize - Short Film Contest</td>
                            </tr>
                            <tr>
                                <td>9:05 PM - 9:15 PM</td>
                                <td>Dance Performance</td>
                            </tr>
                            <tr>
                                <td>9:15 PM - 10:15 PM</td>
                                <td>Band Performance</td>
                            </tr>
                            <tr>
                                <td>10:15 PM - 10:30 PM</td>
                                <td>Vote of Thanks</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}