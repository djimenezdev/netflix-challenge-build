import React from "react";
import { useSelector } from "react-redux";
import { getData } from "../../features/subscriptionSlice";
import { selectUser } from "../../features/userSlice";
import { authM } from "../../firebase";
import "../../Styles/ProfileScreen.css";
import Nav from "../Home/Nav";
import PlanScreen from "./PlanScreen";

const ProfileScreen = () => {
  const user = useSelector(selectUser);
  const subData = useSelector(getData);

  return (
    <div className="profileScreen">
      <Nav />
      <div className="profileScreen__body">
        <h1>Edit Profile</h1>
        <div className="profileScreen__info">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt="user avatar"
          />
          <div className="profileScreen__details">
            <h2>{user.email}</h2>
            <div className="profileScreen__plans">
              <h3>
                Plans{" "}
                {subData?.role && subData?.packageStatus === "trialing" ? (
                  <span>
                    (Current Plan: {subData.role} - {subData.packageStatus})
                  </span>
                ) : subData?.role && subData?.packageStatus ? (
                  <span>(Current Plan: {subData.role})</span>
                ) : (
                  <span>(Current Plan: not Active)</span>
                )}
              </h3>
              <PlanScreen />
              <button
                className="profileScreen__signOut"
                onClick={() => {
                  authM.signOut();
                  window.location.reload();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
