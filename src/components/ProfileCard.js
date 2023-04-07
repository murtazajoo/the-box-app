import React from "react";

export default function ProfileCard() {
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
          src="https://i.pinimg.com/originals/e8/fa/0d/e8fa0d8aaaf0949e135dee823a18c008.jpg"
          alt=""
        />
      </p>
      <div className="profile-card-body">
        <h3>Murtaza Joo</h3>
        <p className="text-muted">@murtazajoo</p>
        <div className="profile-card-details">
          <div>
            <p>2,013</p>
            <p className="text-muted">Following</p>
          </div>
          <div>
            <p>5,013</p>
            <p className="text-muted">Followers</p>
          </div>
        </div>
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
