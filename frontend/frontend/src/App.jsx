import { useState } from 'react';
import './App.css';
import VideoPlayer from './videoPlayer'; 

function App() {
  const [videoID, setVideoID] = useState(null);

  const videoTitles = [
    'The Fast and Furious',
    '2 Fast 2 Furious',
    'The Fast and Furious: Tokyo Drift',
    'Fast and Furious',
    'Fast Five',
    'Fast and Furious 6',
    'Furious 7',
    'The Fate of the Furious',
    'F9',
    'Fast X',
  ];

  const playVideo = (e, title) => {
    e.preventDefault();
    setVideoID(title);
  };

  return (
    <div className="App">
      <h1>Fast & Furious Video Streaming</h1>
      {videoID && <VideoPlayer videoID={videoID} />}
      <div className="buttons-container">
        {videoTitles.map((title, index) => (
          <button
            key={index}
            onClick={(e) => playVideo(e, title)}
            className={`video-button ${videoID === title ? 'active' : ''}`}
          >
            Play {title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
