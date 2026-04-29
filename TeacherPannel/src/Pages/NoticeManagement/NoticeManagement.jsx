import React, { useState, useEffect } from "react";
// import API, { IMAGE_URL } from "../api/axios";
import "./NoticeManagement.css";

const themes = ["theme1", "theme2", "theme3", "theme4"];

const getTheme = (i) => themes[i % themes.length];

const NoticeManagement = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    name: "",
    designation: "",
    dateTime: "",
    location: "",
    expiry: "",
    image: null,
    preview: null,
  });

  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchNotices = async () => {
    try {
      const res = await API.get("/notices");
      setNotices(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      image: file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) formData.append(k, v);
    });

    if (editId) {
      await API.put(`/notices/${editId}`, formData);
    } else {
      await API.post("/notices", formData);
    }

    resetForm();
    fetchNotices();
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      name: "",
      designation: "",
      dateTime: "",
      location: "",
      expiry: "",
      image: null,
      preview: null,
    });
    setEditId(null);
  };

  const editNotice = (n) => {
    setForm({
      ...n,
      dateTime: n.dateTime?.slice(0, 16),
      expiry: n.expiry?.split("T")[0],
      preview: n.image ? `${IMAGE_URL}${n.image}` : null,
    });
    setEditId(n._id);
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    await API.delete(`/notices/${id}`);
    fetchNotices();
  };

  const filtered = notices.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="noticeMgmt">

      <div className="noticeMgmt__grid">

        {/* FORM */}
        <form className="noticeMgmt__form" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Notice" : "Create Notice"}</h2>

          <input className="noticeMgmt__input" value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Author"/>

          <input className="noticeMgmt__input" value={form.designation}
            onChange={(e)=>setForm({...form,designation:e.target.value})} placeholder="Designation"/>

          <input className="noticeMgmt__input" value={form.title}
            onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Title"/>

          <textarea className="noticeMgmt__input"
            value={form.description}
            onChange={(e)=>setForm({...form,description:e.target.value})}
            placeholder="Description"/>

          <input type="datetime-local" className="noticeMgmt__input"
            value={form.dateTime}
            onChange={(e)=>setForm({...form,dateTime:e.target.value})}/>

          <input className="noticeMgmt__input"
            value={form.location}
            onChange={(e)=>setForm({...form,location:e.target.value})}
            placeholder="Location"/>

          <input type="date" className="noticeMgmt__input"
            value={form.expiry}
            onChange={(e)=>setForm({...form,expiry:e.target.value})}/>

          <input type="file" onChange={handleImage} />

          <button className="noticeMgmt__btn">
            {editId ? "Update" : "Publish"}
          </button>
        </form>

        {/* PREVIEW */}
        <div className="noticeMgmt__preview">
          <h3>Live Preview</h3>

          {form.preview && (
            <img src={form.preview} className="noticeMgmt__previewImg" />
          )}

          <h4>{form.title || "Title"}</h4>
          <p>{form.description || "Description..."}</p>
          <small>{form.name} • {form.designation}</small>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="noticeMgmt__input noticeMgmt__search"
        placeholder="Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="noticeMgmt__list">
        {filtered.map((n,i)=>(
          <div key={n._id} className={`noticeMgmt__card ${getTheme(i)}`}>

            {n.image && (
              <img src={`${IMAGE_URL}${n.image}`} className="noticeMgmt__cardImg"/>
            )}

            <h4>{n.title}</h4>
            <p>{new Date(n.dateTime).toLocaleString()}</p>

            <div className="noticeMgmt__actions">
              <button onClick={()=>editNotice(n)}>Edit</button>
              <button onClick={()=>deleteNotice(n._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NoticeManagement;