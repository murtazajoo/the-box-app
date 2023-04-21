import React from "react";

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
        <img src={profile} alt="" />
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
            <a href="./" className="text-primary text-decoration-none">
              My Profile
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
