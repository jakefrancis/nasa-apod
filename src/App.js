import React from "react";
import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "./components/Heading";
import Image from "./components/Image";
import SearchBar from "./components/SearchBar";
import debounce from "lodash.debounce";
import Video from './components/Video'
import Canvas from './components/Canvas'

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
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight * 0.8 || nasaData.length === 1
    ) {
      searchHandler();
    }
  });

  const offsetDay = () => {
    let current = new Date();
    let day = current.setDate(current.getDate() -1 - (1 * nasaData.length));
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
      }).then((response) => {

      }

      )
      .catch((error) => {
        console.log(error);
        setError(error)
        setIsLoading(false)
      });
  }

  const checkHeight = () => {
    if(window.innerHeight > document.documentElement.offsetHeight){
      searchHandler()
    }
  }


  useEffect(searchHandler, []);
  useEffect(checkHeight,[nasaData])




  const containerStyle = {
    maxWidth: "600px",
    margin: "2rem auto",
    textAlign: "center",
    fontFamily: "sans-serif",
    borderRadius: '2%'
  };

  return (
    <div>
      <Canvas></Canvas>
      <div style={containerStyle}>
        <Heading title={'NASA Astronomy Picture of the Day'}></Heading>
      </div>
      {nasaData.map((image) => {
        return (
          <div style={containerStyle}>
            <React.Fragment key={image.date}>
              <Heading title={image.title}></Heading>
              {image.media_type === 'image' ?<Image
                title={image.title}
                url={image.url}
                explanation={image.explanation}
                date={image.date}
              ></Image> : <Video
              title={image.title}
                url={image.url}
                explanation={image.explanation}
                date={image.date}
              ></Video>}
            </React.Fragment>
            {error &&
              <div style={{color: '#900'}}>
                {error}
              </div>
            }
          
          </div>
        );
      })}
        {isLoading &&
              <div><h1 style={{color: "yellow"}}>Loading ...</h1></div>
            }
    </div>
  );
}
