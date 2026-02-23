import React, { useState, useEffect } from "react";
import BlogForm from "../../Component/BlogForm";
import BlogTable from "../../Component/BlogTable";
import API from "../../api/axios";
import "./BlogManagerPage.css";

const BlogManagerPage = () => {

  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);

  /* ================= FETCH BLOGS ================= */
 const fetchBlogs = async () => {
  try {
    const res = await API.get("/blogs");

    console.log("API RESPONSE:", res.data);

    // ✅ IMPORTANT FIX
    setBlogs(res.data.data);

  } catch (err) {
    console.error("FETCH BLOG ERROR:", err);
  }
};
  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= DELETE ================= */
  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await API.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="adm-blog-manager-container">

      <div className="adm-blog-left-panel">
        <BlogForm
          editBlog={editBlog}
          fetchBlogs={fetchBlogs}
          setEditBlog={setEditBlog}
        />
      </div>

      <div className="adm-blog-right-panel">
        <BlogTable
          blogs={blogs}
          onEdit={setEditBlog}
          onDelete={deleteBlog}
        />
      </div>

    </div>
  );
};

export default BlogManagerPage;