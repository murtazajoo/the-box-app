import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import LikedUser from "./LikedUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Likes({ id, setShowLikes }) {
  const [post, setPost] = useState(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
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
    if (!id) return;
    getPost();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="post-bg">
      <div className="post-container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid ">
            <div className="navbar-brand center-flex">
              <div
                className="text back-btn"
                onClick={() => {
                  setShowLikes(false);
                }}
              >
                <BsArrowLeft />
              </div>
              <span className="mx-4 text-muted ">Likes</span>
            </div>
          </div>
        </nav>
        <div className="p-2">
          <div className="container">
            {post && post.liked_by.length > 0 ? (
              <>
                <h3 className="text opacity-75 m-3">liked By</h3>
                {post.liked_by.map((user_id) => {
                  return <LikedUser key={user_id} user_id={user_id} />;
                })}
              </>
            ) : post && post.liked_by.length === 0 ? (
              <h3 className="text my-5 text-center opacity-75 m-3">
                No likes yet
              </h3>
            ) : (
              <h6 className="text-muted my-5 text-center opacity-75 m-3">
                loading...
              </h6>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
