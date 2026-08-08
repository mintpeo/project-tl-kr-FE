import React, {useRef, useState} from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url, classNameCss, onEnded, onDuration, onProgress }) => {
    const playerRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [playedSeconds, setPlayedSeconds] = useState(0);

    // Total Second
    const handleDuration = (totalSeconds) => {
        setDuration(totalSeconds);
        if (onDuration) {
            onDuration(totalSeconds);
        }
    };

    // Progress
    // const handleProgress = (progressState) => {
    //     setPlayedSeconds(progressState.playedSeconds);
    //     if (onProgress) {
    //         onProgress(progressState);
    //     }
    // };

  return (
      <ReactPlayer
          ref={playerRef}
          src={`https://www.youtube.com/watch?v=${url}`}
          styles={classNameCss}
          controls={true}
          width="100%"
          height="100%"
          onEnded={onEnded}
          // onDuration={handleDuration}
          // onProgress={handleProgress}
          // config={{
          //     youtube: {
          //         playerVars: {
          //             modestbranding: 1,
          //             rel: 0,
          //         }
          //     }
          // }}
      />
  );
};

export default React.memo(VideoPlayer);