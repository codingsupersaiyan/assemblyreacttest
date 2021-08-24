import React, { useState, useEffect, useRef } from "react";
import classes from "./ImageFocus.module.css";
import thumbsUp from "../../assets/images/thumb-up.png";

export default function ImageFocus(props) {

  const closeWindow = () => {
    document.body.style.overflow = 'visible';
    props.setSelectedImage(null);
  }

  return (
    <div className={classes.imageFocusContainer}>
      <button onClick={closeWindow} className={classes.closeButton}>x</button>
      <div className={classes.infoContainer}>
        <div className={classes.leftContainer}>
          <img
            className={classes.imageContainer}
            src={props.data.data.url}
          ></img>
        </div>
        <div className={classes.rightContainer}>
          <div className={classes.imageAuthor}>{props.data.data.author}</div>
          <div className={classes.imageCategories}>
            {props.data.data.content_categories.map((category) => {
              return <span>#{category}</span>;
            })}
          </div>
          <div className={classes.awardsContainer}>
            {props.data.data.all_awardings.map((award) => {
              return (
                <span>
                  <img src={award.icon_url} className={classes.awardIcon}></img>
                  <div className={classes.awardCount}>{award.count}</div>
                </span>
              );
            })}
          </div>
          <div className={classes.imageTitle}>"{props.data.data.title}"</div>
          <div className={classes.votesContainer}>
            <div className={classes.votesRow}>
              <img className={classes.thumbs} src={thumbsUp} />
              <span className={classes.votes}>{props.data.data.ups}</span>
            </div>
            <div className={classes.votesRow}>
              <img className={`${classes.thumbs} ${classes.thumbsDown}`} src={thumbsUp} />
              <span className={classes.votes}>{props.data.data.downs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
