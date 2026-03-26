import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function ExamTypeAdmin() {
  const [examTypes, setExamTypes] = useState([]);
  const [name, setName] = useState("");

  const fetchExamTypes = async () => {
    const res = await API.get("/exam-types");
    setExamTypes(res.data.data || []);
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return;

    await API.post("/exam-types", { name });

    setName("");
    fetchExamTypes();
  };

  const togglePublish = async (id) => {
    await API.put(`/exam-types/toggle/${id}`);
    fetchExamTypes();
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Delete exam?")) return;

    await API.delete(`/exam-types/${id}`);
    fetchExamTypes();
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">Exam Type Management</h1>

      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Exam Name"
          className="border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2">
          Add
        </button>
      </form>

      {examTypes.map((exam) => (
        <div
          key={exam._id}
          className="flex justify-between border p-2 mb-2"
        >
          <span>{exam.name}</span>

          <div className="space-x-3">
            <button
              onClick={() => togglePublish(exam._id)}
              className={
                exam.isPublished
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {exam.isPublished ? "Published" : "Unpublished"}
            </button>

            <button
              onClick={() => deleteExam(exam._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}