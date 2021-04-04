import React from "react";
import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "./components/Heading";
import Image from "./components/Image";
import SearchBar from "./components/SearchBar";
import debounce from "lodash.debounce";
const api_key = process.env.REACT_APP_API_KEY;

export default function App() {
  const iodURL = "https://api.nasa.gov/planetary/apod?api_key=";
  const [nasaData, setNasaData] = useState([]);
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState('')

  window.onscroll = debounce(() => {

    if(error || isLoading || !hasMore) return

    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      searchHandler();
    }
  });

  const offsetDay = () => {
    let current = new Date();
    let day = current.setDate(-1 * nasaData.length);
    let date = new Date(day).toISOString().split("T")[0];
    console.log(date);
    return date;
  };

  const changeHandler = (event) => {
    setDate(event.target.value);
  };

  const nasaHook = () => {
    const copy = [...nasaData];
    axios
      .get(iodURL + api_key)
      .then((response) => setNasaData(copy.concat(response.data)));
  };

  const searchHandler =  () => {
    setIsLoading(true)
    axios
      .get(iodURL + api_key + "&date="  + offsetDay())
      .then((response) => {
        let copy = [...nasaData];
        setIsLoading(false)
        setNasaData(copy.concat(response.data));
      })
      .catch((error) => {
        console.log(error);
        setError(error)
        setIsLoading(false)
      });
  };
  useEffect(searchHandler, []);

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "sans-serif"
  };

  return (
    <div>
      {nasaData.map((image) => {
        return (
          <div style={containerStyle}>
            <React.Fragment key={image.date}>
              <Heading title={image.title}></Heading>
              <Image
                url={image.url}
                explanation={image.explanation}
                date={image.date}
              ></Image>
            </React.Fragment>
            {error &&
              <div style={{color: '#900'}}>
                {error}
              </div>
            }
            {isLoading &&
              <div><h1 style={{color: "yellow"}}>Loading ...</h1></div>
            }
          </div>
        );
      })}
    </div>
  );
}
