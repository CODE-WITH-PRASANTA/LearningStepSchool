import React, { useEffect, useState } from "react";
import "./BookList.css";

const initialBooks = [
  {
    id: 1,
    title: "Science Workbook 7",
    number: "0032",
    isbn: "9781108742818",
    publisher: "Cambridge",
    author: "Mary Jones",
    subject: "Science",
    rack: "2",
    qty: 40,
    price: "₹450",
    category: "Academic",
    postDate: "12 Jan 2025",
  },
  {
    id: 2,
    title: "English Learners Book 7",
    number: "0015",
    isbn: "978521747424",
    publisher: "Oxford",
    author: "Chris Barker",
    subject: "English",
    rack: "1",
    qty: 30,
    price: "₹520",
    category: "Language",
    postDate: "05 Feb 2025",
  },
  {
    id: 3,
    title: "Mathematics Workbook 9",
    number: "0053",
    isbn: "9781108746502",
    publisher: "Cambridge",
    author: "Lynn Byrd",
    subject: "Maths",
    rack: "3",
    qty: 50,
    price: "₹600",
    category: "Academic",
    postDate: "20 Mar 2025",
  },
];

export default function BookList() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  useEffect(() => {
    const close = () => setOpenAction(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.number.includes(search)
  );

  const handleDelete = (id) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  return (
    <div className="bl-page">
      <div className="bl-card">
        <div className="bl-toolbar">
          <div className="bl-search">
            Search:
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>BOOK TITLE</th>
                <th>BOOK NUMBER</th>
                <th>ISBN NUMBER</th>
                <th>PUBLISHER</th>
                <th>AUTHOR</th>
                <th>SUBJECT</th>
                <th>RACK NUMBER</th>
                <th>QTY</th>
                <th>BOOK PRICE</th>
                <th>CATEGORIES</th>
                <th>POST DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map((b) => (
                <tr key={b.id}>
                  <td><input type="checkbox" /></td>
                  <td>{b.title}</td>
                  <td>{b.number}</td>
                  <td>{b.isbn}</td>
                  <td>{b.publisher}</td>
                  <td>{b.author}</td>
                  <td>{b.subject}</td>
                  <td>{b.rack}</td>
                  <td>{b.qty}</td>
                  <td>{b.price}</td>
                  <td>{b.category}</td>
                  <td>{b.postDate}</td>

                  <td className="bl-action-cell">
                    <div
                      className="bl-action-wrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="bl-action-btn"
                        onClick={() =>
                          setOpenAction(openAction === b.id ? null : b.id)
                        }
                      >
                        Action ▾
                      </button>

                      {openAction === b.id && (
                        <div className="bl-action-menu">
                          <div>View</div>
                          <div>Edit</div>
                          <div onClick={() => handleDelete(b.id)}>Delete</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bl-footer">
          Showing {filteredBooks.length} entries
        </div>
      </div>
    </div>
  );
}
