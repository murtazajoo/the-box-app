import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeftShort, BsFillArrowRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Login({ setLoggedIn, loggedIn }) {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("logging you in...");
    setIsSubmitting(true);
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    setIsSubmitting(false);
    if (error) {
      toast.update(toastId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      if (error.message === "Invalid password") {
        setFormData({ ...formData, password: "" });
      }

      setLoggedIn(false);
    } else if (data) {
      setLoggedIn(true);
      toast.update(toastId, {
        render: "Logged in successfully",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      navigate("../");
    }
  };
  useEffect(() => {
    if (loggedIn) {
      navigate("../");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-form ">
      <form className="m-auto position-relative  p-5" onSubmit={handleSubmit}>
        <Link to="/" className="btn center-flex  position-absolute  back-btn">
          <BsArrowLeftShort /> Go Back
        </Link>

        <p className="text-center h4 mb-4">Login</p>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control py-2 h2"
            id="exampleInputEmail1"
            placeholder="example@mail.com"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            className="form-control py-2 h2"
            id="exampleInputPassword1"
            autoComplete="current-password"
            placeholder="**********"
            required
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="btn btn-primary "
        >
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
          <Link to="../register" className="text-primary text-decoration-none">
            Register
          </Link>
        </p>
      </form>
      <div className="img w-50">
        {/* <img
          src="https://source.unsplash.com/random/1920x1080/?wallpaper,landscape,sky"
          alt=""
          className="img-fluid"
        /> */}
        <div className="text-center d-flex justify-content-center align-items-center">
          <h4 className="logo h1" style={{ fontSize: "15vw" }}>
            MORA
          </h4>{" "}
        </div>
      </div>
    </div>
  );
}
