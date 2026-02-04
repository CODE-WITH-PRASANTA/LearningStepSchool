import React from "react";

const BlogTable = ({ blogs, onEdit, onDelete }) => {

  return (
    <div className="adm-blog-table-box">

      <h2 className="adm-table-heading">Manage Blog Posts</h2>

      <div className="adm-table-scroll-area">

        <table className="adm-blog-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Designation</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {blogs.length === 0 && (
              <tr>
                <td colSpan="7" className="adm-empty-row">
                  No blog posts available
                </td>
              </tr>
            )}

            {blogs.map(blog => (
              <tr key={blog.id}>

                <td>
                  <img src={blog.image} className="adm-table-img" />
                </td>

                <td>{blog.title}</td>
                <td>{blog.category}</td>
                <td>{blog.author}</td>
                <td>{blog.designation}</td>
                <td className="adm-desc-cell">
                  {blog.description}
                </td>

                <td>
                  <button
                    className="adm-edit-btn"
                    onClick={()=>onEdit(blog)}
                  >
                    Edit
                  </button>

                  <button
                    className="adm-delete-btn"
                    onClick={()=>onDelete(blog.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default BlogTable;
