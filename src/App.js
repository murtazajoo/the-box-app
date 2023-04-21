import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { createClient } from "@supabase/supabase-js";
import Post from "./components/Post";
import Navbar from "./components/Navbar";

function App() {
  // supabase client
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showComments, setShowComments] = useState({ status: false, id: 0 });
  const [yscroll, setYscroll] = useState(window.scrollY);

  const cookies = new Cookies();

  // an function which gets user data from supabase and sets it to state  also sets loggedIn state
  async function getUser() {
    let { data: user } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", cookies.get("user_id"));

    if (user) {
      setUserData(user[0]);
      return;
    } else {
      setLoggedIn(false);
    }
  }

  // checks if user is logged in on page load and invokes getUser function
  useEffect(() => {
    if (cookies.get("user_id")) {
      setLoggedIn(true);
      getUser();
    } else {
      setLoggedIn(false);
    }
  }, []);

  // if user logs in it will invoke getUser function
  useEffect(() => {
    if (loggedIn) {
      getUser();
    }
  }, [loggedIn]);

  // if user clicks back button of the browser on comments page it will close the comments
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

  // it will stop scrolling when comments are open
  useEffect(() => {
    if (showComments.status) {
      setYscroll(window.scrollY);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showComments]);

  // console.log(loggedIn, userData);
  useEffect(() => {
    console.log(loggedIn, userData);
  }, [loggedIn, userData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              userData={userData}
              loggedIn={loggedIn}
              supabase={supabase}
              setShowComments={setShowComments}
            />
          }
        />
        <Route path="login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="signup" element={<Register />} />
      </Routes>

      {showComments.status && (
        <Post
          setShowComments={setShowComments}
          userProfile={userData.profile}
          postID={showComments.id}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
