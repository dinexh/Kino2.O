'use client';

import Image from 'next/image';
import { galleryImages } from '../../Data/gallery';
import './gallery.css';

const Gallery = () => {
  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">
        <div className="gallery-heading">
          <h2>Gallery</h2>
        </div>
        <div className="gallery-scroll">
          <div className="gallery-content">
            {galleryImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <Image 
                  src={image} 
                  alt={`Gallery image ${index + 1}`} 
                  className="gallery-image" 
                  width={800}
                  height={600}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;