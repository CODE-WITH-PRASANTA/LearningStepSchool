import React, { useEffect, useState } from "react";
import "./BlogView.css";
import API, { IMAGE_URL } from "../../api/axios";

const BlogView = () => {
  const [blogs, setBlogs] = useState([]);

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      setBlogs(res.data.data || res.data);
    } catch (err) {
      console.error("BLOG FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (!blogs.length) return null;

  const mainBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 3);
  const gridBlogs = blogs.slice(3, 7);

  return (
    <section className="bv-main-section">
      <h2 className="bv-main-heading">Blog View</h2>

      <div className="bv-top-layout">

        {/* LEFT BIG BLOG */}
        {mainBlog && (
          <div className="bv-feature-card">
            <img
              src={`${IMAGE_URL}${mainBlog.image}`}
              alt="blog"
            />

            <div className="bv-feature-overlay">
              <span className="bv-date">
                {new Date(mainBlog.createdAt).toDateString()}
              </span>

              <h3>{mainBlog.title}</h3>

              <div className="bv-meta">
                <span>{mainBlog.author}</span>
                <span>{mainBlog.views || 0} Hits</span>
                <span>{mainBlog.comments || 0} Comments</span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDE BLOGS */}
        <div className="bv-side-wrapper">
          {sideBlogs.map((blog) => (
            <div className="bv-side-card" key={blog._id}>
              <img
                src={`${IMAGE_URL}${blog.image}`}
                alt="blog"
              />

              <div className="bv-side-content">
                <span className="bv-side-date">
                  {new Date(blog.createdAt).toDateString()}
                </span>
                <h4>{blog.title}</h4>
                <p>{blog.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* GRID BLOGS */}
      <div className="bv-grid-wrapper">
        {gridBlogs.map((blog) => (
          <div className="bv-grid-card" key={blog._id}>
            <img
              src={`${IMAGE_URL}${blog.image}`}
              alt="blog"
            />
            <h5>{blog.title}</h5>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogView;