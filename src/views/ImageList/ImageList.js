import React, { useState, useEffect } from "react";
import "./ImageList.css";
import axios from "axios";
import { render } from "@testing-library/react";
import errorImage from "../../assets/images/image-not-found.png";
import { Tooltip } from "@material-ui/core";

export default function ImageList() {
  const [redditImages, setRedditImages] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setLoadingResults(true);
    axios
      .get("http://www.reddit.com/r/pics/.json?limit=28")
      .then((res) => {
        if (res["status"] == 200) {
          console.log("Reddit results: ", res);
          let images = res.data.data.children;
          // console.log("Reddit images: ", images);
          setRedditImages(images);
          setLoadingResults(false);
        } else {
          console.log("Error status: ", res["status"]);
          console.log("Error happened while getting reddit images: ", res);
          setLoadingResults(false);
        }
      })
      .catch((err) => {
        console.log("Error getting reddit images: ", err);
        setLoadingResults(false);
      });
  }, []);

  //function to replace image if no image is found
  function imageNotFound(e) {
    e.target.src = errorImage;
  }

  function filterList() {
    let filteredList = [];
    filteredList = redditImages.filter(image => image.includes(searchText))
    console.log('Filtered List Test: ', filteredList);
    // setRedditImages(filteredList);
  }

  return (
    <div class="image-list-container">
      <h3>Image Listing</h3>
      <input class="search-input" value="searchText" placeholder="Search Results..." onKeyDown={filterList}></input>
      {loadingResults == true && (
        <div class="loading-text">
          Loading Images
          <span class="load-circle delay-1">.</span>
          <span class="load-circle delay-2">.</span>
          <span class="load-circle delay-3">.</span>
        </div>
      )}
      {loadingResults == false && redditImages.length > 0 && (
        <div class="image-list">
          {redditImages.map((image) => {
            return (
              <div key={image.data.id} class="image-card">
                <img
                  class="image"
                  src={image.data.url}
                  onError={imageNotFound}
                ></img>
                <div class="title-bg">
                  <div class="image-title">{image.data.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
