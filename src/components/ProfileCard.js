import React from "react";
import { Link } from "react-router-dom";

export default function ProfileCard({ userData }) {
  let { name, profile, username } = userData;
  return (
    <div className="profile-card home-card-mobile mb-3">
      <p className="profile-card-banner">
        <img
          src="https://www.designbolts.com/wp-content/uploads/2014/06/Polygon-twitter-header-background.jpg"
          alt=""
        />
      </p>

      <p className="profile-card-picture">
        <img
          src={profile}
          className="rounded-pill border border-2 border-primary"
          width="100"
          height="100"
          alt=""
        />
      </p>
      <div className="profile-card-body">
        <h3>{name}</h3>
        <p className="text-muted">@{username}</p>
        {/* <div className="profile-card-details">
          <div>
            <p>{following}</p>
            <p className="text-muted">Following</p>
          </div>
          <div>
            <p>{followers}</p>
            <p className="text-muted">Followers</p>
          </div>
        </div> */}
        <div className="my-4">
          <p>
            <Link
              to="/profile/me"
              className="text-primary text-decoration-none"
            >
              My Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
