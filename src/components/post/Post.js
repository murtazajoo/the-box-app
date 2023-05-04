import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { FaHeart, FaCommentAlt, FaBookmark } from "react-icons/fa";
import { MdCancel, MdOutlineReportGmailerrorred } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import Comment from "./comments/Comments";
import Likes from "./likes/Likes";
import formatTimeStamp from "../../assets/format_time_stamp";

import { BsPersonFill, BsThreeDots, BsTrash3 } from "react-icons/bs";
import { toast } from "react-toastify";

export default function Post({
  post,
  loggedIn,
  user,
  updateUser,
  setScrollPosition,
  deletePost,
  getPosts,
}) {
  const supabase = useSupabaseClient();
  const [postUser, setPostUser] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const { id, text, created_at, username, liked_by, comments } = post;

  useEffect(() => {
    if (showComments || showLikes) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showComments, showLikes]);

  useEffect(() => {
    async function getPostUser() {
      let { data: postUser, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", username)
        .single();
      if (error) {
        console.log(error.message);
      } else {
        setPostUser(postUser);
      }
    }
    getPostUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (liked_by && user) {
      setLikesCount(liked_by.length);
      if (liked_by.includes(user.id)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, user]);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    let saved = user.user_metadata.saved;
    if (saved) {
      if (saved.includes(id.toString())) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    }
  }, [id, user]);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    let { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.log(error.message);
    } else {
      if (post.liked_by.includes(user.id) === false) {
        let { error } = await supabase
          .from("posts")
          .update({ liked_by: [...post.liked_by, user.id] })
          .eq("id", id);
        if (error) {
          console.log(error.message);
        }
      } else {
        let { error } = await supabase
          .from("posts")
          .update({ liked_by: post.liked_by.filter((id) => id !== user.id) })
          .eq("id", id);
        if (error) {
          console.log(error.message);
        }
      }
    }
  };

  const handleSave = async () => {
    let toSave = saved
      ? user.user_metadata.saved.filter((postId) => postId !== id.toString())
      : [...user.user_metadata.saved, id.toString()];
    setSaved(!saved);

    let { error } = await supabase
      .from("user")
      .update({
        saved: toSave,
      })
      .eq("user_id", user.id);
    if (error) {
      console.log(error.message);
    } else {
      const { data, error } = await supabase.auth.updateUser({
        data: { saved: toSave },
      });
      if (error) {
        console.log(error.message, data);
      }
    }
  };

  const handleDelete = async () => {
    let confirm = window.confirm("Are you sure you want to delete this post?");

    if (!confirm) return;
    await deletePost(id);
    await getPosts();
  };

  return (
    <>
      {showComments && (
        <Comment
          id={post.id}
          user={postUser}
          setShowComments={setShowComments}
        />
      )}
      {showLikes && <Likes id={post.id} setShowLikes={setShowLikes} />}
      {postUser && (
        <div className="tweet position-relative" key={post.id + "tt"}>
          {showOptions && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,.2)",
                width: "100%",
                zIndex: 1,
                height: "100%",
                transition: "all .3s ease",
              }}
            >
              <div
                className="tweet-user-menu border bg-text rounded-4 px-3 position-absolute  text"
                style={{
                  top: "10px",
                  right: "10px",
                  width: "180px",
                  // height: "180px",
                  zIndex: "2",
                }}
              >
                <button
                  className="position-absolute top-0 btn "
                  style={{ right: "0px" }}
                  onClick={() => setShowOptions(false)}
                >
                  <MdCancel className="text" size={20} />
                </button>
                {user && user.id === post.user_id ? (
                  <>
                    <div className="tweet-user-menu-item my-2 ">
                      <div
                        className="d-flex align-items-center btn border-0 text-danger"
                        onClick={() => {
                          handleDelete(post.id);
                          setShowOptions(false);
                        }}
                      >
                        <BsTrash3 className="me-2" />
                        <span>delete</span>
                      </div>
                    </div>
                    {/* <div className="tweet-user-menu-item my-3 ">
                      <div className="d-flex align-items-center">
                        <TbEdit className="me-2" />
                        <span>edit</span>
                      </div>
                    </div> */}
                  </>
                ) : (
                  <>
                    <div className="tweet-user-menu-item my-3 ">
                      <NavLink
                        to={`/profile/${username}`}
                        className="text-decoration-none d-block btn border-0   text"
                      >
                        <div className="d-flex align-items-center">
                          <BsPersonFill className="me-2" />
                          <span>Profile</span>
                        </div>
                      </NavLink>
                    </div>
                    <div className="tweet-user-menu-item my-3 ">
                      <div
                        className="d-flex align-items-center btn border-0"
                        onClick={() => {
                          toast.success("Reported Successfully");
                          setShowOptions(false);
                        }}
                      >
                        <MdOutlineReportGmailerrorred className="me-2" />
                        <span>Report</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="tweet-user">
            <img
              src={
                postUser.profile ||
                `https://ui-avatars.com/api/?name=${post.name}`
              }
              className="rounded-pill border border-1 border-primary"
              alt="user-profile"
              width={50}
              height={50}
            />
            <div className="d-flex position-relative justify-content-between align-items-center w-100 ">
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
                  {postUser.name || "loading...."}
                  <small className="text-muted">@{username}</small>
                </NavLink>
                <small className="text-muted">
                  {formatTimeStamp(created_at)}
                </small>
              </div>
              {loggedIn && (
                <div>
                  <button
                    onClick={() => setShowOptions(true)}
                    className="btn btn-sm  px-3 py-1"
                  >
                    <BsThreeDots className="text" />
                  </button>
                </div>
              )}

              {/* make a small menu */}
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
              <div
                className="tweet-footer-icon center-flex"
                onClick={() => {
                  if (!loggedIn) return navigate("/login");
                  setShowLikes(!showLikes);
                }}
              >
                <FaHeart color="#960018" />
                {/* <FaRetweet color="lightblue" />{" "} */}
                <small className="text-muted">{likesCount}</small>
              </div>
              <div
                className="tweet-footer-icon center-flex"
                onClick={() => {
                  if (!loggedIn) return navigate("/login");
                  setShowComments(!showComments);
                }}
              >
                <small className="text-muted">{comments.length} Comments</small>
              </div>
            </div>
            {loggedIn && (
              <div className="tweet-footer-icons mt-4 d-flex justify-content-around px-2">
                <div
                  id={"like" + id}
                  className={`tweet-icon center-flex ${liked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  <FaHeart className="tweet-icon-inside" />
                  <small>{liked ? "" : ""}</small>
                </div>

                <div
                  className="tweet-icon center-flex text-light  text-center"
                  onClick={() => {
                    setShowComments(!showComments);
                  }}
                >
                  <FaCommentAlt className="tweet-icon-inside" size={15} />{" "}
                  <small></small>
                </div>
                <div
                  id={"save" + id}
                  className={`tweet-icon  center-flex ${saved ? "saved" : ""} `}
                  onClick={handleSave}
                >
                  <FaBookmark className="tweet-icon-inside" size={15} />
                  <small></small>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
