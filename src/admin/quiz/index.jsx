import React, { useState, useEffect } from "react";
import {
  db,
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "../../firebase";
import Layout from "../../components/global/Layout";
import Swal from "sweetalert2";
import { Link } from "react-router";

function QuizzesModule() {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [type, setType] = useState("text");
  const [optionType, setOptionType] = useState("text");
  const [embed, setEmbed] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      const quizData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizData);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Gagal memuat pertanyaan.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", ""]);
    setCorrectAnswer("");
    setType("text");
    setEmbed(null);
    setOptionType("text");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.includes("") || !correctAnswer) {
      setError("Mohon lengkapi semua data!");
      return;
    }

    try {
      if (editMode) {
        await updateDoc(doc(db, "quizzes", currentId), {
          question,
          options,
          correctAnswer,
          type,
          embed,
          optionType,
        });
        Swal.fire("Berhasil!", "Pertanyaan berhasil diubah.", "success");
      } else {
        await addDoc(collection(db, "quizzes"), {
          question,
          options,
          correctAnswer,
          type,
          embed,
          optionType,
        });
        Swal.fire("Berhasil!", "Pertanyaan berhasil ditambahkan.", "success");
      }
      await fetchQuestions(); // Reload data
      setShowForm(false);
      setEditMode(false);
      resetForm();
    } catch (error) {
      console.error("Error menyimpan pertanyaan:", error);
      setError("Gagal menyimpan pertanyaan.");
      Swal.fire("Error!", "Gagal menyimpan pertanyaan.", "error");
    }
  };

  const handleEdit = (quiz) => {
    setEditMode(true);
    setShowForm(true);
    setCurrentId(quiz.id);
    setQuestion(quiz.question);
    setOptions(quiz.options);
    setCorrectAnswer(quiz.correctAnswer);
    setType(quiz.type);
    setEmbed(quiz.embed);
    setOptionType(quiz.optionType);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "quizzes", id));
          setQuizzes((prevQuizzes) =>
            prevQuizzes.filter((quiz) => quiz.id !== id)
          );
          await fetchQuestions(); // Reload data
          Swal.fire("Berhasil!", "Pertanyaan berhasil dihapus.", "success");
        } catch (error) {
          console.error("Error menghapus pertanyaan:", error);
          setError("Gagal menghapus pertanyaan.");
          Swal.fire("Error!", "Gagal menghapus pertanyaan.", "error");
        }
      }
    });
  };

  return (
    <Layout>
      <Link
        to="/admin/dashboard"
        className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "27px"}}
      >
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>
      <div className="mt-3">
        <h3 className="mb-4">Kelola Quiz</h3>
        <div className="text-end">
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false); // Ensure add mode
              resetForm(); // Reset the form
            }}
            className="btn btn-sm btn-success mb-3"
          >
            Tambah Pertanyaan
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card p-4 shadow mb-3">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Pertanyaan:</label>
              <input
                type="text"
                className="form-control"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                placeholder="Input pertanyaan"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Question Type:</label>
              <select
                onChange={(e) => setType(e.target.value)}
                value={type}
                className="form-select"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Embed (optional):</label>
              <input
                type="text"
                className="form-control"
                value={embed}
                onChange={(e) => setEmbed(e.target.value)}
                placeholder={
                  type === "image"
                    ? "Input URL gambar"
                    : type === "video"
                    ? "Input URL video"
                    : type === "audio"
                    ? "Input URL audio"
                    : ""
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Option Type:</label>
              <select
                onChange={(e) => setOptionType(e.target.value)}
                value={optionType}
                className="form-select"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>
            {options.map((option, index) => (
              <div key={index} className="mb-2">
                <label className="form-label">Pilihan {index + 1}:</label>
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  required
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Jawaban Benar:</label>
              <select
                className="form-select"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
              >
                <option value="">Pilih jawaban</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button type="submit" className="btn btn-primary">
                {editMode ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="btn btn-secondary ms-2"
              >
                Batal
              </button>
            </div>
          </form>
        )}
        {!showForm && (
          <div className="table-responsive">
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Pertanyaan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz.id}>
                    <td>{index + 1}</td>
                    <td>
                      {quiz.question}
                      {quiz.type === "audio" && quiz.embed && (
                        <div className="mt-2">
                          <audio controls>
                            <source src={quiz.embed} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </td>
                    <td width={100}>
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="btn btn-sm btn-primary me-1 mb-1"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="btn btn-sm btn-danger mb-1"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default QuizzesModule;
