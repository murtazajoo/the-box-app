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
import InfiniteScroll from 'react-infinite-scroll-component';
import { BsFillBookmarkCheckFill } from "react-icons/bs";

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
 const [scrollCount, setScrollCount] = useState(0);
 const [hasMore, setHasMore] = useState(true);
  const cookies = new Cookies();

  async function getPosts(added) {
    // let { data: posts, error } = await supabase
    //   .from("posts")
    //   .select("*")
    //   .order("created_at", { ascending: false });
    // if (posts) {
    //   setPosts(posts);
    //   return;
    // } else {
    //   console.error(error);
    // }
    let from

if(added){
from = 0 
}else{
  from = posts.length
}

// getPosts()
// return}
    
let { data: newPosts, error } = await supabase
.from('posts')
.select('*')
.range(from===0?0:from+1, from===0 ? 9 : from + 10 )
.order("created_at", { ascending: false });


if (newPosts) {
  if(added){
    setPosts(newPosts)
  }else{
    setPosts(  posts.concat(newPosts));
  }
  if(posts.length % 10 !== 0) {setHasMore(false)}
console.log(posts)

  return;
    } 
    else {
      console.error(error);
    }
 }



  useEffect(() => {
    setCookie({
      user_id: cookies.get("user_id"),
      access_token: cookies.get("access_token"),
    });
    getPosts(0);
  }, []);

  useEffect(() => {
    if (cookie.user_id && cookie.access_token) {
      setLoggenIn(true);
    }
  }, [cookie, loggenIn]);

  useEffect(() => {
    async function getUser(id) {
      let { data: user} = await supabase
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

  const [yscroll, setYscroll] = useState(window.scrollY);

  useEffect(() => {
    function disableScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          window.onscroll = function() {
              window.scrollTo(scrollLeft, scrollTop);
          };
  }
    
  function enableScroll() {
      window.onscroll = function() {};
  }
    if (showComments.status) {
      setYscroll(window.scrollY)
      // document.body.style.height = "100vh";
      disableScroll()
    } else {
      // document.body.style.height = "auto";
      enableScroll()
    }
  }, [showComments]);


  useEffect(() => {
    function onBackButtonEvent(e) {
      e.preventDefault();
      setShowComments({ status: false, id: 0 });
      window.history.pushState(null, null, window.location.pathname);
      window.scrollTo(0, yscroll);
    }
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent, false);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, [yscroll]);

const [loading, setloading] = useState(true);
 useEffect(() => {
    if(posts.length > 0){
      setloading(false)
    }
 }, [posts]);
  return (
    <>
    {loading && <div className="loader"><div className="spinner-border  text-primary " role="status"></div> </div>}
      <Navbar active={"home"} loggedIn={loggenIn} />
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
            <AddTweet user={userData} getPosts={getPosts} setPosts={setPosts} />
          )}
<InfiniteScroll
          dataLength={posts.length}
          next={getPosts}
          hasMore={posts.length % 10 === 0}
          loader={<div className="m-auto mt-5 text-center">
          <div className="spinner-border text-primary " role="status">
          <span className="visually-hidden">Loading...</span>
        </div></div>}
          endMessage={
            <div className="text-center">
              <p> <BsFillBookmarkCheckFill size={40} className="text-success"/></p>
              <p className="text-success">Yay, You have seen it all</p>
            </div>
          }
        >
          {posts.map((post) => {
            return (
              <Tweet
                user_id={cookie.user_id}
                saved={userData ? userData.saved : []}
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
          </InfiniteScroll>

        </div>
        <div className="trending-holder" onClick={()=>{
          getPosts(scrollCount)
        }}>
          <Trending />
        </div>
        {showComments.status && (
          <Post
            setShowComments={setShowComments}
            userProfile={userData.profile}
            postID={showComments.id}
          />
        )}
      </main>
    </>
  );
}
