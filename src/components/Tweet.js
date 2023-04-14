import React, { useState } from "react";
import { FaHeart, FaRetweet, FaCommentAlt } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { NavLink } from "react-router-dom";
export default function Tweet(props) {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );
  function timeDiff(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    } else if (minutes === 1) {
      return "1 minute ago";
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours === 1) {
      return "1 hour ago";
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return `${days} days ago`;
    }
  }

  let {
    user_id,
    tweetId,
    name,
    username,
    profile,
    time,
    text,
    likes,
    liked_by,
    comments,
    loggedIn,
    setShowComments,
  } = props;

  async function getPost() {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", tweetId);
    name = posts[0].name;
    username = posts[0].username;
    profile = posts[0].profile;
    time = posts[0].time;
    text = posts[0].text;
    likes = posts[0].likes;
    liked_by = posts[0].liked_by;
    comments = posts[0].comments;
    if (error) {
      console.log(error, "Tweet.js on line 64");
    }
  }

  const [likesCount, setlikesCount] = useState(likes);
  const [liked, setLiked] = useState(liked_by.includes(user_id));
  async function updateLikes() {
    await getPost();
    const tweet = document.getElementById(tweetId);
    const userId = user_id;
    let newLikesCount = likes;
    const likedBy = liked_by;
    if (!liked_by.includes(userId)) {
      newLikesCount = likes + 1;
      setlikesCount(newLikesCount);
      updateLikesInDatabase(tweetId, newLikesCount, userId, [
        ...likedBy,
        userId,
      ]);
      tweet.classList.add("liked");
      setLiked(true);
    } else {
      newLikesCount = likes - 1;
      likedBy.splice(likedBy.indexOf(userId), 1);
      updateLikesInDatabase(tweetId, newLikesCount, userId, [...likedBy]);
      tweet.classList.remove("liked");
      setlikesCount(newLikesCount);
      setLiked(false);
    }
  }

  async function updateLikesInDatabase(tweetId, likesCount, userId, likedBy) {
    const { data, error } = await supabase
      .from("posts")
      .update({ likes: likesCount, liked_by: likedBy })
      .eq("id", tweetId);

    if (error) {
      console.error(error);
    } else {
      console.log("Likes count updated in database", data);
    }
  }

  return (
    <div className="tweet">
      <div className="tweet-user">
        <img src={profile} alt="" />
        <div className="tweet-user-info">
          <p className="m-0">
            {name} <small className="text-muted">@{username}</small>
          </p>
          <small className="text-muted">{timeDiff(time)}</small>
        </div>
      </div>
      <div className="tweet-body mt-3">
        <p className="tweet-text">{text}</p>
        {/* <div className="tweet-img">
          <img className="img-fluid" src={image} alt="" />
        </div> */}
      </div>
      <div className="tweet-footer mt-4 ">
        <div className="tweet-footer-icons d-flex justify-content-between px-2">
          <div className="tweet-footer-icon center-flex">
            <FaHeart color="red" />
            <FaRetweet color="lightblue" />{" "}
            <small className="text-muted">{likesCount}</small>
          </div>
          <div className="tweet-footer-icon center-flex">
            <small className="text-muted">{comments} Comments</small>
          </div>
        </div>
        {loggedIn && (
          <div className="tweet-footer-icons mt-4 d-flex justify-content-around px-2">
            <div
              id={tweetId}
              className={`tweet-icon center-flex ${liked ? "liked" : ""}`}
              onClick={updateLikes}
            >
              <FaHeart color="pink" />
              <small>{liked ? "liked" : "like"}</small>
            </div>
            <div className="tweet-icon center-flex disabled text-muted">
              <FaRetweet color="#252525" size={25} /> <small>Retweet</small>
            </div>
            {/* <NavLink
              to={`post/${tweetId}`}
              className="tweet-icon center-flex text-light  text-center"
            > */}
            <div
              className="tweet-icon center-flex text-light  text-center"
              onClick={() => {
                setShowComments({ status: true, id: tweetId });
              }}
            >
              <FaCommentAlt color="lightblue" size={15} />{" "}
              <small>Comment</small>
            </div>
            {/* </NavLink> */}
          </div>
        )}
      </div>
    </div>
  );
}
