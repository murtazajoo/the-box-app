import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { FaHeart, FaCommentAlt, FaBookmark } from "react-icons/fa";
export default function Tweet({
  post,
  loggedIn,
  saved,
  setShowComments,
  user_id,
}) {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  let {
    id,
    name,
    username,
    profile,
    created_at,
    text,
    likes,
    liked_by,
    comments,
  } = post;

  function created_atDiff(dateStr) {
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

  async function getPost() {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id);

    if (error) {
      console.log(error, "Tweet.js on line 64");
    } else {
      likes = posts[0].likes;
      liked_by = posts[0].liked_by;
    }
  }

  const [likesCount, setlikesCount] = useState(likes);
  const [liked, setLiked] = useState(liked_by.includes(user_id));

  // update likes in supabase database
  async function updateLikesInDatabase(id, likesCount, likedBy) {
    const { data, error } = await supabase
      .from("posts")
      .update({ likes: likesCount, liked_by: likedBy })
      .eq("id", id);

    if (error) {
      console.error(error, data);
    }
  }

  // like tweet
  async function updateLikes() {
    await getPost();
    const tweet = document.getElementById("like" + id);
    let newLikesCount = likes;
    let likedBy = liked_by;

    if (liked_by.includes(user_id)) {
      setLiked(false);
      newLikesCount = likes - 1;
      setlikesCount(newLikesCount);
      tweet.classList.remove("liked");
      likedBy.splice(likedBy.indexOf(user_id), 1);
      updateLikesInDatabase(id, newLikesCount, [...likedBy]);
    } else {
      setLiked(true);
      tweet.classList.add("liked");
      newLikesCount = likes + 1;
      setlikesCount(newLikesCount);
      updateLikesInDatabase(id, newLikesCount, [...likedBy, user_id]);
    }
  }

  // save tweet
  async function updatesaved() {
    let { data: user } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", user_id);

    let toSave;
    const tweet = document.getElementById("save" + id);

    if (!user[0].saved.includes(id.toString())) {
      tweet.classList.add("saved");
      toSave = [...user[0].saved, id];
    } else {
      tweet.classList.remove("saved");
      toSave = user[0].saved.filter((id) => id !== id.toString());
    }

    const { data, error } = await supabase
      .from("user")
      .update({ saved: toSave })
      .eq("user_id", user_id);

    if (error) {
      console.error(error, data);
    }
  }

  return (
    <div className="tweet">
      <div className="tweet-user">
        <img src={profile} alt="user-profile" width={50} height={50} />
        <div className="tweet-user-info">
          <p className="m-0">
            {name} <small className="text-muted">@{username}</small>
          </p>
          <small className="text-muted">{created_atDiff(created_at)}</small>
        </div>
      </div>
      <div className="tweet-body mt-3">
        <pre className="tweet-text">{text}</pre>
        {/* <div className="tweet-img">
          <img className="img-fluid" src={image} alt="" />
        </div> */}
      </div>
      <div className="tweet-footer mt-4 ">
        <div className="tweet-footer-icons d-flex justify-content-between px-2">
          <div className="tweet-footer-icon center-flex">
            <FaHeart color="#960018" />
            {/* <FaRetweet color="lightblue" />{" "} */}
            <small className="text-muted">{likesCount}</small>
          </div>
          <div className="tweet-footer-icon center-flex">
            <small
              className="text-muted"
              onClick={() => {
                if (loggedIn) {
                  setShowComments({ status: true, id: id });
                }
              }}
            >
              {comments.length} Comments
            </small>
          </div>
        </div>
        {loggedIn && (
          <div className="tweet-footer-icons mt-4 d-flex justify-content-around px-2">
            <div
              id={"like" + id}
              className={`tweet-icon center-flex ${liked ? "liked" : ""}`}
              onClick={updateLikes}
            >
              <FaHeart className="tweet-icon-inside" />
              <small>{liked ? "" : ""}</small>
            </div>

            <div
              className="tweet-icon center-flex text-light  text-center"
              onClick={() => {
                setShowComments({ status: true, id: id });
              }}
            >
              <FaCommentAlt className="tweet-icon-inside" size={15} />{" "}
              <small></small>
            </div>
            <div
              id={"save" + id}
              className={`tweet-icon  center-flex ${
                saved.includes(id.toString()) ? "saved" : ""
              } `}
              onClick={() => {
                updatesaved();
              }}
            >
              <FaBookmark className="tweet-icon-inside" size={15} />
              <small></small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
