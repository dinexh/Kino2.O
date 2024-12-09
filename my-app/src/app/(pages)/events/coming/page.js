"use client";

const ComingEvents = () => {
  return (
    <div className="container">
      <div className="content-box">
        {/* Film reel decoration */}
        <div className="reel-container">
          <svg className="film-reel" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
          </svg>
        </div>

        <h1>🎬 Coming Soon 🎬</h1>

        <div className="message">
          <p className="primary-text">
            Registrations haven't started yet!
          </p>
          
          <p className="secondary-text">
            We'll notify you through email or our Telegram group when registrations open.
          </p>

          <div className="button-container">
            <a
              href="https://t.me/+qpJmuwnkAc5hMDVl"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-button"
            >
              <svg className="telegram-icon" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.13l-1.69 7.95c-.13.59-.48.74-.98.46l-2.7-1.99-1.3 1.25c-.14.14-.27.26-.55.26l.19-2.77 5.05-4.55c.22-.2-.05-.31-.34-.12l-6.24 3.93-2.68-.84c-.58-.18-.59-.58.12-.86l10.46-4.03c.48-.18.91.11.76.81z"/>
              </svg>
              Join our Telegram Group
            </a>
          </div>
        </div>

        <div className="decoration">
          <div className="clapperboard">
            <div className="clapperboard-top">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="clapperboard-bottom">
              <div className="text">COMING SOON</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background-color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          color: white;
        }

        .content-box {
          max-width: 600px;
          width: 100%;
          text-align: center;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 1rem;
          border: 1px solid #333;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .reel-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .film-reel {
          width: 64px;
          height: 64px;
          color: #ffd700;
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 1.5rem;
          letter-spacing: 2px;
        }

        .message {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .primary-text {
          font-size: 1.25rem;
          color: #e0e0e0;
        }

        .secondary-text {
          font-size: 1.1rem;
          color: #a0a0a0;
        }

        .button-container {
          margin-top: 2rem;
        }

        .telegram-button {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: #2196f3;
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .telegram-button:hover {
          background-color: #1976d2;
        }

        .telegram-icon {
          width: 20px;
          height: 20px;
          margin-right: 0.5rem;
        }

        .decoration {
          margin-top: 3rem;
          display: flex;
          justify-content: center;
          perspective: 1000px;
        }

        .clapperboard {
          width: 200px;
          transform: rotate(-5deg);
        }

        .clapperboard-top {
          height: 40px;
          background: #222;
          border: 2px solid #ffd700;
          border-bottom: none;
          border-radius: 5px 5px 0 0;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          position: relative;
          transform-origin: bottom;
          animation: clap 5s infinite;
        }

        .clapperboard-top span {
          width: 20px;
          height: 100%;
          background: #ffd700;
          transform: skew(-15deg);
        }

        .clapperboard-bottom {
          height: 60px;
          background: #111;
          border: 2px solid #ffd700;
          border-radius: 0 0 5px 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .clapperboard-bottom .text {
          color: #ffd700;
          font-size: 0.8rem;
          font-weight: bold;
          letter-spacing: 2px;
        }

        @keyframes clap {
          0%, 90%, 100% {
            transform: rotateX(0);
          }
          95% {
            transform: rotateX(45deg);
          }
        }

        @media (max-width: 640px) {
          .clapperboard {
            width: 150px;
          }

          .clapperboard-top {
            height: 30px;
          }

          .clapperboard-bottom {
            height: 45px;
          }

          .clapperboard-top span {
            width: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingEvents;
