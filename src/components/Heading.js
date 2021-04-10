import React from "react";

const Heading = ({ title, url, date, explanation }) => {
  const headingStyle = {
    paddingTop: "1rem",
    color: "#00C896"
  };

  return (
    <div style={headingStyle}>
      <h2>{title}</h2>
    </div>
  );
};

export default Heading;
