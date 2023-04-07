import React, { useEffect, useState } from "react";
import { FaTwitter, FaHashtag, FaBell } from "react-icons/fa";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineExplore } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function Navbar() {
  const [menuState, setmenuState] = useState("menu-state-mobile-off");
  function toggleMenu() {
    if (menuState === "menu-state-mobile-off") {
      setmenuState("menu-state-mobile-on");
      document.body.style.overflow = "hidden";
    } else {
      setmenuState("menu-state-mobile-off");
      document.body.style.overflow = "auto";
    }
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="./">
            <FaTwitter color="#1da1f2" size={40} />
          </a>

          <div className="" id="navbarSupportedContent">
            <div className="mb-2">
              <ul
                className={`navbar-nav m-auto center-flex menu  mb-lg-0 ${menuState}`}
              >
                {" "}
                <form className="navbar-nav me-auto mb-2 mb-lg-0 search-box">
                  <FaHashtag color="#707e8b" size={20} />
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Search Twitter"
                    className="bg-transparent border-0 outline-0"
                  />
                </form>
                <li className="nav-item">
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Home</Tooltip>}
                    placement="bottom"
                  >
                    <a
                      className="nav-link active-nav center-flex"
                      aria-current="page"
                      href="./"
                    >
                      <BiHomeAlt color="#1da1f2" size={25} />
                      <span className="nav-icon-label">Home</span>
                    </a>
                  </OverlayTrigger>
                </li>
                <li className="nav-item">
                  {" "}
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Explore</Tooltip>}
                    placement="bottom"
                  >
                    <a className="nav-link" href="./">
                      <MdOutlineExplore color="#707e8b" size={25} />
                      <span className="nav-icon-label">Explore</span>
                    </a>
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
                    <a className="nav-link" href="./">
                      <FaBell color="#707e8b" size={25} />
                      <span className="nav-icon-label">Notification</span>
                    </a>
                  </OverlayTrigger>
                </li>
                <li className="nav-item">
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Messages</Tooltip>}
                    placement="bottom"
                  >
                    <a className="nav-link" href="./">
                      <IoMdMail color="#707e8b" size={25} />
                      <span className="nav-icon-label">Messages</span>
                    </a>
                  </OverlayTrigger>
                </li>
                <li className="nav-item">
                  <div className="divider"></div>
                </li>
              </ul>
              <p className="menu-icon" onClick={toggleMenu}>
                <TbGridDots color="#707e8b" size={30} />
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
