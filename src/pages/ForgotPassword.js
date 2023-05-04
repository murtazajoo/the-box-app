import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoSend } from "react-icons/io5";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ForgotPassword() {
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState(null);
  const [status, setStatus] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (clicked) {
      const interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimer(60);
    }
  }, [clicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
    const toastId = toast.loading("Please wait...");
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "https://the-box-app.vercel.app/password-reset",
      },
    });

    if (error) {
      console.log(error, email);
      toast.update(toastId, {
        render: "SomeThing Went Wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } else {
      toast.update(toastId, {
        render: "Link sent. Please check your mail",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setStatus(true);
    }
  };
  useEffect(() => {
    if (timer === 0) {
      setClicked(false);
    }
  }, [timer]);
  return (
    <div
      className="container  d-flex justify-content-center align-items-center flex-column "
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      <form onSubmit={handleSubmit} className="bg-text text-center p-5">
        <h1 className="mb-4 text">Forgot Password ?</h1>
        {status && (
          <div className="text bg-text text-center my-5">
            <p className="text-success">Password reset link sent</p>

            <hr />
            <p className="mb-0 alert alert-warning">
              If you don't receive the email within a few minutes, please check
              your junk/spam folder.
            </p>
            <hr />
          </div>
        )}
        <div id="emailHelp" className="form-text mb-3 text-center">
          Enter Your Email address we will send you a <b>magic</b> link to reset
          your password
        </div>{" "}
        <div class="form-floating mb-3">
          <input
            type="email"
            name="email"
            aria-describedby="emailHelp"
            className="form-control mt-0 mb-3 text "
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            id="floatingInput"
          />

          <label for="floatingInput">Email address</label>
        </div>
        <div className="w-100 text-center">
          {clicked && timer > 0 ? (
            <small className="mt-3 d-block text-muted">
              {" "}
              you can try again in {timer}s
            </small>
          ) : (
            <button
              type="submit"
              className={`btn center-flex m-auto btn-primary px-4 py-2  btn-block ${
                clicked && "disabled"
              }`}
            >
              Send Mail <IoSend className="mx-2" />
            </button>
          )}
        </div>
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
    </div>
  );
}
