import React from "react";
import { useState } from "react";

const SearchBar = ({ changeHandler, clickHandler }) => {
  return (
    <div>
      <input onChange={changeHandler} type="date"></input>
      <button onClick={clickHandler}>search</button>
    </div>
  );
};

export default SearchBar;
