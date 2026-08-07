import React from 'react';
import ReactPlayer from 'react-player';

// Component độc lập, chỉ nhận url qua props
const VideoPlayer = ({ url, onEnded }) => {
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
      <ReactPlayer
        src={url}
        controls={true}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        onEnded={onEnded}
        // config={{
        //     youtube: {
        //         playerVars: {
        //             modestbranding: 1,
        //             rel: 0,
        //         }
        //     }
        // }}
      />
    </div>
  );
};

export default React.memo(VideoPlayer);