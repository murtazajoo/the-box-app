import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Post from "./components/Post";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import AnimationLayout from "./components/AnimateRoute";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import EditProfile from "./pages/EditProfile";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

function App() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showComments, setShowComments] = useState({ status: false, id: 0 });
  //state which remembers croll position
  const [homeScrollPosition, setHomeScrollPosition] = useState(0);
  const [profileScrollPosition, setProfileScrollPosition] = useState(0);

  const [posts, setPosts] = useState([]);

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user, "fuser");

      // let { data: user } = await supabase
      //   .from("user")
      //   .select("*")
      //   .eq("user_id", cookies.get("user_id"));

      if (user) {
        setUserData(user.user_metadata);
        cookies.set("user_id", user.id, { path: "/" });
        return;
      } else {
        setLoggedIn(false);
      }
    }

    // if (loggedIn) {
    getUser();
    // }
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
      <Navbar loggedIn={loggedIn} />
      <Routes>
        <Route element={<AnimationLayout />}>
          <Route
            path="/"
            element={
              <Home
                userData={userData}
                loggedIn={loggedIn}
                supabase={supabase}
                posts={posts}
                setPosts={setPosts}
                setScrollPosition={setHomeScrollPosition}
                scrollPosition={homeScrollPosition}
                setShowComments={setShowComments}
              />
            }
          />
          <Route path="login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route
            path="signup"
            element={<Register setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}
          />
          {userData && (
            <Route path="profile/*" end>
              <Route
                path=":username"
                element={
                  <Profile
                    userData={userData}
                    supabase={supabase}
                    setUserData={setUserData}
                    setShowComments={setShowComments}
                    setScrollPosition={setProfileScrollPosition}
                    scrollPosition={profileScrollPosition}
                  />
                }
              />
              <Route path="edit" element={<EditProfile userData={user} />} />
            </Route>
          )}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<PasswordReset />} />

          <Route path="*" element={<Login setLoggedIn={setLoggedIn} />} />
        </Route>
      </Routes>

      {showComments.status && (
        <Post
          setShowComments={setShowComments}
          userProfile={userData.profile}
          postID={showComments.id}
          userData={userData}
        />
      )}

      {/* <Analytics /> */}
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
