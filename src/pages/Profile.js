import React, { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import { NavLink, useParams } from "react-router-dom";

export default function Profile({
  supabase,
  setShowComments,
  userData,
  setScrollPosition,
}) {
  let { username } = useParams();

  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

  const [posts, setPosts] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    async function getUser(
      u = username === "me" ? userData.username : username
    ) {
      let { data: users, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", u);

      if (error) {
        console.log(error);
      } else {
        setUser(users[0]);
      }
    }

    async function getPosts() {
      let { data: userPosts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("username", username === "me" ? userData.username : username)
        .order("created_at", { ascending: false });
      if (userPosts) {
        setPosts(userPosts);
      } else {
        console.error(error);
      }
      console.log(userPosts, "user");
    }
    async function getSaved() {
      await getUser();
      let saved = user.saved;
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
      console.log(savedPosts, "saved");
    }

    const f = async () => {
      setPosts(null);
      if (!user) await getUser();
      showSaved ? await getSaved() : await getPosts();
    };
    if (username && userData) {
      if (username === "me" || username === userData.username) {
        setAdmin(true);
      } else {
        setAdmin(false);
        setShowSaved(false);
      }
      f();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSaved, username]);

  return (
    <>
      {user && userData && (
        <div className="container text mt-5 mx-auto mx-1 w-100">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-6">
              {admin && (
                <NavLink to="/profile/edit">
                  <button className="btn my-3 btn-outline-primary rounded-pill">
                    Edit Profile
                  </button>
                </NavLink>
              )}
              <div className="d-flex  justify-content-center-align-items-center">
                <img
                  className="rounded-pill"
                  src={user.profile}
                  alt="profile"
                />
                <div className="mx-3">
                  <h4 className="m-0">{user.name}</h4>
                  <small>@{user.username}</small>
                </div>
              </div>
              <p className="bio text-muted my-4">
                <small>bio</small> <br />
                {user.bio}
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
                    Drops
                  </button>
                  {admin && (
                    <button
                      onClick={() => {
                        setShowSaved(true);
                      }}
                      className={`btn text rounded-0 ${showSaved && "bg-text"}`}
                    >
                      Saved
                    </button>
                  )}
                </div>

                <div>
                  {posts && user ? (
                    posts && posts.length > 0 ? (
                      posts.map((post) => {
                        return (
                          <Tweet
                            supabase={supabase}
                            post={post}
                            user={user}
                            loggedIn={true}
                            setScrollPosition={setScrollPosition}
                            key={post.id}
                            setShowComments={setShowComments}
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
