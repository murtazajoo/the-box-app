import React from "react";
import { FaHeart, FaRetweet, FaCommentAlt } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

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

  const { name, username, profile, time, text, likes, comments } = props;

  async function updateLikes(event, state) {
    console.log(event.target.classList);
    //   const { data, error } = await supabase
    //     .from("posts")
    //     .update({
    //       likes: state
    //         ? parseInt(event.target.id) + 1
    //         : parseInt(event.target.id) - 1,
    //     })
    //     .eq("user_id", props.user.user_id);
    //   if (data) {
    //     return;
    //   } else {
    //     console.log(error);
    //   }
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
            <small className="text-muted">{likes}</small>
          </div>
          <div className="tweet-footer-icon center-flex">
            <small className="text-muted">{comments} Comments</small>
          </div>
        </div>
        <div className="tweet-footer-icons mt-4 d-flex justify-content-around px-2">
          <div
            id={likes}
            className="tweet-icon center-flex "
            onClick={updateLikes}
          >
            <FaHeart id={likes} color="pink" />
            <small id={likes}>like</small>
          </div>
          <div className="tweet-icon center-flex">
            <FaRetweet color="lightblue" size={25} /> <small>Retweet</small>
          </div>
          <div className="tweet-icon center-flex">
            <FaCommentAlt color="lightblue" /> <small>Comment</small>
          </div>
        </div>
      </div>
    </div>
  );
}
