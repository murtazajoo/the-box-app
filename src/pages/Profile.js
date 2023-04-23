import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Tweet from "../components/Tweet";

export default function Profile({
  userData,
  supabase,
  setShowComments,
  setUserData,
}) {
  const [posts, setPosts] = useState(null);
  const [saved, setSaved] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setShowSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function getPosts() {
      let { data: userPosts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userData.user_id)
        .order("created_at", { ascending: false });
      if (userPosts) {
        setPosts(userPosts);
      } else {
        console.error(error);
      }
      console.log(userPosts, "user");
    }
    async function getSaved() {
      let saved = userData.saved;
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
      async function getuser() {
        let { data: users } = await supabase
          .from("user")
          .select("*")
          .eq("user_id", userData.user_id);
        setUserData(users[0]);
      }

      await getuser();
      if (showSaved) {
        await getSaved();
      } else {
        await getPosts();
      }
    };
    f();
  }, [showSaved]);

  let { name, username, profile } = userData;
  return (
    <>
      <Navbar active="profile" loggedIn={true} />
      {userData && (
        <div className="container mt-5 mx-auto mx-1 w-100">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-6">
              <div className="d-flex  justify-content-center-align-items-center">
                <img className="rounded-pill" src={profile} alt="profile" />
                <div className="mx-3">
                  <h4 className="m-0">{name}</h4>
                  <small>@{username}</small>
                </div>
              </div>
              <p className="bio text-muted my-4">
                <small>bio</small> <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptate, quia, voluptas quas voluptates
                quibusdam
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <div>
                <div className="d-flex justify-content-start align-items-center">
                  <button
                    onClick={() => {
                      setShowSaved(false);
                    }}
                    className={`btn rounded-0 ${!showSaved && "btn-dark"}`}
                  >
                    Tweets
                  </button>
                  <button
                    onClick={() => {
                      setShowSaved(true);
                    }}
                    className={`btn rounded-0 ${showSaved && "btn-dark"}`}
                  >
                    Saved
                  </button>
                </div>

                <div>
                  {posts && userData ? (
                    posts && posts.length > 0 ? (
                      posts.map((post) => {
                        return (
                          <Tweet
                            supabase={supabase}
                            post={post}
                            userData={userData}
                            loggedIn={true}
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
