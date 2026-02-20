import React, { useState, useEffect } from "react";
import API from "../api/axios";

const BlogForm = ({ editBlog, fetchBlogs, setEditBlog }) => {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [designation, setDesignation] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editBlog) {
      setPreview(editBlog.image);
      setTitle(editBlog.title);
      setDescription(editBlog.description);
      setAuthor(editBlog.author);
      setDesignation(editBlog.designation);
      setCategory(editBlog.category);
      setContent(editBlog.content);
    }
  }, [editBlog]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("author", author);
      formData.append("designation", designation);
      formData.append("category", category);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      if (editBlog) {
        await API.put(`/blogs/${editBlog._id}`, formData);
      } else {
        await API.post("/blogs", formData);
      }

      fetchBlogs();
      setEditBlog(null);

      setImage(null);
      setPreview("");
      setTitle("");
      setDescription("");
      setAuthor("");
      setDesignation("");
      setCategory("");
      setContent("");

    } catch (err) {
      console.error("BLOG ERROR:", err);
    }
  };

  return (
    <form className="adm-blog-form-box" onSubmit={submitHandler}>

      <h2 className="adm-blog-form-heading">
        {editBlog ? "Edit Blog Post" : "Create Blog Post"}
      </h2>

      <div className="adm-input-group">
        <label>Upload Image</label>
        <input type="file" onChange={handleImage} />
        {preview && <img src={`http://localhost:5000${preview}`} className="adm-image-preview" />}
      </div>
{/* TITLE + DESCRIPTION ROW */}
<div className="adm-form-row">
  <div className="adm-input-group">
    <label>Blog Title</label>
    <input
      value={title}
      onChange={e=>setTitle(e.target.value)}
      required
    />
  </div>

  <div className="adm-input-group">
    <label>Blog Description</label>
    <textarea
      value={description}
      onChange={e=>setDescription(e.target.value)}
    />
  </div>
</div>

{/* AUTHOR ROW */}
<div className="adm-form-row">
  <div className="adm-input-group">
    <label>Author Name</label>
    <input
      value={author}
      onChange={e=>setAuthor(e.target.value)}
    />
  </div>

  <div className="adm-input-group">
    <label>Author Designation</label>
    <input
      value={designation}
      onChange={e=>setDesignation(e.target.value)}
    />
  </div>
</div>


      <div className="adm-input-group">
        <label>Category</label>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option>Activities</option>
          <option>Education</option>
          <option>Events</option>
          <option>Kids Care</option>
          <option>School News</option>
        </select>
      </div>

      <div className="adm-input-group">
        <label>Blog Content</label>
        <textarea
          className="adm-content-textarea"
          value={content}
          onChange={e=>setContent(e.target.value)}
        />
      </div>

      <button className="adm-submit-btn">
        {editBlog ? "Update Blog" : "Publish Blog"}
      </button>

    </form>
  );
};

export default BlogForm;