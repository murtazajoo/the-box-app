import React, { useState, useEffect } from "react";
import { FaBookmark, FaHashtag } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  FiHome,
  FiCompass,
  FiUser,
  FiMail,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Navbar({ loggedIn }) {
  const [menuState, setmenuState] = useState("menu-state-mobile-off");

  let cookie = new Cookies();
  function toggleMenu() {
    if (menuState === "menu-state-mobile-off") {
      setmenuState("menu-state-mobile-on");
      document.body.style.overflow = "hidden";
    } else {
      setmenuState("menu-state-mobile-off");
      document.body.style.overflow = "auto";
    }
    document.body.style.overflowX = "hidden !important";
  }

  useEffect(() => {
    if (menuState === "menu-state-mobile-on") {
      document.body.style.overflow = "hidden";
      function onBackButtonEvent(e) {
        e.preventDefault();
        setmenuState("menu-state-mobile-off");
        window.history.pushState(null, null, window.location.pathname);
      }
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", onBackButtonEvent, false);
      return () => {
        window.removeEventListener("popstate", onBackButtonEvent);
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuState]);

  useEffect(() => {
    if (menuState === "menu-state-mobile-on") {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          setmenuState("menu-state-mobile-off");
          document.body.style.overflow = "auto";
        });
      });
    }
  }, [menuState]);

  return (
    <>
      <nav
        id="main-nav"
        className="navbar navbar-expand-lg bg-body-tertiary main-nav"
      >
        <div className="container-fluid">
          <a className="navbar-brand center-flex" href="./">
            <FaBookmark color="#1da1f2" size={40} />{" "}
            <span className="logo text-muted h2">MORA</span>
          </a>

          <div className="" id="navbarSupportedContent">
            <div className="mb-2">
              {loggedIn && (
                <ul
                  className={`navbar-nav m-auto center-flex menu  mb-lg-0 ${menuState}`}
                >
                  {" "}
                  <form className=" center-flex me-auto mb-2 mb-lg-0 search-box">
                    <FaHashtag size={20} />
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Search Mora"
                      className="bg-transparent border-0 outline-0"
                    />
                  </form>
                  <li className="nav-item">
                    <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => <Tooltip {...props}>Home</Tooltip>}
                      placement="bottom"
                    >
                      <NavLink
                        className={`nav-link`}
                        aria-current="page"
                        to="/"
                      >
                        <FiHome className="nav-link-icon" size={25} />
                        <span className={`nav-icon-label `}>Home</span>
                      </NavLink>
                    </OverlayTrigger>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => <Tooltip {...props}>Explore</Tooltip>}
                      placement="bottom"
                    >
                      <NavLink className={`nav-link `} to={"../explore"}>
                        <FiCompass className="nav-link-icon" size={25} />
                        <span className="nav-icon-label">Explore</span>
                      </NavLink>
                    </OverlayTrigger>{" "}
                  </li>
                  <li className="nav-item">
                    <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => (
                        <Tooltip {...props}>Notification</Tooltip>
                      )}
                      placement="bottom"
                    >
                      <NavLink className={`nav-link `} to="../notification">
                        <FiBell className="nav-link-icon" size={25} />
                        <span className="nav-icon-label">Notification</span>
                      </NavLink>
                    </OverlayTrigger>
                  </li>
                  <li className="nav-item">
                    <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => (
                        <Tooltip {...props}>Messages</Tooltip>
                      )}
                      placement="bottom"
                    >
                      <NavLink className={`nav-link  `} to={"../messages"}>
                        <FiMail className="nav-link-icon" size={25} />
                        <span className="nav-icon-label">Messages</span>
                      </NavLink>
                    </OverlayTrigger>
                  </li>
                  <li className="nav-item">
                    <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => <Tooltip {...props}>Profile</Tooltip>}
                      placement="bottom"
                    >
                      <NavLink
                        state={{ user_id: cookie.get("user_id") }}
                        className={`nav-link `}
                        to="/profile/me"
                      >
                        <FiUser className="nav-link-icon" size={25} />
                        <span className="nav-icon-label">Profile</span>
                      </NavLink>
                    </OverlayTrigger>
                  </li>
                  <li>
                    <div className="divider"></div>
                  </li>
                  <li
                    className="nav-item "
                    onClick={() => {
                      cookie.set("user_id", "", { path: "/" });
                    }}
                  >
                    <OverlayTrigger
                      delay={{ hide: 450, show: 300 }}
                      overlay={(props) => <Tooltip {...props}>LogOut</Tooltip>}
                      placement="bottom"
                    >
                      <a href="../" className={`nav-link `}>
                        <FiLogOut className="nav-link-icon" size={15} />
                        <span className="nav-icon-label h6">LogOut</span>
                      </a>
                    </OverlayTrigger>
                  </li>
                </ul>
              )}
              {loggedIn && (
                <p className="menu-icon" onClick={toggleMenu}>
                  <TbGridDots size={30} className="menu-icon-icon" />
                </p>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
