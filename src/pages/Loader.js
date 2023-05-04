import React, { useEffect, useState } from "react";

export default function NotFound() {
  const [message, setMessage] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMessage(true);
    }, 20000);
  }, []);

  return (
    <div
      className="container d-flex justify-content-center align-items-center flex-column"
      style={{ minHeight: "90vh" }}
    >
      <div className="logo text " style={{ fontSize: "10vw" }}>
        <span className="m logo logo-loading">M</span>
        <span className="o logo logo-loading">O</span>
        <span className="r logo logo-loading">R</span>
        <span className="a logo logo-loading">A</span>
      </div>

      {message && (
        <small>
          if the page is not loading{" "}
          <a href="./" className="text-primary btn-sm py-0 btn">
            please refresh the page
          </a>
        </small>
      )}
    </div>
  );
}
