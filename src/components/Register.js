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
import { toast } from "react-toastify";
import validate from "../assets/validate";

export default function Register(setLoggedIn) {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );
  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      bio: "Hey there! I am using Mora Social Media App",
    },
    validate,
    onSubmit: async (values) => {
      try {
        toast.info("Signing Up...", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        });
        let { err } = await supabase.auth.signOut();
        let userinfo = JSON.parse(JSON.stringify(values, null, 2));
        let { data, error } = await supabase.auth.signUp({
          email: userinfo.email,
          password: userinfo.password,
          options: {
            data: {
              username: userinfo.username.trim(),
              name: userinfo.name.trim(),
              profile:
                "https://ui-avatars.com/api/?name=" +
                userinfo.name +
                "&background=random",
              banner:
                "https://ui-avatars.com/api/?name=" +
                userinfo.name +
                "&background=random",
              bio: userinfo.bio,
              saved: [],
              followers: [],
              following: [],
            },
          },
        });

        if (data) {
          let user = {
            ...data.user.user_metadata,
            user_id: data.user.id,
            email: data.user.email,
          };

          const { userdata, usererror } = await supabase
            .from("user")
            .insert([user]);

          toast.success("Signed Up Successfully", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          });
          const cookies = new Cookies();
          cookies.set("user_id", data.user.id, { path: "/" });
          cookies.set("access_token", data.session.access_token, { path: "/" });
          //   // need to fix this
          window.location = "../";

          if (error || usererror) {
            toast.error("Something Went Wrong", {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 2000,
            });
            throw (err = error || usererror);
          }
        } else if (err) {
          toast.error("Make Sure You are logged Out Before trying to signup", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          });
          throw err;
        }
      } catch (err) {
        toast.error("Something Went Wrong", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        });
        console.log(err);
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
            <label htmlFor="username" class="form-label">
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
            <label htmlFor="name" class="form-label">
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
            <label htmlFor="exampleInputEmail1" class="form-label">
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
            <label htmlFor="exampleInputPassword1" class="form-label">
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
