import React from "react";
import { IMAGE_URL } from "../../api/axios";

const TeacherList = ({ teachers, onEdit, onDelete }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Teacher List</h2>

      {teachers.length === 0 ? (
        <p className="text-gray-500">No teachers added yet</p>
      ) : (
        <div className="overflow-auto flex-1 max-h-[600px]">
          <table className="min-w-[900px] w-full text-sm border">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">Photo</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Designation</th>
                <th className="p-2 text-left">Review</th>
                <th className="p-2 text-left">Rating</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id} className="border-b">
                  <td className="p-2">
                    <img
                      src={`http://localhost:5000${teacher.photo}`}
                      alt={teacher.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>

                  <td className="p-2">{teacher.name}</td>

                  <td className="p-2">{teacher.designation}</td>

                  <td className="p-2 max-w-[150px] truncate">
                    {teacher.review}
                  </td>

                  <td className="p-2">
                    {Array.from({ length: teacher.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </td>

                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => onEdit(teacher)}
                      className="bg-yellow-400 px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(teacher._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default TeacherList;
