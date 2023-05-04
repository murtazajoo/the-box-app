import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function LikedUser({ user_id }) {
  const [user, setUser] = useState(null);
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      let { data: user, error } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", user_id)
        .single();
      if (error) {
        console.log(error.message);
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    if (!user_id) return;
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  return (
    <>
      {loading ? (
        <div className="card text bg-text border-0">
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                <div
                  className="rounded-circle bg-secondary"
                  style={{ width: 50, height: 50 }}
                ></div>
              </div>
              <div className="col-10">
                <p className="card-text">loading...</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0  bg-text">
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                <img
                  src={user.profile}
                  width={50}
                  height={50}
                  alt=""
                  className="rounded-circle border-warning "
                />
              </div>
              <div className="col-8">
                <h5 className="card-title mb-0 text">{user.name}</h5>
                <p className="card-text text text-muted my-0 py-0">
                  @{user.username}
                </p>
              </div>
              <div className="col-2">
                <NavLink
                  to={`/profile/${user.username}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Profile
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
