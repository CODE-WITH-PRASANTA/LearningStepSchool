import React, { useEffect, useState } from "react";
import API, { IMAGE_URL } from "../api/axios";

const AdminAdvertisement = () => {
  const [ads, setAds] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  /* ================= FETCH ADS ================= */

  const fetchAds = async () => {
    try {
      const res = await API.get("/advertisements/all");

      if (res.data.success) {
        setAds(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
  };

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= UPLOAD ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await API.post("/advertisements/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Advertisement uploaded successfully");

        setImage(null);
        setPreview("");

        fetchAds();
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteAd = async (id) => {
    if (!window.confirm("Delete this advertisement?")) return;

    try {
      setActionLoading(id);

      const res = await API.delete(`/advertisements/delete/${id}`);

      if (res.data.success) {
        fetchAds();
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= SAFE IMAGE URL ================= */

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${IMAGE_URL}/${path.replace(/^\/+/, "")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-8">Advertisement Manager</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* ================= UPLOAD PANEL ================= */}

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Advertisement</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            {preview && (
              <img
                src={preview}
                className="w-full rounded-lg shadow"
                alt="preview"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              {loading ? "Uploading..." : "Upload Advertisement"}
            </button>
          </form>
        </div>

        {/* ================= ADS LIST ================= */}

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Existing Advertisements
          </h2>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {ads.length > 0 ? (
              ads.map((ad) => (
                <div
                  key={ad._id}
                  className="flex items-center gap-4 border p-3 rounded-lg"
                >
                  <img
                    src={getImageUrl(ad.image)}
                    className="w-24 h-16 object-cover rounded"
                    alt="ad"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/120x80?text=Ad")
                    }
                  />

                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => deleteAd(ad._id)}
                      disabled={actionLoading === ad._id}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      {actionLoading === ad._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No advertisements uploaded yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAdvertisement;