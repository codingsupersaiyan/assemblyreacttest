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
  const [hitBottom, setHitBottom] = useState(false);

  useEffect(() => {
    //get initial batch of images on render
    getRedditImages();
  }, []);

  useEffect(() => {
    //infinite scroll update images logic
    if (hitBottom === true) {
      setHitBottom(false);
      getRedditImages(nextPageCode);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hitBottom]);

  //para,s {limit: number of items to grab, after: code to get next 'page' of images (acts as next button)}
  const getRedditImages = (code) => {
    setLoadingResults(true);
    setSearchText("");

    axios({
      method: "GET",
      url: "https://www.reddit.com/r/pics/.json",
      params: { limit: 24, after: code },
    })
      .then((res) => {
        if (res["status"] == 200) {
          setNextPageCode(res.data.data.after);
          let images = res.data.data.children;
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
  const imageNotFound = (e) => {
    e.target.src = errorImage;
  };

  //handle 'Enter' key on search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      filterList();
    }
  };
  //handle search input binding with search text
  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  //infinite scrolling handler
  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (bottom) {
      setHitBottom(true);
    }
  };

  //filter list by search text
  const filterList = () => {
    if (searchText.trim().length < 1) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
    let filteredList = [];
    filteredList = redditImages.filter((image) =>
      image.data.title.toLowerCase().includes(searchText.trim())
    );
    setFilteredRedditImages(filteredList);
  };

  //refresh button if no images are found
  const refreshList = () => {
    setSearchText("");
    setFilteredRedditImages(redditImages);
  };

  //select image to open in seperate view and prevent body scrolling
  const selectImage = (data) => {
    document.body.style.overflow = "hidden";
    setSelectedImage(data);
  };
  return (
    <div className={classes.imageListContainer}>
      <div className={classes.header}>
        <h3 className={classes.imageListHeader}>Reddit - r/pics</h3>
        <div className={classes.searchContainer}>
          <input
            className={classes.searchInput}
            value={searchText}
            placeholder="Search By Title..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          ></input>
          <button onClick={() => filterList()} className={classes.searchButton}>
            Search
          </button>
        </div>
      </div>
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
                id={index}
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
          <button
            className={classes.refreshButton}
            onClick={() => refreshList("")}
          >
            Refresh
          </button>
        </div>
      )}

      {selectedImage && (
        <ImageFocus data={selectedImage} setSelectedImage={setSelectedImage} />
      )}

      {filteredRedditImages.length > 0 && showMore && (
        <button
          className={classes.loadMore}
          onClick={() => getRedditImages(nextPageCode)}
        >
          {loadingResults ? (
            <div>
              LOADING IMAGES{" "}
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
          ) : (
            <span>LOAD MORE</span>
          )}
        </button>
      )}
    </div>
  );
}
