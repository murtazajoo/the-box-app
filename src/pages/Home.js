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

export default function Home() {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const [posts, setPosts] = useState([]);
  const [cookie, setCookie] = useState({});
  const [loggenIn, setLoggenIn] = useState(false);
  const [userData, setUserData] = useState({});
  const cookies = new Cookies();

  async function getPosts() {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (posts) {
      setPosts(posts);
      return;
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
    console.log(loggenIn);
  }, [cookie, loggenIn]);
  useEffect(() => {
    async function getUser(id) {
      let { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", id);

      if (user) {
        setUserData(user[0]);
        return;
      } else {
        console.log(error, "error on line 63 Home.js");
      }
    }
    if (loggenIn) {
      getUser(cookie.user_id);
    }
  }, [loggenIn]);

  return (
    <>
      <Navbar />
      <main>
        <div className="profile-holder">
          {loggenIn ? <ProfileCard /> : <LoginCard />}
        </div>
        <div className="main-holder">
          {loggenIn && <AddTweet user={userData} getPosts={getPosts} />}

          {posts.map((post) => {
            return (
              <Tweet
                user_id={cookie.user_id}
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
                comments={post.likes - 5}
              />
            );
          })}
        </div>
        <div className="trending-holder">
          <Trending />
        </div>
      </main>
    </>
  );
}
