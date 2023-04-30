import React, { useState } from "react";
import "../css/login.css";
import { Link } from "react-router-dom";
import {
  BsArrowLeftShort,
  BsFillArrowRightCircleFill,
  BsFillBookmarkPlusFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { createClient } from "@supabase/supabase-js";
import "bootstrap";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({ setLoggedIn }) {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );
  const [alert, setAlert] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    } else {
      setAlert(false);
      const cookies = new Cookies();
      cookies.set("user_id", data.user.id, { path: "/" });
      cookies.set("access_token", data.session.access_token, { path: "/" });
      setLoggedIn(true);
      toast.success("Login Successful", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("../");
    }
  };
  return (
    <div className="login-form ">
      <form className="m-auto position-relative  p-5" onSubmit={handleSubmit}>
        <Link to="/" className="btn center-flex  position-absolute  back-btn">
          <BsArrowLeftShort /> Go Back
        </Link>

        <p className="text-center h1 mb-4">Login</p>
        <p className="text-center d-flex justify-content-center align-items-center">
          <BsFillBookmarkPlusFill class="text-info" size={30} />
          <h4 className="logo">MORA</h4>{" "}
        </p>
        {alert && (
          <div
            class="alert text-danger center-flex  text-center w-100 p-0 m-0 mb-2 bg-none "
            role="alert"
          >
            <BsFillExclamationTriangleFill /> Invalid Login Credentials
          </div>
        )}
        <div class="mb-3">
          <label htmlFor="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            class="form-control py-2 h2"
            id="exampleInputEmail1"
            placeholder="example@mail.com"
            aria-describedby="emailHelp"
            required
          />
          <div id="emailHelp" class="form-text">
            {/* We'll never share your email with anyone else. */}
          </div>
        </div>
        <div class="mb-3">
          <label htmlFor="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            class="form-control py-2 h2"
            id="exampleInputPassword1"
            placeholder="**********"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary ">
          Login <BsFillArrowRightCircleFill />
        </button>
        <small className="text-muted d-block  py-3 m-auto text-center w-100">
          <Link
            to="/forgot-password"
            className="text-primary text-decoration-none  "
          >
            forgot password?
          </Link>
        </small>
        <div className="border-bottom border-secondary my-3 w-25 m-auto"></div>
        <p className="text-muted  py-3 m-auto w-100 text-center">
          don't have an account?{" "}
          <Link to="../signup" className="text-primary text-decoration-none">
            Signup
          </Link>
        </p>
      </form>
      <div className="img w-50">
        <img
          src="https://source.unsplash.com/random/1920x1080/?wallpaper,landscape,sky"
          alt=""
          className="img-fluid"
        />
      </div>
    </div>
  );
}
