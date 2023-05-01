import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { FaHeart, FaCommentAlt, FaBookmark } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";
import supabase from "../assets/supabase";
export default function Tweet({
  post,
  loggedIn,
  setShowComments,
  user,
  setScrollPosition,
}) {
  const cookies = new Cookies();
  const c_user_id = cookies.get("user_id");
  let {
    id,
    name,
    username,
    profile,
    created_at,
    user_id,
    text,
    likes,
    liked_by,
    comments,
  } = post;
  const [userData, setUserData] = useState(user);
  const [postUser, setPostUser] = useState(null);
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
      console.log(error, " on line 63");
    } else {
      likes = posts[0].likes;
      liked_by = posts[0].liked_by;
    }
  }

  const [likesCount, setLikesCount] = useState(likes);
  const [liked, setLiked] = useState(liked_by.includes(c_user_id));

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

  async function getuser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserData(user.user_metadata);
  }

  useEffect(() => {
    const f = async () => await getuser();
    f();
    const f2 = async () => {
      const { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", user_id);
      console.log(user);
      setPostUser(user[0]);
    };
    f2();
  }, []);
  // like tweet
  async function updateLikes() {
    await getPost();
    const tweet = document.getElementById("like" + id);
    let newLikesCount = likes;
    let likedBy = liked_by;

    if (liked_by.includes(c_user_id)) {
      setLiked(false);
      newLikesCount = likes - 1;
      setLikesCount(newLikesCount);
      tweet.classList.remove("liked");
      likedBy.splice(likedBy.indexOf(c_user_id), 1);
      updateLikesInDatabase(id, newLikesCount, [...likedBy]);
    } else {
      setLiked(true);
      tweet.classList.add("liked");
      newLikesCount = likes + 1;
      setLikesCount(newLikesCount);
      updateLikesInDatabase(id, newLikesCount, [...likedBy, c_user_id]);
    }
  }

  // save tweet
  const [isSaved, setIsSaved] = useState(
    userData.saved.includes(id.toString())
  );
  async function updatesaved() {
    const tweet = document.getElementById("save" + id);
    // get saved from supabase database
    await getuser();
    let saved = userData.saved;
    let toSave = [...saved];
    if (!isSaved) {
      tweet.classList.add("saved");
      setIsSaved(true);
      toSave = [...saved, id.toString()];
    } else {
      setIsSaved(false);
      tweet.classList.remove("saved");
      toSave.splice(saved.indexOf(id.toString()), 1);
    }
    // update saved in supabase database
    const { data, error } = await supabase.auth.updateUser({
      data: { saved: toSave },
    });
    const { userdata, usererror } = await supabase
      .from("user")
      .update({ saved: toSave })
      .eq("user_id", c_user_id);
    if (error) {
      console.error(error, data);
    }
  }

  return (
    <div className="tweet ">
      <div className="tweet-user">
        <img
          src={postUser ? postUser.profile : userData.profile}
          className="rounded-pill border border-1 border-primary"
          alt="user-profile"
          width={50}
          height={50}
        />

        <div
          className="tweet-user-info"
          onClick={() => {
            setScrollPosition(window.scrollY);
          }}
        >
          <NavLink
            to={`/profile/${username}`}
            className="m-0 d-block text text-decoration-none border-0"
          >
            {name} <small className="text-muted">@{username}</small>
          </NavLink>
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
              className={`tweet-icon  center-flex ${isSaved ? "saved" : ""} `}
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
