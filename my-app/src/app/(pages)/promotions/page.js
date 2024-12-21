import "./page.css";
import { scheduleData } from "../../Data/scheduleData";
import Footer from "@/app/components/Footer/Footer";
export default function Schedule() {
  return (
    <div className="schedule-component">
      <div className="schedule-component-in">
        <div className="schedule-component-in-heading">
          <h1>Promotional Events Schedule</h1>
          <div className="venues-info">
            <p>🏛️ Venues: New Seminar Hall & Peacock Hall 🏛️</p>
          </div>
        </div>
        <div className="schedule-grid">
          {scheduleData.map((item, index) => (
            <div key={index} className={`schedule-card ${item.gradient}`}>
              <div className="emoji-circle">{item.emoji}</div>
              <div className="date">{item.date}</div>
              <div className="event-name">{item.event}</div>
              <div className="description">{item.description}</div>
            </div>
          ))}
        </div>
        <div className="schedule-component-in-footer">
          <Footer/>
        </div>
      </div>
    </div>
  );
}