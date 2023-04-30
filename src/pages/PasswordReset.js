import React, { useEffect, useState } from "react";
import supabase from "../assets/supabase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function PasswordReset() {
  const [password, setPassword] = useState("");
  const [changed, setChanged] = useState(false);
  const [hash, setHash] = useState();
  useEffect(() => {
    const hash = window.location.hash;
    setHash(hash);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      } else if (!error) {
        toast.success("password reset successful", {
          position: toast.POSITION.TOP_CENTER,
        });
        setChanged(true);
      }
    } catch (error) {
      toast.error("something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center flex-column "
      style={{ minHeight: "calc(100vh - 70px )" }}
    >
      {!changed ? (
        <form onSubmit={handleSubmit} className="text bg-text p-5 text-center">
          <h1 className="mb-5">Reset Password </h1>
          <div class="form-floating mb-3">
            <input
              type="password"
              style={{ minWidth: "250px" }}
              name="password"
              aria-describedby="passhelp"
              className="form-control  mt-0 mb-3 text"
              placeholder="Enter new Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              id="floatingInput"
            />

            <label for="floatingInput">New Password</label>
          </div>
          <div id="passhelp" className="form-text  mb-3 text-center">
            <p className="">make sure your new password is strong</p>
          </div>
          <div className="text-center w-100">
            <button
              type="submit"
              className={`btn btn-success ${password.length < 8 && "disabled"}`}
            >
              Change Password
            </button>
          </div>{" "}
          <div className="border-bottom border-secondary my-3 w-25 m-auto"></div>
          <p className="text-muted  text-center  py-3 m-auto">
            <Link to="../login" className="text-primary">
              Login
            </Link>
            <span className="mx-3">or</span>
            <Link to="../register" className="text-primary">
              signUp
            </Link>
          </p>
        </form>
      ) : (
        <div className="text bg-text p-5 text-center">
          <h1 style={{ fontSize: "5rem" }}>🥳</h1>
          <h1 className="mb-5 text-success">Password Reset Successful </h1>
          <p className="text-muted">
            Now you can{" "}
            <Link to="../login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
