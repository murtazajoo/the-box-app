import React, { useEffect, useState } from "react";
import formatTimeStamp from "../../../assets/format_time_stamp";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Comment(comment) {
  const supabase = useSupabaseClient();
  const { text, timestamp, user_id } = comment.comment;
  const [user, setUser] = useState(null);

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
      }
    }
    if (!user_id) return;
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  return (
    <>
      {comment && (
        <div className="card border-0 my-2   body-bg text">
          <div className="card-body">
            {" "}
            <div className="d-flex justify-content-between mb-2">
              {user && (
                <div className="d-flex small  flex-row align-items-center">
                  <img
                    src={user.profile}
                    className="rounded-circle"
                    alt="avatar"
                    width="20"
                    height="20"
                  />
                  <p className="small mb-0 ms-2 text-muted">
                    {user ? user.name : "anonymous"} @ {user.username}
                  </p>
                </div>
              )}
              <div className="d-flex flex-row align-items-center">
                <p className="small text-muted mb-0">
                  {formatTimeStamp(timestamp)}
                </p>
              </div>
            </div>
            <pre className="comment-text text h6 opacity-75">{text}</pre>
          </div>
        </div>
      )}
    </>
  );
}
