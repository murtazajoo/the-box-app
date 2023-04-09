import React, { useEffect, useState } from "react";
import AddTweet from "../components/AddTweet";
import ProfileCard from "../components/ProfileCard";
import Trending from "../components/Trending";
import Tweet from "../components/Tweet";
import "../css/home.css";
import LoginCard from "../components/LoginCard";
import Navbar from "../components/Navbar";
import Cookies from "universal-cookie";
import { createClient } from "@supabase/supabase-js";
import Post from "../components/Post";

export default function Home() {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const [posts, setPosts] = useState([]);
  const [cookie, setCookie] = useState({});
  const [loggenIn, setLoggenIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showComments, setShowComments] = useState({ status: false, id: 0 });
  const cookies = new Cookies();

  async function getPosts() {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (posts) {
      setPosts(posts);
      return;
    } else {
      console.error(error);
    }
  }
  useEffect(() => {
    setCookie({
      user_id: cookies.get("user_id"),
      access_token: cookies.get("access_token"),
    });
    getPosts();
  }, []);

  useEffect(() => {
    if (cookie.user_id && cookie.access_token) {
      setLoggenIn(true);
    }
  }, [cookie, loggenIn]);

  useEffect(() => {
    async function getUser(id) {
      let { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", id);

      if (user) {
        setUserData(user[0]);
        setLoggenIn(true);
        return;
      } else {
        setLoggenIn(false);
      }
    }
    if (loggenIn) {
      getUser(cookie.user_id);
    }
  }, [loggenIn]);

  useEffect(() => {
    if (showComments.status) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showComments]);
  return (
    <>
      <Navbar />
      <main>
        <div className="profile-holder">
          {loggenIn && userData ? (
            <ProfileCard
              name={userData.name}
              username={userData.username}
              profile={userData.profile}
              followers={userData.followers.length}
              following={userData.following.length}
            />
          ) : (
            <LoginCard />
          )}
        </div>
        <div className="main-holder">
          {loggenIn && userData && (
            <AddTweet user={userData} getPosts={getPosts} />
          )}

          {posts.map((post) => {
            return (
              <Tweet
                user_id={cookie.user_id}
                loggedIn={loggenIn}
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
                setShowComments={setShowComments}
              />
            );
          })}
        </div>
        <div className="trending-holder">
          <Trending />
        </div>
        {showComments.status && (
          <Post setShowComments={setShowComments} postID={showComments.id} />
        )}
      </main>
    </>
  );
}
