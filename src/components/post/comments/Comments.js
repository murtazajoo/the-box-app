import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import AddComment from "./AddComment";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NavLink } from "react-router-dom";
import formatTimeStamp from "../../../assets/format_time_stamp";
import { FaHeart } from "react-icons/fa";
import Comment from "./Comment";

export default function Comments({ id, user, setShowComments }) {
  const supabase = useSupabaseClient();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  async function getPost() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id);
    if (error) {
      console.log(error);
    } else {
      setPost(data[0]);
    }
  }

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!comments || !post) return;
    setComments(
      post.comments.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )
    );
  }, [comments, post]);

  return (
    <div className="post-bg">
      <div className="post-container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid ">
            <div className="navbar-brand center-flex">
              <div
                className="text back-btn"
                onClick={() => {
                  setShowComments(false);
                }}
              >
                <BsArrowLeft />
              </div>
              <span className="mx-4 text-muted ">POST</span>
            </div>
          </div>
        </nav>
        <div className="px-2">
          {post && user ? (
            <>
              <div className="tweet ">
                <div className="tweet-user">
                  <img
                    src={user.profile}
                    className="rounded-pill border border-1 border-primary"
                    alt="user-profile"
                    width={50}
                    height={50}
                  />

                  <div className="tweet-user-info">
                    <NavLink
                      to={`/profile/${post.username}`}
                      className="m-0 d-block text text-decoration-none border-0"
                    >
                      {post.name}
                      <small className="text-muted"> @{post.username}</small>
                    </NavLink>
                    <small className="text-muted">
                      {formatTimeStamp(post.created_at)}
                    </small>
                  </div>
                </div>
                <div className="tweet-body mt-3">
                  <pre className="tweet-text">{post.text}</pre>
                  {/* <div className="tweet-img">
          <img className="img-fluid" src={image} alt="" />
        </div> */}
                </div>
                <div className="tweet-footer mt-4 ">
                  <div className="tweet-footer-icons d-flex justify-content-between px-2">
                    <div className="tweet-footer-icon center-flex">
                      <FaHeart color="#960018" />
                      {/* <FaRetweet color="lightblue" />{" "} */}
                      <small className="text-muted">
                        {post.liked_by.length}
                      </small>
                    </div>
                    <div className="tweet-footer-icon center-flex">
                      <small className="text-muted">
                        {post.comments.length} Comments
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="conatiner ">
                <div className="row d-flex justify-content-center ">
                  <div className="col-md-12 col-lg-12">
                    <div className="card shadow-0 border-0  comments">
                      <div className="card-body p-4">
                        <h3 className="text mb-4">comments</h3>

                        <AddComment post={post} getPost={getPost} />
                        {post &&
                          comments &&
                          comments.length > 0 &&
                          comments.map((comment) => (
                            <Comment
                              key={JSON.stringify(comment.comment)}
                              comment={comment}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="m-auto my-5 text-center">
              <span className="">Loading...</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
