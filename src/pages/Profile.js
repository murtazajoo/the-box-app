import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Post from "../components/post/Post";

export default function Profile({ updateUser, deletePost }) {
  const supabase = useSupabaseClient();
  let { username } = useParams();
  const [admin, setAdmin] = useState(false);
  const [dropsLength, setDropsLength] = useState(0);
  const [posts, setPosts] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [user, setUser] = useState(null);

  async function getUser() {
    if (username === "me") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } else {
      const { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", username)
        .single();
      if (user) {
        setUser({
          id: user.user_id,
          user_metadata: {
            username: user.username,
            name: user.name,
            profile: user.profile,
            bio: user.bio,
            saved: user.saved,
          },
        });
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (username) {
      if (username === "me" || user?.user_metadata?.username === username) {
        setAdmin(true);
        setShowSaved(false);
      } else {
        setAdmin(false);
        setShowSaved(false);
      }
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  async function getPosts() {
    setPosts(null);
    let { data: userPosts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (userPosts) {
      setPosts(userPosts);
      setDropsLength(userPosts.length);
    } else {
      console.error(error);
    }
  }
  useEffect(() => {
    async function getSaved() {
      // getUser();
      let saved = user.user_metadata.saved;
      let { data: savedPosts, error } = await supabase
        .from("posts")
        .select("*")
        .in("id", saved)
        .order("created_at", { ascending: false });

      if (savedPosts) {
        setPosts(savedPosts);
      } else {
        console.error(error);
      }
    }
    if (user) {
      setPosts(null);
      if (showSaved) {
        getSaved();
      } else {
        getPosts();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, showSaved]);

  useEffect(() => {
    if (showSaved) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSaved]);

  return (
    <>
      {user && (
        <div className="container text mt-5 mx-auto mx-1 w-100">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-6">
              {admin && (
                <NavLink to="/profile/edit">
                  <button className="btn mb-5 btn-outline-primary rounded-pill">
                    Edit Profile
                  </button>
                </NavLink>
              )}
              <div className="d-flex  justify-content-center-align-items-center">
                <img
                  className="rounded-pill border border-2 border-primary"
                  width="60"
                  height="60"
                  src={user.user_metadata.profile}
                  alt="profile"
                />
                <div className="mx-3">
                  <h4 className="m-0">{user.user_metadata.name}</h4>
                  <small>@{user.user_metadata.username}</small>
                </div>
              </div>
              <p className="bio text-muted my-4 w-100 text-break">
                <small>bio</small> <br />
                {user.user_metadata.bio}
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <div>
                <div className="d-flex mb-3 justify-content-start align-items-center">
                  <button
                    onClick={() => {
                      setShowSaved(false);
                    }}
                    className={`btn text rounded-0 ${!showSaved && "bg-text"}`}
                  >
                    Drops ({dropsLength})
                  </button>
                  {admin && user && (
                    <button
                      onClick={() => {
                        setShowSaved(true);
                      }}
                      className={`btn text rounded-0 ${showSaved && "bg-text"}`}
                    >
                      Saved ({user.user_metadata.saved.length})
                    </button>
                  )}
                </div>

                <div>
                  {posts && user ? (
                    posts && posts.length > 0 ? (
                      posts.map((post) => {
                        return (
                          <Post
                            key={post.id}
                            user={user}
                            post={post}
                            loggedIn={true}
                            updateUser={updateUser}
                            deletePost={deletePost}
                            getPosts={getPosts}
                            admin={showSaved ? false : admin}
                          />
                        );
                      })
                    ) : (
                      <div className="text-center mt-5">Empty</div>
                    )
                  ) : (
                    <div className="text-center mt-5">Loading...</div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="col-12 col-md-4 col-lg-3"></div> */}
          </div>
        </div>
      )}
    </>
  );
}
