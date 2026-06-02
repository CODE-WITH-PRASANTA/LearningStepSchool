import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import "./ShopInformation.css";

const ShopInformation = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);

 
  const [formData, setFormData] = useState({
    shopName: "",
    mobile: "",
    gst: "",
    state: "Uttar Pradesh",
    city: "Agra",
    pincode: "",
    address: "",
    remark: "",
  });

  const [shops, setShops] = useState([
    {
      id: 1,
      shopName: "Demo",
      mobile: "9012708735",
      city: "Agra",
      state: "Uttar Pradesh",
      gst: "12541254",
      pincode: "282003",
      address: "Demo Address",
      remark: "Demo Remark",
    },
    {
      id: 2,
      shopName: "Shop Demo",
      mobile: "1234567890",
      city: "Delhi",
      state: "Delhi",
      gst: "78541254",
      pincode: "110001",
      address: "Shop Address",
      remark: "Shop Remark",
    },
  ]);

  
  useEffect(() => {
    if (editData) {
      setFormData({
        shopName: editData.shopName || "",
        mobile: editData.mobile || "",
        gst: editData.gst || "",
        state: editData.state || "Uttar Pradesh",
        city: editData.city || "Agra",
        pincode: editData.pincode || "",
        address: editData.address || "",
        remark: editData.remark || "",
      });
    } else {
      setFormData({
        shopName: "",
        mobile: "",
        gst: "",
        state: "Uttar Pradesh",
        city: "Agra",
        pincode: "",
        address: "",
        remark: "",
      });
    }
  }, [editData, showPopup]);

  const openAddPopup = () => {
    setEditData(null);
    setShowPopup(true);
  };

  const openEditPopup = (item) => {
    setEditData(item);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditData(null);
  };

  const deleteShop = (id) => {
    setShops(shops.filter((item) => item.id !== id));
  };

  // Handles input values dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles both Adding a new record and Modifying an existing one
  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.shopName || !formData.mobile || !formData.pincode) {
      alert("Please fill in all mandatory fields marked with *");
      return;
    }

    if (editData) {
      // Modify Mode
      setShops(
        shops.map((shop) =>
          shop.id === editData.id ? { ...shop, ...formData } : shop
        )
      );
    } else {
      // Add Mode
      const newShop = {
        id: Date.now(), // Generate unique ID
        ...formData,
      };
      setShops([...shops, newShop]);
    }

    closePopup();
  };

  return (
    <div className="shopInformation">
      <div className="shopInformation__card">
        <div className="shopInformation__header">
          <div className="shopInformation__search">
            <FaSearch />
            <input type="text" placeholder="Search Shop..." />
          </div>

          <button
            className="shopInformation__addButton"
            onClick={openAddPopup}
          >
            <FaPlus />
          </button>
        </div>

        <div className="shopInformation__tableWrapper">
  <table className="shopInformation__table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>SHOP NAME</th>
              <th>MOBILE NO</th>
              <th>CITY</th>
              <th>GST NO</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {shops.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.shopName}</td>
                <td>{item.mobile}</td>
                <td>{item.city}</td>
                <td>{item.gst}</td>
                <td>
                  <div className="shopInformation__actionBox">
                    <button
                      className="shopInformation__editBtn"
                      onClick={() => openEditPopup(item)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="shopInformation__deleteBtn"
                      onClick={() => deleteShop(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
</div>

        <div className="shopInformation__pagination">
          <div className="shopInformation__paginationLeft">
            Items per page :
            <select>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>

          <div className="shopInformation__paginationRight">
            1 - {shops.length} of {shops.length}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="shopInformation__popupOverlay">
          {/* Changed container to <form> tag to enable submit triggers natively */}
          <form className="shopInformation__popup" onSubmit={handleSave}>
            <div className="shopInformation__popupHeader">
              <h2>SHOP INFORMATION</h2>

              <button
                type="button"
                className="shopInformation__closeBtn"
                onClick={closePopup}
              >
                <FaTimes />
              </button>
            </div>

            <div className="shopInformation__formGrid">
              <div className="shopInformation__formGroup">
                <label>Shop Name *</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="shopInformation__formGroup">
                <label>Mob. No *</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>

              <div className="shopInformation__formGroup">
                <label>GST No</label>
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleInputChange}
                />
              </div>

              <div className="shopInformation__formGroup">
                <label>Select State *</label>
                <div className="shopInformation__select">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Odisha">Odisha</option>
                  </select>
                  <FaChevronDown />
                </div>
              </div>

              <div className="shopInformation__formGroup">
                <label>Select City *</label>
                <div className="shopInformation__select">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="Agra">Agra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bhubaneswar">Bhubaneswar</option>
                  </select>
                  <FaChevronDown />
                </div>
              </div>

              <div className="shopInformation__formGroup">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="shopInformation__formGroup">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="shopInformation__formGroup">
                <label>Remark</label>
                <input
                  type="text"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="shopInformation__popupFooter">
              <button
                type="button"
                className="shopInformation__cancelBtn"
                onClick={closePopup}
              >
                Cancel
              </button>

              <button type="submit" className="shopInformation__saveBtn">
                {editData ? "Modify" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShopInformation;