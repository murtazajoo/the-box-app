import React, { useState } from "react";
import { BsBoxArrowInDown } from "react-icons/bs";
import { toast } from "react-toastify";
export default function AddTweet(props) {
  const supabase = props.supabase;
  const [alert, setAlert] = useState({ status: false, message: "" });
  const [formData, setFormData] = useState({ text: "" });

  // function to handle input change and update the state
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // function to handle form submission and send data to supabase
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.text === "") return;
    let postData = {
      ...formData,
      user_id: props.user.user_id,
      name: props.user.name,
      profile: props.user.profile,
      username: props.user.username,
    };

    const { data, error } = await supabase.from("posts").insert([postData]);

    if (error) {
      console.error(data, error);
      toast.error("Error adding post", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.success("Post added successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      props.getPosts(true);
      setFormData({ text: "" });
    }
  };

  return (
    <form className="add-tweet-holder mb-3" onSubmit={handleSubmit}>
      <img
        className="border"
        src={props.user.profile}
        alt="your-profile"
        width={50}
        height={50}
      />
      <div>
        <textarea
          rows={2}
          maxLength={280}
          type="text"
          onChange={handleInputChange}
          name="text"
          value={formData.text}
          placeholder="What's happening?"
        />
        <div className="add-tweet-icons">
          <div className="  border-0 text-end mt-3 w-100 d-flex justify-content-end ">
            <button
              type="submit"
              className="btn btn-info text-uppercase center-flex"
            >
              <p className="mx-1 m-0 p-0">Drop</p>
              <BsBoxArrowInDown />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
