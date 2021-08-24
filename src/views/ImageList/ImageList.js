import React, { useState, useEffect, useRef, useCallback } from "react";
import classes from "./ImageList.module.css";
import globalClasses from "../../App.module.css";
import axios from "axios";
import errorImage from "../../assets/images/image-not-found.png";
import ImageFocus from "../ImageFocus/ImageFocus";

export default function ImageList() {
  const [redditImages, setRedditImages] = useState([]);
  const [filteredRedditImages, setFilteredRedditImages] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [nextPageCode, setNextPageCode] = useState("");
  const [showMore, setShowMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    //get initial batch of images on render
    window.addEventListener("scroll", handleScroll);
    getRedditImages();
  }, []);

  //limit = number of images on page, after = code to get next page of images
  const getRedditImages = (code) => {
    setLoadingResults(true);
    setSearchText('');

    axios({
      method: "GET",
      url: "http://www.reddit.com/r/pics/.json",
      params: { limit: 25, after: code },
    })
      .then((res) => {
        if (res["status"] == 200) {
          console.log("res: ", res);
          console.log("code: ", res.data.data.after);
          setNextPageCode(res.data.data.after);
          let images = res.data.data.children;
          console.log("Images coming in: ", images);
          setRedditImages([...redditImages, ...images]);
          setFilteredRedditImages([...filteredRedditImages, ...images]);
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
  };

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

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom) {
      console.log("at the bottom");
      // getRedditImages();
    }
  };

  //filter list by search text
  function filterList() {
    if (searchText.trim().length < 1) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
    let filteredList = [];
    filteredList = redditImages.filter((image) =>
      image.data.title.toLowerCase().includes(searchText.trim())
    );
    console.log("Filtered List Test: ", filteredList);
    setFilteredRedditImages(filteredList);
  }

  //select image to open in seperate view and prevent scrolling
  function selectImage(data) {
    document.body.style.overflow = "hidden";
    setSelectedImage(data);
  }

  return (
    <div className={classes.imageListContainer}>
      <h3>Image Listing</h3>
      <input
        className={classes.searchInput}
        value={searchText}
        placeholder="Search Results..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      ></input>
      <button className={classes.searchButton}>Search</button>
      {loadingResults == true && (
        <div className={globalClasses.loadingText}>
          Loading Images
          <span
            className={`${globalClasses.loadCircle} ${globalClasses.delay1}`}
          >
            .
          </span>
          <span
            className={`${globalClasses.loadCircle} ${globalClasses.delay2}`}
          >
            .
          </span>
          <span
            className={`${globalClasses.loadCircle} ${globalClasses.delay3}`}
          >
            .
          </span>
        </div>
      )}
      {filteredRedditImages.length > 0 && (
        <div className={classes.imageList}>
          {filteredRedditImages.map((image, index) => {
            return (
              <div
                onClick={() => {
                  selectImage(image);
                }}
                key={image.data.id}
                className={classes.imageCard}
              >
                <img
                  className={classes.image}
                  src={image.data.thumbnail}
                  onError={imageNotFound}
                ></img>
                <div className={classes.titleBg}>
                  <div className={classes.author}>{image.data.author}</div>
                  <div className={classes.imageTitle}>{image.data.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {filteredRedditImages.length < 1 && !loadingResults && (
        <div>
          <p className={globalClasses.loadingText}>No Images Found</p>
          <button className={classes.refreshButton} onClick={() => getRedditImages('')}>Refresh</button>
        </div>
      )}

      {selectedImage && (
        <ImageFocus data={selectedImage} setSelectedImage={setSelectedImage} />
      )}

      {filteredRedditImages.length > 0 && showMore && (
        <button
          className={classes.loadMoreButton}
          onClick={() => getRedditImages(nextPageCode)}
        >
          {loadingResults ? <span>LOADING...</span> : <span>LOAD MORE</span>}
        </button>
      )}
    </div>
  );
}
