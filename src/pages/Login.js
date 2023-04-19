import React, { useState } from "react";
import "../css/login.css";
import { Link } from "react-router-dom";
import { BsArrowLeftShort, BsFillArrowRightCircleFill, BsFillBookmarkPlusFill, BsFillExclamationSquareFill, BsFillExclamationTriangleFill } from "react-icons/bs";
import { createClient } from "@supabase/supabase-js";
import "bootstrap";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
    console.log(formData);
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      setAlert(true);

      setTimeout(() => {
        setAlert(false)
      }, 3000);
    } else {
      setAlert(false);
      const cookies = new Cookies();
      cookies.set("user_id", data.user.id, { path: "/" });
      cookies.set("access_token", data.session.access_token, { path: "/" });
      navigate("../");
    }
  };
  return (
    <div className="login-form ">
      <Link
        to="/"
        className="btn center-flex btn-outline-dark position-absolute back-btn"
      >
        <BsArrowLeftShort /> Go Back
      </Link>
     
      <form className="m-auto position-relative  p-5" onSubmit={handleSubmit}>
   
        <p className="text-center h3 mb-4">Login <BsFillBookmarkPlusFill class="text-warning"/> </p>
        {alert && (
        <div
          class="alert text-danger center-flex  text-center w-100 p-0 m-0 mb-2 bg-none "
          role="alert"
        >
         <BsFillExclamationTriangleFill/> Invalid Login Credentials
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
            class="form-control"
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
            class="form-control"
            id="exampleInputPassword1"
            placeholder="**********"
            required

          />
        </div>

        <button type="submit" class="btn btn-primary ">
          Login <BsFillArrowRightCircleFill />
        </button>

        <div className="border-bottom border-secondary my-3 w-25 m-auto"></div>
        <p className="text-muted  py-3 m-auto w-100">
          don't have an account?{" "}
          <Link to="../signup" className="text-primary">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
