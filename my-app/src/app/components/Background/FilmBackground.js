'use client';
import React from 'react';
import filmPattern from '../../Assets/film-pattern';

const FilmBackground = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        zIndex: 0,
        transform: 'rotate(15deg) scale(1.5)',
      }}
      dangerouslySetInnerHTML={{ __html: filmPattern }}
    />
  );
};

export default FilmBackground; 