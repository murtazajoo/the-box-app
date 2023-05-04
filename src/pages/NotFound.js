import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/");
  }, 3000);

  return (
    <div
      className="container d-flex justify-content-center align-items-center flex-column"
      style={{ minHeight: "80vh" }}
    >
      <h1 style={{ fontSize: "10vw" }}>404 - Not Found!</h1>
      <h1 className="logo" style={{ fontSize: "10vw" }}>
        MORA
      </h1>

      <p>Redirecting to Home Page...</p>

      <small>
        if not redirected Automatically <NavLink to="/">Click here</NavLink>
      </small>
    </div>
  );
}
