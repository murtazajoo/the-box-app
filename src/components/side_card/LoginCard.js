import React from "react";
import { Link } from "react-router-dom";
export default function LoginCard() {
  return (
    <div className="profile-card ">
      <div className="login-card py-3">
        <h5 className="text-muted mb-4">You are not Signed-in</h5>
        <Link to="./login" className="btn btn-info text-light py-3 px-5">
          Login
        </Link>
        <div className="border-bottom border-secondary my-3 w-25 m-auto"></div>
        <p className="text-muted text-center  py-3 px-5">
          don't have an account?{" "}
          <Link to="./register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
