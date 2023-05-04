import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";

export default function AddComment({ getPost, post }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") return;
    let commentData = {
      text: comment,
      user_id: user.id,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("posts")
      .update({
        comments: [...post.comments, commentData],
      })
      .eq("id", post.id)
      .single();
    if (error) {
      console.log(error.message, data);
    } else {
      setComment("");
      getPost();
    }
  };

  return (
    <>
      <div className="container my-2 py-1 px-0 mx-0 text-dark">
        <div className="card add-comment border-0">
          <div className="card-body ">
            <div className="d-flex  flex-start w-100">
              <img
                className="rounded-circle mt-3 shadow-1-strong me-3"
                src={user.user_metadata.profile}
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
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    name="text"
                    value={comment}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-warning">
                    Comment <BsFillSendFill />
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

//   const date = new Date();
//   const formattedDate = date.toISOString();
//   let commentData = {
//     ...formData,
//     timestamp: formattedDate,
//     user_id: cookie.get("user_id"),
//   };
