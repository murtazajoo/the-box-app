import "./App.css";
import "./index.css";
import "./css/home.css";
import "./css/login.css";
import "./css/profile.css";
import "./css/post.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Loader from "./pages/Loader";
import Animate from "./components/Animate";

const EditProfile = lazy(() => import("./pages/EditProfile"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

export default function App() {
  const supabase = useSupabaseClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // this function will be used to get total number of posts
    async function getTotalPosts() {
      let { count, error } = await supabase
        .from("posts")
        .select("*", { count: "estimated" });
      if (error) {
        toast.error(error.message);
      } else {
        setTotalPosts(count);
      }
    }
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setLoggedIn(true);
        setUser(user);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    }

    checkUser();
    if (totalPosts && totalPosts > 0) return;
    getTotalPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loggedIn) {
      updateUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  // this function will be used to update user when needed
  async function updateUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  async function getMorePosts() {
    let { data: newPosts, error } = await supabase
      .from("posts")
      .select("*")
      .range(
        posts && posts.length >= 0 ? posts.length : 0,
        posts && posts.length >= 0 ? posts.length + 9 : 9
      )
      .order("id", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      if (posts === []) {
        setPosts([...newPosts]);
      } else {
        setPosts([...posts, ...newPosts]);
      }
    }
  }

  useEffect(() => {
    if (scrollPosition === 0 && posts.length === 0) {
      getMorePosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  // this function will be used to add new post
  async function addPost(post) {
    const toastId = toast.loading("Adding post...");
    const { data, error } = await supabase
      .from("posts")
      .insert([post])
      .select();
    if (error) {
      toast.update(toastId, {
        render: error.message,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 2000,
      });
    } else {
      setPosts([data[0], ...posts]);
      toast.update(toastId, {
        render: "Post added",
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 1000,
      });
    }
  }

  // this function will be used to delete post only if the user is the owner of the post
  async function deletePost(id) {
    const toastId = toast.loading("Deleting post...");
    const { data, error } = await supabase.from("posts").delete().match({ id });
    if (error) {
      toast.update(toastId, {
        render: error.message,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 2000,
      });
    } else {
      setPosts(posts.filter((post) => post.id !== id));
      toast.update(toastId, {
        render: "Post deleted",
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 1000,
      });
    }
    return data;
  }

  // this function will be used to update post only if the user is the owner of the post
  // async function updatePost(id, updates) {
  //   const { data, error } = await supabase
  //     .from("posts")
  //     .update(updates)
  //     .match({ id });
  //   if (error) {
  //     toast.error(error.message);
  //   } else {
  //     setPosts(posts.map((post) => (post.id === id ? data[0] : post)));
  //     toast.success("Post updated");
  //   }
  //   return data;
  // }

  return (
    <>
      <BrowserRouter>
        <Navbar loggedIn={loggedIn} />
        <Routes>
          <Route element={<Animate />}>
            <Route
              path="/"
              element={
                posts.length > 0 ? (
                  <Home
                    user={user}
                    loggedIn={loggedIn}
                    updateUser={updateUser}
                    posts={posts}
                    totalPosts={totalPosts}
                    addPost={addPost}
                    scrollPosition={scrollPosition}
                    setScrollPosition={setScrollPosition}
                    getMorePosts={getMorePosts}
                    deletePost={deletePost}
                  />
                ) : (
                  <Loader />
                )
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<Loader />}>
                  <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                </Suspense>
              }
            />
            <Route
              path="/register"
              element={
                <Suspense fallback={<Loader />}>
                  <Register setLoggedIn={setLoggedIn} />
                </Suspense>
              }
            />
            {loggedIn && (
              <Route path="/profile/*">
                <Route
                  path=":username"
                  element={
                    <Profile
                      updateUser={updateUser}
                      deletePost={deletePost}
                      user={user}
                    />
                  }
                />
                <Route
                  path="edit"
                  element={
                    <Suspense fallback={<Loader />}>
                      <EditProfile user={user} updateUser={updateUser} />
                    </Suspense>
                  }
                />
              </Route>
            )}
            <Route
              path="*"
              element={
                <Suspense fallback={<Loader />}>
                  <NotFound />
                </Suspense>
              }
            />
            <Route
              path="/password-reset"
              element={
                <Suspense fallback={<Loader />}>
                  <PasswordReset />
                </Suspense>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Suspense fallback={<Loader />}>
                  <ForgotPassword />
                </Suspense>
              }
            />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={1500} />
      </BrowserRouter>
    </>
  );
}
