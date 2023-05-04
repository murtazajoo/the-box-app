import React, { useState } from "react";
import { BsBoxArrowInDown } from "react-icons/bs";

export default function AddPost({ user, addPost }) {
  const [postText, setPostText] = useState("");
  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postText === "") return;
    let postData = {
      text: postText,
      user_id: user.id,
      name: user.user_metadata.name,
      username: user.user_metadata.username,
    };
    addPost(postData);
    setPostText("");
  };

  return (
    <form className="add-tweet-holder mb-3" onSubmit={handleSubmit}>
      <img
        className="rounded-pill border border-2 border-primary"
        src={user.user_metadata.profile}
        alt="your-profile"
        width={50}
        height={50}
      />
      <div>
        <textarea
          rows={2}
          maxLength={280}
          type="text"
          onChange={handleInputChange}
          name="text"
          value={postText}
          placeholder="What's happening?"
        />
        <div className="add-tweet-icons">
          <div className="  border-0 text-end mt-3 w-100 d-flex justify-content-end ">
            <button
              type="submit"
              className="btn btn-info text-uppercase center-flex"
            >
              <p className="mx-1 m-0 p-0">Drop</p>
              <BsBoxArrowInDown />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
