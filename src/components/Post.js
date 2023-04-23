import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsFillSendFill } from "react-icons/bs";
import "../css/post.css";
import { createClient } from "@supabase/supabase-js";
import Tweet from "./Tweet";
import Cookies from "universal-cookie";

export async function loader({ params }) {
  const postID = params.postID;
  return { postID };
}
const supabase = createClient(
  "https://xmeyiduceoxfvciwoajn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
);

function AddComment({ post_id, comments, getPost, userProfile }) {
  const [alert, setAlert] = useState({ status: false, message: "" });
  const [formData, setFormData] = useState({ text: "" });
  const cookie = new Cookies();
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.text === "") return;
    const date = new Date();
    const formattedDate = date.toISOString();
    let commentData = {
      ...formData,
      timestamp: formattedDate,
      user_id: cookie.get("user_id"),
    };
    if (formData.text.includes("<script>") || formData.text.includes("<div>")) {
      setAlert({
        status: true,
        type: "error",
        message: "You cannot use <script> or html  tags",
      });
      setTimeout(() => {
        setAlert({ status: false });
      }, 3000);
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .update({ comments: [...comments, commentData] })
      .eq("id", post_id);

    if (error) {
      console.error(error, data);
    }
    setFormData({ text: "" });
    getPost();
  };

  return (
    <>
      <div className="container my-2 py-1 px-0 mx-0 text-dark">
        <div className="card add-comment border-0">
          <div className="card-body ">
            <div className="d-flex  flex-start w-100">
              <img
                className="rounded-circle mt-3 shadow-1-strong me-3"
                src={userProfile}
                alt="avatar"
                width="35"
                height="35"
              />
              <form className="w-100" onSubmit={handleSubmit}>
                <small className="text">Add a comment</small>

                <div className="form-outline">
                  <textarea
                    className="form-control input"
                    id="textAreaExample"
                    rows="1"
                    onChange={handleInputChange}
                    name="text"
                    value={formData.text}
                  ></textarea>
                  {alert.status && (
                    <small className="text-warning">
                      cannot use script tags in comments
                    </small>
                  )}
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-warning">
                    Send <BsFillSendFill />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Comment({ text, user_id, created_at }) {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    async function getUser() {
      let { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", user_id);
      if (error) {
        return;
      } else {
        setUser(user[0]);
      }
    }
    getUser();
  }, [user_id]);

  return (
    <div className="card my-2 comment text-light">
      <div className="card-body">
        <pre className="comment-text">{text}</pre>

        <div className="d-flex justify-content-between">
          {user && (
            <div className="d-flex small text-muted flex-row align-items-center">
              <img src={user.profile} alt="avatar" width="20" height="20" />
              <p className="small mb-0 ms-2">
                {user ? user.name : "anonymous"}
              </p>
            </div>
          )}
          <div className="d-flex flex-row align-items-center">
            <p className="small text-muted mb-0">{timeDiff(created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Post({
  setShowComments,
  postID,
  userProfile,
  userData,
}) {
  const [post, setPost] = useState(false);
  const [comments, setComments] = useState([]);
  // fetch post

  const cookies = new Cookies();
  async function getPost() {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", parseInt(postID));
    if (posts) {
      let thePost = posts[0];
      if (!thePost.comments || thePost.comments === []) {
        setComments([]);
      } else {
        thePost.comments = thePost.comments.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      }

      setPost(thePost);
    } else {
      console.error(error);
    }
  }

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    if (!post && comments) return;
    setComments(post.comments);
  }, [post, comments]);

  return (
    <div className="post-bg">
      <div className="post-container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid ">
            <div className="navbar-brand center-flex">
              <div
                className="text back-btn"
                onClick={() => {
                  setShowComments({ status: false, id: "" });
                }}
              >
                <BsArrowLeft />
              </div>
              <span className="mx-4 text-muted ">POST</span>
            </div>
          </div>
        </nav>
        <div className="px-2">
          {post ? (
            <>
              <Tweet
                userData={userData}
                post={post}
                loggedIn={false}
                key={post.id}
              />

              <div className="conatiner ">
                <div className="row d-flex justify-content-center ">
                  <div className="col-md-12 col-lg-12">
                    <div className="card shadow-0 border-0  comments">
                      <div className="card-body p-4">
                        <h3 className="text mb-4">
                          comments ({comments && comments.length})
                        </h3>

                        <AddComment
                          post_id={postID}
                          comments={comments}
                          userProfile={userProfile}
                          getPost={getPost}
                        />

                        {comments === [] ||
                        !comments ||
                        comments.length <= 0 ? (
                          <p className="text-muted text-center text-uppercase py-5">
                            No comments yet, be the first to comment
                          </p>
                        ) : (
                          comments.map((comment) => {
                            return (
                              <Comment
                                key={comment.timestamp}
                                text={comment.text}
                                user_id={comment.user_id}
                                created_at={comment.timestamp}
                              />
                            );
                          })
                        )}
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
