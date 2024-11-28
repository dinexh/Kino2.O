const filmPattern = `
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <pattern id="film-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
    <!-- Film strip border -->
    <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    
    <!-- Film holes -->
    <circle cx="10" cy="10" r="4" fill="none" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="10" cy="90" r="4" fill="none" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="90" cy="10" r="4" fill="none" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="90" cy="90" r="4" fill="none" stroke="rgba(255,255,255,0.1)"/>
    
    <!-- Film frames -->
    <rect x="20" y="20" width="60" height="60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  </pattern>
  
  <rect x="0" y="0" width="100%" height="100%" fill="url(#film-pattern)"/>
</svg>
`;

export default filmPattern; 