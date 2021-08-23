import React, { useState, useEffect, useRef } from "react";
import classes from "./ImageList.module.css";
import globalClasses from "../../App.module.css";
import axios from "axios";
import errorImage from "../../assets/images/image-not-found.png";
import ImageFocus from "../ImageFocus/ImageFocus";

export default function ImageList() {
  const [redditImages, setRedditImages] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [nextPageCode, setNextPageCode] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const list = useRef();

  useEffect(() => {
    //get initial batch of images on render
    getRedditImages(25, '');
  }, []);

  //limit = number of images on page, after = code to get next page of images
  function getRedditImages(limit, after) {
    setLoadingResults(true);
    axios
      .get("http://www.reddit.com/r/pics/.json?limit=" + limit + '&after=' + after)
      .then((res) => {
        if (res["status"] == 200) {
          console.log("Reddit results: ", res);
          setNextPageCode(res.data.data.after);
          let images = res.data.data.children;
          console.log("Reddit images: ", images);
          setRedditImages([...images]);
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
  }

  //function to replace image if no image is found
  function imageNotFound(e) {
    e.target.src = errorImage;
  }

  //handle 'Enter' key on search input
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      filterList();
    }
  }
  //handle search input binding with search text
  function handleChange(e) {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  }

  //handle user scrolling to bottom then grabbing next batch of images
  function handleScroll(e) {
    console.log('scrolling');
  }

  //filter list by search text
  function filterList() {
    let filteredList = [];
    filteredList = redditImages.filter((image) =>
      image.data.title.toLowerCase().includes(searchText)
    );
    console.log("Filtered List Test: ", filteredList);
    setRedditImages(filteredList);
  }

  //select image to open in seperate view
  function selectImage(data) {
    setSelectedImage(data)
  }

  return (
    <div className={classes.imageListContainer} onScroll={handleScroll}>
      <h3>Image Listing</h3>
      <input
        className={classes.searchInput}
        value={searchText}
        placeholder="Search Results..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      ></input>
      {loadingResults == true && (
        <div className={globalClasses.loadingText}>
          Loading Images
          <span className={`${globalClasses.loadCircle} ${globalClasses.delay1}`}>.</span>
          <span className={`${globalClasses.loadCircle} ${globalClasses.delay2}`}>.</span>
          <span className={`${globalClasses.loadCircle} ${globalClasses.delay3}`}>.</span>
        </div>
      )}
      {loadingResults == false && redditImages.length > 0 && (
        <div className={classes.imageList}>
          {redditImages.map((image) => {
            return (
              <div onClick={() => {selectImage(image)}} key={image.data.id} className={classes.imageCard}>
                <img
                  className={classes.image}
                  src={image.data.thumbnail}
                  onError={imageNotFound}
                ></img>
                <div className={classes.titleBg}>
                  <div className={classes.imageTitle}>{image.data.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedImage && (
        <ImageFocus data={selectedImage}/>
      )}
    </div>
  );
}
