import React, { useState, useEffect } from "react";
import "./ImageList.css";
import axios from "axios";
import { render } from "@testing-library/react";
import errorImage from "../../assets/images/image-not-found.png";
import { Tooltip } from "@material-ui/core";

export default function ImageList() {
  const [redditImages, setRedditImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://www.reddit.com/r/pics/.json?limit=28")
      .then((res) => {
        let images = res.data.data.children;
        console.log("Reddit images: ", images);
        setRedditImages(images);
      })
      .catch((err) => {
        console.log("Error getting reddit images: ", err);
      });
  }, []);

  //function to replace image if no image is found
  function imageNotFound(e) {
    e.target.src = errorImage;
  }

  return (
    <div class="image-list-container">
      <h3>Image Listing</h3>
      {redditImages.length > 0 && (
        <div class="image-list">
          {redditImages.map((image) => {
            return (
              <div key={image.data.id} class="image-card">
                <img
                  class="image"
                  src={image.data.url}
                  onError={imageNotFound}
                ></img>
                {/* <Tooltip title={image.data.title}>
                  <span> */}
                <div class="title-bg">
                  <div class="image-title">{image.data.title}</div>
                </div>
                {/* </span>
                </Tooltip> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
