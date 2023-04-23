import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { createClient } from "@supabase/supabase-js";
import Post from "./components/Post";
import Profile from "./pages/Profile";
import { Analytics } from "@vercel/analytics/react";
function App() {
  // supabase client
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showComments, setShowComments] = useState({ status: false, id: 0 });

  const cookies = new Cookies();

  // checks if user is logged in on page load and invokes getUser function
  useEffect(() => {
    if (cookies.get("user_id")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if user logs in it will invoke getUser function
  useEffect(() => {
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

    if (loggedIn) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  // it will stop scrolling when comments are open
  useEffect(() => {
    if (showComments.status) {
      document.body.style.overflow = "hidden";
      function onBackButtonEvent(e) {
        e.preventDefault();
        setShowComments({ status: false, id: 0 });
        window.history.pushState(null, null, window.location.pathname);
        window.scrollTo(0, window.scrollY);
      }
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", onBackButtonEvent, false);
      return () => {
        window.removeEventListener("popstate", onBackButtonEvent);
      };
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
        <Route path="signup" element={<Register setLoggedIn={setLoggedIn} />} />
        {userData && (
          <Route
            path="profile"
            element={
              <Profile
                userData={userData}
                supabase={supabase}
                setUserData={setUserData}
                setShowComments={setShowComments}
              />
            }
          />
        )}

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>

      {showComments.status && (
        <Post
          setShowComments={setShowComments}
          userProfile={userData.profile}
          postID={showComments.id}
          userData={userData}
        />
      )}

      <Analytics />
    </BrowserRouter>
  );
}

export default App;
