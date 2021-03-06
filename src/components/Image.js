import React from "react";

const Image = ({ title, url, explanation, date }) => {
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

  const imgStyle = {
    width: "90%"
  };
  return (
    <div style={containerStyle}>
      <img style={imgStyle} src={url} alt={title} />
      <p style={pStyle}>{explanation}</p>
      <h3>{date}</h3>
    </div>
  );
};

export default Image;
