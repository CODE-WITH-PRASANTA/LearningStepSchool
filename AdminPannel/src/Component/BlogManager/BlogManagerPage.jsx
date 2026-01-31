import React, { useState } from "react";
import BlogForm from "./BlogForm";
import BlogTable from "./BlogTable";
import "./blogManager.css";

const BlogManagerPage = () => {

  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);

  const addBlog = (blog) => {
    setBlogs([...blogs, { ...blog, id: Date.now() }]);
  };

  const updateBlog = (updated) => {
    setBlogs(blogs.map(b => b.id === updated.id ? updated : b));
    setEditBlog(null);
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(b => b.id !== id));
  };

  return (
    <div className="adm-blog-manager-container">

      <div className="adm-blog-left-panel">
        <BlogForm
          addBlog={addBlog}
          editBlog={editBlog}
          updateBlog={updateBlog}
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
