import React, { useEffect, useState } from "react";
import AddTweet from "../components/AddTweet";
import ProfileCard from "../components/ProfileCard";
import Trending from "../components/Trending";
import Tweet from "../components/Tweet";
import "../css/home.css";
import LoginCard from "../components/LoginCard";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsFillBookmarkCheckFill } from "react-icons/bs";

export default function Home({
  loggedIn,
  userData,
  supabase,
  setShowComments,
}) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const cookies = new Cookies();

  // gets posts from supabase and sets it to state
  async function getPosts(added) {
    let from = added ? 0 : posts.length;
    let { data: newPosts, error } = await supabase
      .from("posts")
      .select("*")
      .range(from, from + 9)
      .order("created_at", { ascending: false });

    if (newPosts) {
      if (added) {
        setPosts(newPosts);
      } else {
        setPosts([...posts, ...newPosts]);
      }
      if (posts.length % 10 !== 0) setHasMore(false);
      return;
    } else {
      console.error(error);
    }
  }
  // runs getPosts on page load
  useEffect(() => {
    getPosts();
    return () => {
      setPosts([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this is for the loader
  const [loading, setloading] = useState(true);
  useEffect(() => {
    if (posts.length > 0) {
      setloading(false);
    }
  }, [posts]);

  return (
    <>
      {loading && (
        <div className="loader">
          <div className="spinner-border  text-primary " role="status"></div>{" "}
        </div>
      )}

      <Navbar active={"home"} loggedIn={loggedIn} />

      <main>
        {/* if logged in show profile card else show login card*/}
        <div className="profile-holder">
          {loggedIn && userData ? (
            <ProfileCard userData={userData} />
          ) : (
            <LoginCard />
          )}
        </div>

        <div className="main-holder">
          {loggedIn && userData && (
            <AddTweet
              supabase={supabase}
              user={userData}
              getPosts={getPosts}
              setPosts={setPosts}
            />
          )}

          <InfiniteScroll
            dataLength={posts.length}
            next={getPosts}
            hasMore={hasMore}
            loader={
              <div className="m-auto mt-5 text-center">
                <div className="spinner-border text-primary " role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            }
            endMessage={
              <div className="text-center">
                <p>
                  {" "}
                  <BsFillBookmarkCheckFill size={40} className="text-success" />
                </p>
                <p className="text-success">Yay, You have seen it all</p>
              </div>
            }
          >
            {posts.map((post) => {
              return (
                <Tweet
                  supabase={supabase}
                  post={post}
                  user_id={cookies.get("user_id")}
                  saved={userData ? userData.saved : []}
                  loggedIn={loggedIn}
                  key={post.id}
                  setShowComments={setShowComments}
                />
              );
            })}
          </InfiniteScroll>
        </div>
        <div className="trending-holder">
          <Trending />
        </div>
      </main>
    </>
  );
}
