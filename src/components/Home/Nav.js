import React, { useEffect, useState } from "react";
import "../../Styles/Nav.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getData } from "../../features/subscriptionSlice";

const Nav = () => {
  const [show, handleShow] = useState(false);
  const router = useHistory();
  const subData = useSelector(getData);
  const transitionNav = () => {
    if (window.scrollY < 100) {
      handleShow(false);
    } else {
      handleShow(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNav);
    return () => window.removeEventListener("scroll", transitionNav);
  }, []);

  return (
    <div className={`nav ${show ? "nav__black" : ""}`}>
      <div className="nav__contents ">
        <img
          className="nav__logo"
          src="images/netflix-logo-removebg-preview.png"
          alt="logo"
          onClick={() =>
            subData?.role !== "trial ended" &&
            subData?.role !== "not active" &&
            subData?.role !== null
              ? router.push("/")
              : alert("You need to be subscribed to a plan to start watching!")
          }
        />
        <img
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
          onClick={() => router.push("/profile")}
        />
      </div>
    </div>
  );
};

export default Nav;
