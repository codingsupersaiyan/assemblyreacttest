import React, { useState, useEffect } from "react";
import "./ImageList.css";
import axios from "axios";
import { render } from "@testing-library/react";

export default function ImageList() {
  const [redditImages, setRedditImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://www.reddit.com/r/pics/.json?jsonp=")
      .then((res) => {
        let images = res.data.data.children;
        console.log("Reddit images: ", images);
        setRedditImages(images);
      })
      .catch((err) => {
        console.log("Error getting reddit images: ", err);
      });
  }, []);

  return (
    <div class="image-list-container">
      <h3>Image Listing</h3>
      {redditImages.length > 0 && (
        <div class="image-list">
          {redditImages.map((image) => {
            return (
              <div key={image.data.id} class="image-card">
                <img class="image" src={image.data.url}></img>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
