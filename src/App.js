import React from "react";
import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "./components/Heading";
import Image from "./components/Image";
import debounce from "lodash.debounce";
import Video from './components/Video'
import Canvas from './components/Canvas'

const PORT = process.env.REACT_APP_PORT

export default function App() {
  const iodURL = `http://localhost:${PORT}/api/nasa/`;
  const [nasaData, setNasaData] = useState([]);
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
 

  window.onscroll = debounce(() => {  
    
    if(error || isLoading) return

    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight * 0.8 || nasaData.length === 1
    ) {
      searchHandler();
    }
  });

  const offsetDay = () => {
    let current = new Date();
    let day = current.setDate(current.getDate()  -   (1 * nasaData.length));
    let date = new Date(day).toISOString().split("T")[0];
    return date;
  };

  const searchHandler =  () => {
    setIsLoading(true)
    let copy = [...nasaData];
    let date = offsetDay()
    axios
      .get(iodURL + date)
      .then((response) => {
        setIsLoading(false)
        setNasaData(copy.concat(response.data));
      }).then((response) => {

      }

      )
      .catch((error) => {
        if(error.response.status === 400){
          const missingPage = {
            date: `Entry for ${date} could not be found`,
            explanation: "",
            url: null,
            media_type: 'image',
            title: 'Image Not Found',
          }
          setNasaData(copy.concat(missingPage))
        }
        else{
          setError(error)
          setIsLoading(false)
        }
        
      });
  }

  const checkHeight = () => {
    if(window.innerHeight > document.documentElement.offsetHeight){
      searchHandler()
    }
  }


  //useEffect(searchHandler, []);
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
          <div key={image.id} style={containerStyle}>
            <React.Fragment >
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
