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

function AddComment({ post_id, comments, getPost }) {
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
        message: "You cannot use script  tags",
      });
      setTimeout(() => {
        setAlert({ status: false });
      }, 2000);
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .update({ comments: [...comments, commentData] })
      .eq("id", post_id);

    if (error) {
      console.error(data, error);
      setAlert({
        status: true,
        type: "error",
        message: "An error occured while Posting, please refresh and try again",
      });
      setTimeout(() => {
        setAlert({ status: false });
      }, 2000);
    } else {
      setAlert({
        status: true,
        type: "success",
        message: "Post Uploaded Successfully",
      });
      setTimeout(() => {
        setAlert({ status: false });
      }, 2000);
    }
    setFormData({ text: "" });
    getPost();
  };

  return (
    <>
      <div className="container my-2 py-1 px-0 mx-0 text-dark">
        <div className="card add-comment">
          <div className="card-body ">
            <div className="d-flex  flex-start w-100">
              <img
                className="rounded-circle mt-3 shadow-1-strong me-3"
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                alt="avatar"
                width="35"
                height="35"
              />
              <form className="w-100" onSubmit={handleSubmit}>
                <small>Add a comment</small>

                <div className="form-outline">
                  <textarea
                    className="form-control text-light bg-secondary"
                    id="textAreaExample"
                    rows="1"
                    onChange={handleInputChange}
                    name="text"
                    value={formData.text}
                  ></textarea>
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
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="card my-2 comment text-light">
      <div className="card-body">
        <p>{text}</p>

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

export default function Post({ setShowComments, postID }) {
  const [post, setPost] = useState(null);
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
        setComments(null);
      } else {
        thePost.comments = thePost.comments.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      }

      setPost(thePost);
    } else {
      console.log(error);
    }
  }
  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    if (!post && comments) return;
    setComments(post.comments);
  }, [post]);

  return (
    <div className="post-container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid ">
          <div className="navbar-brand center-flex">
            <div
              className="text-light"
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
        {post && (
          <Tweet
            user_id={cookies.user_id}
            loggedIn={false}
            key={post.id}
            tweetId={post.id}
            liked_by={post.liked_by}
            name={post.name}
            username={post.username}
            profile={post.profile}
            time={post.created_at}
            text={post.text}
            // image={post.image}
            likes={post.likes}
            comments={post.comments.length}
          />
        )}

        <div className="conatiner ">
          <div className="row d-flex justify-content-center ">
            <div className="col-md-12 col-lg-12">
              <div className="card shadow-0  comments">
                <div className="card-body p-4">
                  <h3 className="text-light mb-4">
                    comments ({comments && comments.length})
                  </h3>

                  <AddComment
                    post_id={postID}
                    comments={comments}
                    getPost={getPost}
                  />

                  {comments ? (
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
                  ) : (
                    <>
                      <p className="text-light">
                        No comments yet, be the first to comment
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}