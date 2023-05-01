import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import validate from "../assets/validate";
import "../css/profile.css";
import { NavLink } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { toast } from "react-toastify";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import Crop from "../components/Crop";

export default function EditProfile() {
  const userData = useUser();
  const supabase = useSupabaseClient();
  const [profile, setprofile] = useState(userData.user_metadata.profile);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(userData);
  const [openCrop, setOpenCrop] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

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

  function ShowToast(c) {
    toast.success("Profile updated successfully", {
      autoClose: c ? 100000 : 0,
    });
  }
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
      toast.info("Updating Profile...", {
        autoClose: 3000,
      });
      try {
        let filePath =
          "https:ui-avatars.com/api/?name=" +
          values.name +
          "&background=random&rounded=true&size=128";
        if (file) {
          const { data, error } = await supabase.storage
            .from("profiles")
            .upload(`${user.id}/${uuidv4()}`, file);

          // fileData = data.Key;
          filePath =
            "https://xmeyiduceoxfvciwoajn.supabase.co/storage/v1/object/public/profiles/" +
            data.path;
        }
        const { error } = await supabase.auth.updateUser({
          data: {
            name: values.name,
            bio: values.bio,
            profile: filePath,
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
              profile: filePath,
            })
            .eq("user_id", user.id);
          if (usererror) {
            toast.error(usererror.message, {
              autoClose: 3000,
            });
          } else {
            toast.success("Profile updated successfully", {});
            getUser();
            navigate();
          }
        }
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
      setFile(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        setprofile(e.target.result);
      };
      reader.readAsDataURL(file);
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
            <div className="form-group my-3 ">
              <label htmlFor="username" className=" text-muted">
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
                className="form-control text-muted border-secondary disabled   rounded-0"
                id="exampleInputEmail1"
                defaultValue={user.email}
              />
              <small className="text-muted sm">can't change this field</small>

              {formik.errors.email ? (
                <div className="form-invalid"> {formik.errors.email}</div>
              ) : null}
            </div>

            <div className="form-group center-flex my-3 d-flex ">
              <img
                src={profile}
                width={70}
                height={70}
                className="rounded-pill border mx-3"
                style={{ transform: "scale(1.2)" }}
                alt=""
                onClick={() => setOpenCrop(true)}
              />
              <div>
                <input
                  type="file"
                  accept="image/jpeg , image/png"
                  className="form-control text-muted border-0 d-block   rounded-0"
                  id="exampleInputEmail1"
                  onChange={(e) => updateProfilePreview(e)}
                  aria-describedby="profileHelp"
                />
                <div id="profileHelp" className=" text-muted">
                  upload square image for best results (128x128)
                  <p>
                    <small>crop your image </small>
                  </p>
                </div>
              </div>
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
                <div className="form-invalid"> {formik.errors.bio}</div>
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
