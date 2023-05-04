import React from "react";
import {
  BsArrowLeftShort,
  BsArrowRightCircleFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import validate from "../assets/register_validate";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Register({ setLoggedIn }) {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

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
        const toastId = toast.loading("Registering you...");
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
              bio: userinfo.bio.trim(),
              saved: [],
            },
          },
        });
        toast.update(toastId, {
          render: "Registered successfully",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        if (data) {
          let user = {
            ...data.user.user_metadata,
            user_id: data.user.id,
          };

          const { user_data, user_error } = await supabase
            .from("user")
            .insert([user]);
          setLoggedIn(true);
          if (user_error && !user_data) {
            toast.update(toastId, {
              render: user_error.message,
              type: "error",
              isLoading: false,
              autoClose: 2000,
            });
            return;
          }
          navigate("../");
        }
        if (error || err) {
          toast.update(toastId, {
            render: error.message || err.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.log(error);
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

          <p className="text-center h4 mb-4">Register </p>

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
              style={{ textTransform: "lowercase" }}
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
          <p className="text-center d-flex justify-content-center align-items-center">
            <h4 className="logo" style={{ fontSize: "17vw" }}>
              MORA
            </h4>{" "}
          </p>
        </div>
      </div>
    </>
  );
}
