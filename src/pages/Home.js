import React, { useEffect } from "react";
import ProfileCard from "../components/side_card/ProfileCard";
import LoginCard from "../components/side_card/LoginCard";
import Post from "../components/post/Post";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import AddPost from "../components/post/AddPost";

export default function Home({
  loggedIn,
  user,
  posts,
  updateUser,
  addPost,
  totalPosts,
  scrollPosition,
  setScrollPosition,
  getMorePosts,
  deletePost,
}) {
  useEffect(() => {
    window.scrollTo({
      top: scrollPosition,
      behavior: "auto",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const MemoPost = React.memo(Post);

  return (
    <>
      <main key={"podh"}>
        <div className="profile-holder">
          {loggedIn && user ? <ProfileCard user={user} /> : <LoginCard />}
        </div>
        {posts && posts.length > 0 && (
          <div className="main-holder">
            {user && loggedIn && <AddPost user={user} addPost={addPost} />}
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={posts.length < totalPosts}
              loader={
                <div className="m-auto mt-5 text-center">
                  <div className="spinner-border text-primary " role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              }
              endMessage={
                <div className="text-center">
                  <p>
                    {" "}
                    <BsFillBookmarkCheckFill
                      size={40}
                      className="text-success"
                    />
                  </p>
                  <p className="text-success">Yay, You have seen it all</p>
                </div>
              }
            >
              {posts.map((post) => {
                return (
                  <MemoPost
                    key={post.id}
                    user={user}
                    loggedIn={loggedIn}
                    post={post}
                    updateUser={updateUser}
                    setScrollPosition={setScrollPosition}
                    deletePost={deletePost}
                    getPosts={() => {}}
                    admin={post.user_id === user?.id}
                  />
                );
              })}
            </InfiniteScroll>
          </div>
        )}
        <div className="trending-holder"></div>
      </main>
    </>
  );
}
