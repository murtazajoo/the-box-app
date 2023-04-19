import React, { useState } from "react";
import { FaHeart, FaRetweet, FaCommentAlt, FaBookmark } from "react-icons/fa";
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

  let {
    user_id,
    saved,
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

  async function updateLikesInDatabase(tweetId, likesCount, userId, likedBy) {
    const { data, error } = await supabase
      .from("posts")
      .update({ likes: likesCount, liked_by: likedBy })
      .eq("id", tweetId);

    if (error) {
      console.error(error, data);
    }
  }

  async function updateLikes() {
    await getPost();
    const tweet = document.getElementById("like" + tweetId);
    const userId = user_id;
    let newLikesCount = likes;
    const likedBy = liked_by;
    if (!liked_by.includes(userId)) {
      setLiked(true);
      newLikesCount = likes + 1;
      setlikesCount(newLikesCount);
      updateLikesInDatabase(tweetId, newLikesCount, userId, [
        ...likedBy,
        userId,
      ]);
      tweet.classList.add("liked");
    } else {
      setLiked(false);
      newLikesCount = likes - 1;
      likedBy.splice(likedBy.indexOf(userId), 1);
      updateLikesInDatabase(tweetId, newLikesCount, userId, [...likedBy]);
      tweet.classList.remove("liked");
      setlikesCount(newLikesCount);
    }
  }



  async function updatesaved() {
    let { data: user } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", user_id);

    let toSave;
    const tweet = document.getElementById("save" + tweetId);

    if (!user[0]['saved'].includes(tweetId.toString())) {
      tweet.classList.add("saved");
      toSave = [...user[0].saved, tweetId];
    } else {
      tweet.classList.remove("saved");
      toSave = user[0].saved.filter((id) => id !== tweetId.toString());
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
        <img src={profile} alt="user-profile"  width={50} height={50}/>
        <div className="tweet-user-info">
          <p className="m-0">
            {name} <small className="text-muted">@{username}</small>
          </p>
          <small className="text-muted">{timeDiff(time)}</small>
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
                  setShowComments({ status: true, id: tweetId });
                }
              }}
            >
              {comments} Comments
            </small>
          </div>
        </div>
        {loggedIn && (
          <div className="tweet-footer-icons mt-4 d-flex justify-content-around px-2">
            <div
              id={"like" + tweetId}
              className={`tweet-icon center-flex ${liked ? "liked" : ""}`}
              onClick={updateLikes}
            >
              <FaHeart className="tweet-icon-inside"/>
              <small>{liked ? "" : ""}</small>
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
              <FaCommentAlt className="tweet-icon-inside" size={15} /> <small></small>
            </div>
            <div
              id={"save" + tweetId}
              className={`tweet-icon  center-flex ${saved.includes(tweetId.toString())?"saved":"" } `}
              onClick={() => {
                updatesaved();
              }}
            >
              <FaBookmark className="tweet-icon-inside" size={15} />{" "}
              <small></small>
            </div>
            {/* </NavLink> */}
          </div>
        )}
      </div>
    </div>
  );
}
