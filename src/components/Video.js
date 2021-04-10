import React from 'react'
import './Video.css'

const Video = ({title, url, explanation, date }) => {
  const containerStyle = {
    width: "90%",
    padding: "1rem 0",
    color: "#F2ECFF",
    margin: "0 auto"
  };

  const pStyle = {
    textAlign: "left",
    padding: "0 1rem"
  };

  const videoStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
  };

  return (
  <div style={containerStyle}>
     <div className='video-responsive'>
      <iframe
      width="853"
      height='480'
      src={url}
      frameBorder="0"
      allowFullScreen
      title={title}      
      >
      </iframe>   
    </div> 
    <p style={pStyle}>{explanation}</p>
    <h3>{date}</h3>
  </div>
   
      
  )
}

export default Video