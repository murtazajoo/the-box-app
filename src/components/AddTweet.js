import React, { useState } from "react";

import {
  // BsFillImageFill,
  // BsFillPlayFill,
  // BsFillCalendarFill,
  BsBoxArrowInDown,
} from "react-icons/bs";
import { createClient } from "@supabase/supabase-js";
import "bootstrap";

export default function AddTweet(props) {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );
  const [alert, setAlert] = useState({ status: false, message: "" });
  const [formData, setFormData] = useState({ text: "" });
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.text === "") return;
    let postData = {
      ...formData,
      user_id: props.user.user_id,
      name: props.user.name,
      profile: props.user.profile,

      username: props.user.username,
    };
    if (postData.text.includes("<script>") || postData.text.includes("<div>")) {
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
    const { data, error } = await supabase.from("posts").insert([postData]);

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
    props.getPosts();
  };

  return (
    <form className="add-tweet-holder" onSubmit={handleSubmit}>
      <img src={props.user.profile} alt="" />
      <div>
        {alert.status && (
          <div
            style={{ maxWidth: "300px" }}
            className={`alert alert-${
              alert.type === "error" ? "danger" : "success"
            } position-absolute top-0 mt-3 start-50  translate-middle-x alert-dismissible fade show`}
            role="alert"
          >
            {alert.message}
          </div>
        )}
        <textarea
          rows={2}
          type="text"
          onChange={handleInputChange}
          name="text"
          value={formData.text}
          placeholder="What's happening?"
        />
        <div className="add-tweet-icons">
          {/* <div className="add-tweet-icon">
            <BsFillImageFill color="pink" />
            <small>Photo</small>
          </div>
          <div className="add-tweet-icon">
            <BsFillPlayFill color="lightblue" />

            <small>Video</small>
          </div>{" "}
          <div className="add-tweet-icon">
            <BsFillCalendarFill color="lightgreen" />

            <small>Schedule</small>
          </div>{" "} */}
          <div className="  border-0 text-end mt-3 w-100 d-flex justify-content-end ">
            <button type="submit" className="btn btn-primary d-flex ">
              <BsBoxArrowInDown />
              <p className="mx-1 m-0 p-0">Drop</p>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
