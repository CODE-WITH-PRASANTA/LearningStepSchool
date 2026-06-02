import React, { useState } from "react";
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

  return (
    <div className="shopInformation">

      <div className="shopInformation__card">

        <div className="shopInformation__header">

          <div className="shopInformation__search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search Shop..."
            />

          </div>

          <button
            className="shopInformation__addButton"
            onClick={openAddPopup}
          >
            <FaPlus />
          </button>

        </div>

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
                      onClick={() =>
                        openEditPopup(item)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="shopInformation__deleteBtn"
                      onClick={() =>
                        deleteShop(item.id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

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

          <div className="shopInformation__popup">

            <div className="shopInformation__popupHeader">

              <h2>
                SHOP INFORMATION
              </h2>

              <button
                className="shopInformation__closeBtn"
                onClick={closePopup}
              >
                <FaTimes />
              </button>

            </div>

            <div className="shopInformation__formGrid">

              <div className="shopInformation__formGroup">

                <label>
                  Shop Name *
                </label>

                <input
                  defaultValue={
                    editData?.shopName || ""
                  }
                />

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  Mob. No *
                </label>

                <input
                  defaultValue={
                    editData?.mobile || ""
                  }
                />

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  GST No
                </label>

                <input
                  defaultValue={
                    editData?.gst || ""
                  }
                />

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  Select State *
                </label>

                <div className="shopInformation__select">

                  <select
                    defaultValue={
                      editData?.state ||
                      "Uttar Pradesh"
                    }
                  >
                    <option>
                      Uttar Pradesh
                    </option>
                    <option>
                      Delhi
                    </option>
                    <option>
                      Odisha
                    </option>
                  </select>

                  <FaChevronDown />

                </div>

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  Select City *
                </label>

                <div className="shopInformation__select">

                  <select
                    defaultValue={
                      editData?.city ||
                      "Agra"
                    }
                  >
                    <option>
                      Agra
                    </option>
                    <option>
                      Delhi
                    </option>
                    <option>
                      Bhubaneswar
                    </option>
                  </select>

                  <FaChevronDown />

                </div>

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  Pincode *
                </label>

                <input
                  defaultValue={
                    editData?.pincode || ""
                  }
                />

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  Address
                </label>

                <input
                  defaultValue={
                    editData?.address || ""
                  }
                />

              </div>

              <div className="shopInformation__formGroup">

                <label>
                  Remark
                </label>

                <input
                  defaultValue={
                    editData?.remark || ""
                  }
                />

              </div>

            </div>

            <div className="shopInformation__popupFooter">

              <button
                className="shopInformation__cancelBtn"
                onClick={closePopup}
              >
                Cancel
              </button>

              <button
                className="shopInformation__saveBtn"
              >
                {editData
                  ? "Modify"
                  : "Add"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ShopInformation;