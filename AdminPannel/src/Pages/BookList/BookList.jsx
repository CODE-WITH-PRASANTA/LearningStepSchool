import React, { useState } from "react";
import "./BookList.css";
import { Link } from "react-router-dom";

const BookList = () => {
  const booksData = [
    { title: "Rabbit & Turtle", number: "1", isbn: "1001", publisher: "", author: "", subject: "", rack: "", qty: 10, price: "", category: "", date: "2025-10-18" },
    { title: "??????? ?? ??????? ?? ?????", number: "1008", isbn: "-", publisher: "none", author: "A", subject: "Jain", rack: "", qty: 1, price: "", category: "none", date: "2020-08-01" },
    { title: "বলাকা", number: "0001", isbn: "PL0001", publisher: "", author: "", subject: "", rack: "", qty: 5, price: "", category: "", date: "2025-09-13" },
    { title: "Science workbook 7", number: "123456", isbn: "234567", publisher: "", author: "", subject: "", rack: "", qty: 1, price: "", category: "", date: "2025-05-08" },
    { title: "Science workbook 7", number: "0032", isbn: "9781108742818", publisher: "Cambridge", author: "Mary Jones", subject: "Science work book", rack: "2", qty: 72, price: "", category: "Science", date: "2024-05-09" },
    { title: "English learners book 7", number: "0015", isbn: "978521747424", publisher: "Cambridge", author: "Chris Barker", subject: "English", rack: "2", qty: 1, price: "", category: "english", date: "2024-05-09" },
    { title: "Mathematics Work Book 9", number: "0053", isbn: "9781108746502", publisher: "Cambridge", author: "Lynn Byrd", subject: "Maths", rack: "2", qty: 10, price: "50000", category: "", date: "2024-05-09" },
    { title: "java", number: "6254", isbn: "54", publisher: "fhfgh", author: "E balagurusamy", subject: "technical", rack: "486", qty: 7, price: "550", category: "ghc", date: "2024-04-25" },
    { title: "Hum Hindu Hai", number: "8976", isbn: "2234", publisher: "modi", author: "yogi", subject: "Hindu", rack: "3", qty: 23, price: "500", category: "puna", date: "2024-04-25" },
    { title: "test add book", number: "0101", isbn: "2468", publisher: "test publisher", author: "test author", subject: "story", rack: "", qty: 25, price: "$200", category: "", date: "2024-03-13" }
  ];

  const [search, setSearch] = useState("");

  const format = (v) => (v ? v : "-");
  const formatPrice = (price) => (!price ? "-" : price.includes("$") ? price : `₹ ${price}`);
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const autoCategory = (book) =>
    book.category || (book.title.toLowerCase().includes("science") ? "Science" : "-");

  const filteredBooks = booksData.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalQty = booksData.reduce((sum, b) => sum + b.qty, 0);

  return (
    <div className="book-page premium-container">
      <div className="page-header">
        <h2>Book List</h2>
        <span className="breadcrumb">Library / Book List</span>
      </div>

      <div className="stats-row">
        <div className="stats-box glass-card">Total Qty: {totalQty}</div>
        <div className="stats-box glass-card">Available Qty: {totalQty - 1}</div>
      </div>

      <div className="table-card glass-card">
        <div className="top-bar">
          <Link to="/add-book" className="add-btn premium-btn">+ Add Book</Link>

          <input
            type="text"
            className="search-input premium-input"
            placeholder="Search book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="book-table premium-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>BOOK TITLE</th>
                <th>BOOK NO</th>
                <th>ISBN</th>
                <th>PUBLISHER</th>
                <th>AUTHOR</th>
                <th>SUBJECT</th>
                <th>RACK</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={index} className="table-row">
                  <td><input type="checkbox" /></td>
                  <td>{format(book.title)}</td>
                  <td>{format(book.number)}</td>

                  <td>
                    <div className="barcode">
                      <div className="fake-barcode"></div>
                      <span>{format(book.isbn)}</span>
                    </div>
                  </td>

                  <td>{format(book.publisher)}</td>
                  <td>{format(book.author)}</td>
                  <td>{format(book.subject)}</td>
                  <td>{format(book.rack)}</td>

                  <td className="qty">{book.qty}</td>
                  <td>{formatPrice(book.price)}</td>

                  <td>{autoCategory(book)}</td>
                  <td>{formatDate(book.date)}</td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn premium-edit">Edit</button>
                      <button className="delete-btn premium-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default BookList;
