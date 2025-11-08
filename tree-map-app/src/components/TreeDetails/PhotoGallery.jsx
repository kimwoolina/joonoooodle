import { useState } from 'react';
import './PhotoGallery.css';

function PhotoGallery({ photos, treeName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className="photo-gallery">
        <div className="main-photo" onClick={() => setShowLightbox(true)}>
          <img src={photos[currentIndex]} alt={`${treeName} - Photo ${currentIndex + 1}`} />
          <div className="photo-counter">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {photos.length > 1 && (
          <div className="photo-controls">
            <button className="photo-nav prev" onClick={prevPhoto}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="thumbnail-container">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={photo} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
            <button className="photo-nav next" onClick={nextPhoto}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <button className="lightbox-close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <img src={photos[currentIndex]} alt={`${treeName} - Full size`} />
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
