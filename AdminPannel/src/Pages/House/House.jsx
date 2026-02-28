import React, { useState, useMemo } from "react";
import "./House.css";

const House = () => {
  const [houses, setHouses] = useState([
    { id: 1, name: "Black", master: "Aatam Jain", description: "" },
    { id: 2, name: "Green", master: "", description: "" },
    { id: 3, name: "Yellow", master: "", description: "Address" },
    { id: 4, name: "Blue", master: "", description: "" },
    { id: 5, name: "Red House", master: "Aatam Jain", description: "" },
    { id: 6, name: "Apple House", master: "", description: "" },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    master: "",
    description: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // 🔎 Search Filter
  const filteredData = useMemo(() => {
    return houses.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.master.toLowerCase().includes(search.toLowerCase())
    );
  }, [houses, search]);

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    if (formData.id) {
      // Edit
      setHouses((prev) =>
        prev.map((item) =>
          item.id === formData.id ? formData : item
        )
      );
    } else {
      // Add
      const newHouse = {
        ...formData,
        id: Date.now(),
      };
      setHouses((prev) => [...prev, newHouse]);
    }

    setFormData({ id: null, name: "", master: "", description: "" });
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      setHouses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="studentHouse">
      <div className="studentHouse__container">

        {/* ===== LEFT FORM ===== */}
        <div className="studentHouse__formCard">
          <h2 className="studentHouse__title">
            {formData.id ? "Edit Student House" : "Add Student House"}
          </h2>

          <form onSubmit={handleSubmit} className="studentHouse__form">
            <div className="studentHouse__field">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter house name"
                required
              />
            </div>

            <div className="studentHouse__field">
              <label>Master</label>
              <input
                type="text"
                name="master"
                value={formData.master}
                onChange={handleChange}
                placeholder="Enter master name"
              />
            </div>

            <div className="studentHouse__field">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter description"
              />
            </div>

            <button type="submit" className="studentHouse__primaryBtn">
              {formData.id ? "Update" : "Save"}
            </button>
          </form>
        </div>

        {/* ===== RIGHT LIST ===== */}
        <div className="studentHouse__listCard">
          <div className="studentHouse__listHeader">
            <h2>Student House List</h2>

            <input
              type="text"
              placeholder="Search..."
              className="studentHouse__search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="studentHouse__tableWrapper">
            <table className="studentHouse__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Master</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.master || "-"}</td>
                      <td>{item.description || "-"}</td>
                      <td>
                        <div className="studentHouse__actions">
                          <button
                            className="studentHouse__editBtn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="studentHouse__deleteBtn"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="studentHouse__noData">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ===== PAGINATION ===== */}
          <div className="studentHouse__pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default House;