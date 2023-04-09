import "./App.css";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./components/Register";
import Post, { loader } from "./components/Post";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Register />,
  },
  {
    path: "post/:postID",
    element: <Post />,
    loader: loader,
  },
]);
function App() {
  return (
    <>
      {/* <Navbar /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
