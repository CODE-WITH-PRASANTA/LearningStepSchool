import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { IMAGE_URL } from "../../Api/Api";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("BLOG DATA:", blog);
  console.log("DESCRIPTION:", blog?.description);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error("FETCH BLOG ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) return <div style={styles.center}>Loading...</div>;

  if (!blog) return <div style={styles.center}>Blog not found</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* CATEGORY */}
        {blog.category && <span style={styles.category}>{blog.category}</span>}

        {/* TITLE */}
        <h1 style={styles.title}>{blog.title}</h1>

        {/* META */}
        <div style={styles.meta}>
          <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>👤 {blog.author || "Admin"}</span>
        </div>

        {/* IMAGE */}
        {blog.image && (
          <div style={styles.imageWrapper}>
            <img
              src={`${IMAGE_URL}${blog.image}`}
              alt={blog.title}
              style={styles.image}
            />
          </div>
        )}

        {/* 🔹 SHORT DESCRIPTION */}
        {blog.description && (
          <div style={styles.shortDescription}>{blog.description}</div>
        )}

        {/* 🔹 FULL CONTENT */}
        {blog.content && (
          <div
            style={styles.content}
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "600",
  },
  category: {
    display: "inline-block",
    padding: "6px 16px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "30px",
    fontSize: "14px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "15px",
    lineHeight: "1.3",
    color: "#1f2937",
  },
  meta: {
    display: "flex",
    gap: "20px",
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },
  imageWrapper: {
    width: "100%",
    height: "450px",
    overflow: "hidden",
    borderRadius: "18px",
    marginBottom: "30px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.9",
    color: "#374151",
    whiteSpace: "pre-line",
  },
  shortDescription: {
    fontSize: "18px",
    fontWeight: "500",
    lineHeight: "1.8",
    color: "#111827",
    marginBottom: "30px",
    padding: "20px",
    background: "#f1f5f9",
    borderRadius: "12px",
  },

  content: {
    fontSize: "17px",
    lineHeight: "1.9",
    color: "#374151",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

export default BlogDetails;
