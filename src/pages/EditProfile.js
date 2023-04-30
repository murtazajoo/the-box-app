import React, { useEffect, useState } from "react";
import supabase from "../assets/supabase";
import { useFormik } from "formik";
import validate from "../assets/validate";
import "../css/profile.css";
import { NavLink } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { toast } from "react-toastify";

export default function EditProfile({ userData }) {
  const [user, setUser] = useState(userData);
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }
  useEffect(() => {
    getUser();
  }, []);
  const navigate = () => {
    window.history.back();
  };

  const formik = useFormik({
    initialValues: {
      username: "thissaddhsahdf",
      name: user.user_metadata.name,
      email: "thisafakeemail@gmail.com",
      bio: user.user_metadata.bio,
      password: "this is a fake password @ ",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            name: values.name,
            bio: values.bio,
          },
        });
        if (error) {
          throw error;
        } else {
          const { data, usererror } = await supabase
            .from("user")
            .update({
              name: values.name,
              bio: values.bio,
            })
            .eq("user_id", user.id);
          if (usererror) {
            toast.error(usererror.message, {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 2000,
            });
          } else {
            toast.success("Profile updated successfully", {
              position: toast.POSITION.TOP_LEFT,
            });
            getUser();
            navigate();
          }
        }
      } catch (error) {
        toast.error(error.message, {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 2000,
        });
      }
    },
  });

  return (
    <>
      {user && (
        <div
          style={{ maxWidth: "600px" }}
          className="container bg-text edit-form p-5 m-auto text "
        >
          {" "}
          <NavLink
            to="/profile/me"
            className=" mb-4 text-info  btn  rounded"
            type="submit"
          >
            <BsArrowLeftShort /> go back
          </NavLink>
          <h1>Edit Profile</h1>
          <p className="text-muted">
            change only the fields you want to update
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group my-3">
              <label htmlFor="username" className="text-muted">
                Username
              </label>
              <input
                disabled
                type="text"
                className="form-control text-muted border-secondary  disabled   rounded-0"
                id="username"
                name="username"
                defaultValue={user.user_metadata.username}
              />
              <small className="text-muted sm">can't change this field</small>
              {formik.errors.username ? (
                <div className="form-invalid"> {formik.errors.username}</div>
              ) : null}
            </div>
            <div className="form-group my-3">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                className="form-control  rounded-0"
                id="name"
                defaultValue={user.user_metadata.name}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name ? (
                <div className="form-invalid"> {formik.errors.name}</div>
              ) : null}
            </div>

            <div className="form-group my-3">
              <label htmlFor="exampleInputEmail1" className="text-muted">
                Email address
              </label>
              <input
                type="email"
                className="form-control text-muted border-secondary   rounded-0"
                id="exampleInputEmail1"
                defaultValue={user.email}
              />
              <small className="text-muted sm">can't change this field</small>

              {formik.errors.email ? (
                <div className="form-invalid"> {formik.errors.email}</div>
              ) : null}
            </div>

            <div className="form-group my-3">
              <label htmlFor="exampleInputEmail1">bio</label>
              <textarea
                type="text"
                className="form-control bg-text text rounded-0"
                id="exampleInputEmail1"
                name="bio"
                rows={3}
                defaultValue={user.user_metadata.bio}
                onChange={formik.handleChange}
                value={formik.values.bio}
              ></textarea>
              {formik.errors.bio ? (
                <div className="form-invalid"> {formik.errors.password}</div>
              ) : null}
            </div>

            <button className="btn-success btn rounded" type="submit">
              Save
            </button>
            <NavLink
              to="/profile/me"
              className="btn-outline-danger  mx-3 btn sm btn-sm rounded"
              type="submit"
            >
              Cancel
            </NavLink>
          </form>
        </div>
      )}
    </>
  );
}
