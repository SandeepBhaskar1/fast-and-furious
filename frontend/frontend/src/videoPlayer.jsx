import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoID }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); 
    }
  }, [videoID]);

  return (
    <video ref={videoRef} width="640" height="360" controls autoPlay>
      <source src={`http://localhost:2686/videos/${encodeURIComponent(videoID)}`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
