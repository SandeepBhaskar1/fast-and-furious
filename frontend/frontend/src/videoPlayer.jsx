import React, { useState, useRef } from 'react';  
import './App.css';

const VideoPlayer = () => {
  const [video, setVideo] = useState('');
  const videoRef = useRef(null);

  const handleVideoSelect = (selectedVideo) => {
    setVideo(selectedVideo);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const backendUrl = import.meta.env.VITE_BACKEND_LOCAL_URL || import.meta.env.VITE_BACKEND_CLOUD_URL ;

  return (
    <div>
      <h1>The Fast And Furious Movie Series Trailers</h1>

      {video && (
        <div>
          <video ref={videoRef} controls width="1080" autoPlay>
            <source src={`${backendUrl}/video/${video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div>
        <button onClick={() => handleVideoSelect('the-fast-and-furious.mp4')}>The Fast and Furious</button>
        <button onClick={() => handleVideoSelect('2-fast-furious.mp4')}>2 Fast 2 Furious</button>
        <button onClick={() => handleVideoSelect('tokyo-drift.mp4')}>Tokyo Drift</button>
        <button onClick={() => handleVideoSelect('fast-furious-4.mp4')}>Fast & Furious</button>
        <button onClick={() => handleVideoSelect('fast-5.mp4')}>Fast Five</button>
        <button onClick={() => handleVideoSelect('fast-furious-6.mp4')}>Fast & Furious 6</button>
        <button onClick={() => handleVideoSelect('furious-7.mp4')}>Furious 7</button>
        <button onClick={() => handleVideoSelect('furious-8.mp4')}>The Fate of the Furious</button>
        <button onClick={() => handleVideoSelect('fast-furious-9.mp4')}>F9</button>
        <button onClick={() => handleVideoSelect('fast-x.mp4')}>Fast X</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
