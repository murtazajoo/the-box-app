import React from "react";
import { Link } from "react-router-dom";

export default function ProfileCard({ user }) {
  let { name, profile, username } = user.user_metadata;
  return (
    <div className="profile-card home-card-mobile mb-3">
      <p className="profile-card-banner">
        <img
          src="https://www.designbolts.com/wp-content/uploads/2014/06/Polygon-twitter-header-background.jpg"
          alt="banner"
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
