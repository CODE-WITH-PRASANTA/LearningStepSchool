import React from "react";
import { FaTag, FaCalendarAlt } from "react-icons/fa";
import "./Ourblogs.css";

const Ourblogs = () => {
  const blogs = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
      category: "Cooking",
      date: "Feb 20, 2024",
      title: "That Jerk Form Finance Really Threw Me",
      author: "Dianne Russell",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800",
      category: "Cooking",
      date: "Feb 20, 2024",
      title: "From Without Content Style Without",
      author: "Leslie Alexander",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
  ];

  return (
    <section className="Ourblogs-section">
      <div className="Ourblogs-container">
        <div className="Ourblogs-header">
          <span className="Ourblogs-label">Our Blogs</span>
          <h2 className="Ourblogs-title">Explore Blogs And News</h2>
        </div>

        <div className="Ourblogs-cards">
          {blogs.map((blog) => (
            <article className="Ourblogs-card" key={blog.id}>
              <div className="Ourblogs-image">
                <img src={blog.image} alt={blog.title} />
              </div>

              <div className="Ourblogs-content">
                <div className="Ourblogs-meta">
                  <span>
                    <FaTag /> {blog.category}
                  </span>
                  <span>
                    <FaCalendarAlt /> {blog.date}
                  </span>
                </div>

                <h3 className="Ourblogs-card-title">{blog.title}</h3>

                <div className="Ourblogs-author">
                  <img src={blog.avatar} alt={blog.author} />
                  <div className="Ourblogs-author-info">
                    <span className="Ourblogs-author-by">By Admin</span>
                    <span className="Ourblogs-author-name">
                      {blog.author}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ourblogs;
