'use client';

import Image from 'next/image';
import { logo } from '../../Data/logo';
import './sponcers.css';
import Link from 'next/link';

const Sponcers = () => {
  return (
    <div className="sponcer-container" id="sponsors">
      <div className="sponcer-container-in">
        <div className="sponcer-container-in-one">
          <h2>In Association With</h2>
        </div>
        <div className="sponcer-container-in-two">
          <div className="sponcer-container-in-two-in">
            {[...logo, ...logo].map((image, index) => (
              <div key={index} className="sponcer-item">
                <Link href={image.url} legacyBehavior>
                 <a target="_blank" rel="noref noopener">
                    <Image
                    src={image.logo}
                    alt={`Sponsor ${index + 1}`}
                    className="sponcer-image"
                    width={500}
                    height={375}
                    />
                 </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponcers;
