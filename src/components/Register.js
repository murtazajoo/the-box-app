import React from "react";
import {
  BsArrowLeftShort,
  BsArrowRightCircleFill,
  BsFillBookmarkStarFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import { createClient } from "@supabase/supabase-js";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
// Create a single supabase client for interacting with your database

const validate = async (values) => {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const errors = {};

  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length > 15) {
    errors.username = "Must be 15 characters or less";
  } else {
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", values.username);
    if (user.length !== 0 && user[0].username === values.username) {
      errors.username = "username not avaiable";
    }

    if (error) {
      console.error(error);
    }
  }
  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 15) {
    errors.name = "Must be 15 characters or less";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  } else {
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", values.email);
    if (user.length !== 0 && user[0].email === values.email) {
      errors.email = "email not avaiable";
    }
    if (error) {
      console.error(error);
    }
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Must be at least 8 characters long";
  } else if (!/[!@#$%^&*]/.test(values.password)) {
    errors.password = "Must contain at least one special character (!@#$%^&*)";
  } else if (!/[a-zA-Z0-9]/.test(values.password)) {
    errors.password = "Must contain at least one alphanumeric character";
  }

  return errors;
};

export default function Register() {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      let userinfo = JSON.parse(JSON.stringify(values, null, 2));
      let { data, error } = await supabase.auth.signUp({
        email: userinfo.email,
        password: userinfo.password,
      });
      if (data) {
        userinfo["user_id"] = data.user.id;
        let name = userinfo.name;
        name.replace(" ", "+");
        userinfo["profile"] =
          "https://ui-avatars.com/api/?name=" + name + "&background=random";
        const { userdata, usererror } = await supabase
          .from("user")
          .insert([userinfo]);

        if (usererror) {
          console.log(usererror, userdata, "signup 74");
        }

        const cookies = new Cookies();
        cookies.set("user_id", userinfo["user_id"], { path: "/" });
        cookies.set("access_token", data.session.access_token, { path: "/" });
        console.log("redirecting......");
        navigate("../");
      } else {
        console.log(error, "signup 75");
      }
    },
  });
  return (
    <>
      <div className="signup-form ">
        <form
          className="m-auto position-relative  p-5 "
          onSubmit={formik.handleSubmit}
        >
          <Link
            to="/"
            className="btn center-flex  position-absolute   back-btn"
          >
            <BsArrowLeftShort /> Go Back
          </Link>

          <p className="text-center h1 mb-4">Register </p>
          <p className="text-center d-flex justify-content-center align-items-center">
            <BsFillBookmarkStarFill class="text-info" size={30} />
            <h4 className="logo">MORA</h4>{" "}
          </p>
          <div class="mb-3">
            <label for="username" class="form-label">
              Username
            </label>
            <input
              type="text"
              class="form-control"
              id="username"
              name="username"
              style={{ textTransform: "lowercase" }}
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username ? (
              <div className="form-invalid ">
                <BsFillExclamationTriangleFill /> {formik.errors.username}
              </div>
            ) : null}
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">
              Full Name
            </label>
            <input
              type="text"
              class="form-control"
              id="name"
              name="name"
              style={{ textTransform: "capitalize" }}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? (
              <div className="form-invalid">
                {" "}
                <BsFillExclamationTriangleFill />
                {formik.errors.name}
              </div>
            ) : null}
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email ? (
              <div className="form-invalid">
                {" "}
                <BsFillExclamationTriangleFill />
                {formik.errors.email}
              </div>
            ) : null}
            <div id="emailHelp" class="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? (
              <div className="form-invalid">
                {" "}
                <BsFillExclamationTriangleFill />
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <button type="submit" class="btn btn-primary ">
            Signup <BsArrowRightCircleFill />
          </button>

          <div className="border-bottom border-secondary my-3 w-25 m-auto"></div>
          <p className="text-muted   py-3 m-auto">
            Already have an account?{" "}
            <Link to="../login" className="text-primary">
              Login
            </Link>
          </p>
        </form>
        <div className="img w-50">
          <img
            src="https://source.unsplash.com/random/1920x1080/?wallpaper,landscape,sky"
            className="img-fluid"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
