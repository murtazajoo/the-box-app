import React, { useState , useEffect } from "react";
import { FaBookmark, FaHashtag, FaBell } from "react-icons/fa";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineExplore } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { BsFillPersonFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";

export default function Navbar({active,loggedIn}) {
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
      <nav id="main-nav" className="navbar navbar-expand-lg bg-body-tertiary main-nav">
        <div className="container-fluid">
          <a className="navbar-brand center-flex" href="./">
            <FaBookmark color="#1da1f2" size={40} />{" "}
            <span className="logo text-muted h2">MORA</span>
          </a>

          <div className="" id="navbarSupportedContent">
            <div className="mb-2">
              <ul
                className={`navbar-nav m-auto center-flex menu  mb-lg-0 ${menuState}`}
              >
                {" "}
                <form className=" center-flex me-auto mb-2 mb-lg-0 search-box">
                  <FaHashtag color="#707e8b" size={20} />
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
                      className={`nav-link ${active ==="home" && "active-nav"} `} 
                      aria-current="page"
                      to="../"
                    >
                      <BiHomeAlt  size={25} />
                      <span className="nav-icon-label">Home</span>
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
                    <NavLink className={`nav-link ${active ==="explore" && "active-nav"} `}  href="./">
                      <MdOutlineExplore color="#707e8b" size={25} />
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
                    <NavLink className={`nav-link ${active ==="notification" && "active-nav"} `}  href="./">
                      <FaBell color="#707e8b" size={25} />
                      <span className="nav-icon-label">Notification</span>
                    </NavLink>
                  </OverlayTrigger>
                </li>
                <li className="nav-item">
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Messages</Tooltip>}
                    placement="bottom"
                  >
                    <NavLink  className={`nav-link ${active ==="messages" && "active-nav"} `}  href="./">
                      <IoMdMail color="#707e8b" size={25} />
                      <span className="nav-icon-label">Messages</span>
                    </NavLink>
                  </OverlayTrigger>
                </li>
                <li className="nav-item">
                  <div className="divider"></div>
                </li>
                <li className="nav-item">
                  <OverlayTrigger
                    delay={{ hide: 450, show: 300 }}
                    overlay={(props) => <Tooltip {...props}>Profile</Tooltip>}
                    placement="bottom"
                  >
                    <NavLink className={`nav-link ${active ==="profile" && "active-nav"} `} to="../profile">
                      <BsFillPersonFill color="#707e8b" size={25} />
                      <span className="nav-icon-label">Profile</span>
                    </NavLink>
                  </OverlayTrigger>
                </li>
              </ul>
              {loggedIn && <p className="menu-icon" onClick={toggleMenu}>
                <TbGridDots color="#707e8b" size={30} />
              </p>}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
