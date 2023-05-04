import React, { useState } from "react";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { toast } from "react-toastify";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import Crop from "../components/profile/Crop";

export default function EditProfile({ updateUser, user }) {
  const supabase = useSupabaseClient();
  const [profile, setprofile] = useState(user.user_metadata.profile);
  const [file, setFile] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: user.user_metadata.name,
      bio: user.user_metadata.bio,
    },
    validate,
    onSubmit: async (values) => {
      const toastId = toast.loading("Updating profile...");
      try {
        let filePath;
        if (file) {
          toast.update(toastId, {
            type: "info",
            render: "Uploading profile picture...",
          });
          const { data, error } = await supabase.storage
            .from("profiles")
            .upload(`${user.id}/${uuidv4()}`, file);

          if (error) {
            throw error;
          }
          filePath = `https://xmeyiduceoxfvciwoajn.supabase.co/storage/v1/object/public/profiles/${data.path}`;
          toast.update(toastId, {
            type: "loading",
            render: "Updating profile...",
            isLoading: true,
          });
        }

        let toUpdate = {
          name: values.name,
          bio: values.bio,
          profile: filePath || profile,
        };

        const { error } = await supabase.auth.updateUser({
          data: toUpdate,
        });

        if (error) throw error;

        const { data, err } = await supabase
          .from("user")
          .update(toUpdate)
          .eq("user_id", user.id);

        if (err) throw err;

        updateUser();
        toast.update(toastId, {
          type: "success",
          render: "Profile updated!",
          isLoading: false,
          autoClose: 2000,
        });

        navigate("/profile/me");
      } catch (error) {
        toast.error(error.message, {
          autoClose: 2000,
        });
      }
    },
  });

  function updateProfilePreview(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
      setOpenCrop(true);
      // setFile(file);
      // const reader = new FileReader();
      // reader.onload = function (e) {
      //   setprofile(e.target.result);
      // };
      // reader.readAsDataURL(file);
    }
  }

  return (
    <>
      {openCrop && (
        <Crop
          setOpenCrop={setOpenCrop}
          photoUrl={photoUrl}
          setFile={setFile}
          setprofile={setprofile}
        />
      )}

      {user && !openCrop && (
        <div
          style={{ maxWidth: "600px" }}
          className="container bg-text edit-form p-5 m-auto text border border-2 rounded border-info "
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
          <hr />
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group center-flex my-3 d-flex justify-content-start ">
              <img
                src={profile}
                width={70}
                height={70}
                className="rounded-pill border border-info mx-3"
                style={{ transform: "scale(1.2)" }}
                alt=""
                onClick={() => setOpenCrop(true)}
              />
              <div>
                <input
                  type="file"
                  accept="image/jpeg , image/png"
                  className="form-control  form-control-sm text-muted border-0 d-block rounded-pill "
                  id="exampleInputEmail1"
                  onChange={(e) => updateProfilePreview(e)}
                  aria-describedby="profileHelp"
                />
              </div>
            </div>

            <div className="form-group my-3">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                className={`form-control bg-text text px-4 py-2 border border-2 rounded-pill ${
                  formik.errors.name ? "border-danger" : "border-success"
                }`}
                id="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name ? (
                <div className="form-invalid"> {formik.errors.name}</div>
              ) : null}
            </div>

            <div className="form-group my-3">
              <label htmlFor="exampleInputEmail1">bio</label>
              <textarea
                type="text"
                className={`form-control bg-text text px-4 py-2 border border-2 rounded ${
                  formik.errors.bio ? "border-danger" : "border-success"
                }`}
                id="exampleInputEmail1"
                name="bio"
                rows={3}
                // defaultValue={user.user_metadata.bio}
                onChange={formik.handleChange}
                value={formik.values.bio}
              ></textarea>
              {formik.errors.bio ? (
                <div className="form-invalid"> {formik.errors.bio}</div>
              ) : null}
            </div>

            <button
              className="btn-success btn rounded-pill border-warning px-4 py-2"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Save
            </button>
            <NavLink
              to="/profile/me"
              className="btn-outline-danger  mx-3 btn sm btn-sm rounded-pill"
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

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length < 3) {
    errors.name = "Must be 3 characters or more";
  } else if (values.name.length > 20) {
    errors.name = "Must be 20 characters or less";
  }

  if (!values.bio) {
    errors.bio = "Required";
  } else if (values.bio.length < 10) {
    errors.bio = "Must be 10 characters or more";
  } else if (values.bio.length > 100) {
    errors.bio = "Must be 100 characters or less";
  }

  return errors;
};
