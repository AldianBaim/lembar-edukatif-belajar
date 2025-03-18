import React, { useState, useEffect } from "react";
import {
  db,
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where, // Import where
} from "../../firebase"; // Pastikan path ini benar
import Layout from "../../components/global/Layout";
import Swal from "sweetalert2";
import { Link } from "react-router";

function LessonsModule() {
  const [lessons, setLessons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("text"); // text, video, image
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lessons"));
      const lessonData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLessons(lessonData);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setError("Gagal memuat data pelajaran.");
    }
  };

  const resetForm = () => {
    setId("");
    setTitle("");
    setType("text");
    setContent("");
    setSource("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !title || !content) {
      setError("Mohon lengkapi semua data!");
      return;
    }

    try {
      if (editMode) {
        // Update existing lesson

        //Query snapshot
        const lessonCollection = collection(db, "lessons");
        const q = query(lessonCollection, where("id", "==", currentId));

        //Get Data
        const querySnapshot = await getDocs(q);

        // looping data
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            id,
            title,
            type,
            content,
            source,
            description,
          });
        });

        Swal.fire("Berhasil!", "Data pelajaran berhasil diubah.", "success");
      } else {
        // Create new lesson
        await addDoc(collection(db, "lessons"), {
          id,
          title,
          type,
          content,
          source,
          description,
        });
        Swal.fire("Berhasil!", "Pelajaran berhasil ditambahkan.", "success");
      }
      await fetchLessons(); // Reload data
      setShowForm(false);
      setEditMode(false);
      resetForm();
    } catch (error) {
      console.error("Error menyimpan data pelajaran:", error);
      setError("Gagal menyimpan data pelajaran.");
      Swal.fire("Error!", "Gagal menyimpan data pelajaran.", "error");
    }
  };

  const handleEdit = (lesson) => {
    setEditMode(true);
    setShowForm(true);
    setCurrentId(lesson.id);
    setId(lesson.id);
    setTitle(lesson.title);
    setType(lesson.type);
    setContent(lesson.content);
    setSource(lesson.source);
    setDescription(lesson.description);
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
          await deleteDoc(doc(db, "lessons", id));
          setLessons((prevLessons) =>
            prevLessons.filter((lesson) => lesson.id !== id)
          );
          await fetchLessons(); // Reload data
          Swal.fire("Berhasil!", "Pelajaran berhasil dihapus.", "success");
        } catch (error) {
          console.error("Error menghapus pelajaran:", error);
          setError("Gagal menghapus pelajaran.");
          Swal.fire("Error!", "Gagal menghapus pelajaran.", "error");
        }
      }
    });
  };

  return (
    <Layout>
      <Link
        to="/admin/dashboard"
        className="text-decoration-none text-primary position-absolute top-0" style={{marginTop: "27px"}}
      >
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>
      <div className="mt-3">
        <h3 className="mb-4">Kelola Pelajaran</h3>
        <div className="text-end">
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              resetForm();
            }}
            className="btn btn-sm btn-success mb-3 d-flex align-items-center gap-1 ms-auto"
          >
            <i className="bi bi-plus-circle"></i> Tambah Pelajaran
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="card p-4 shadow mb-3">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">ID:</label>
              <input
                type="text"
                className="form-control"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                placeholder="Input ID pelajaran"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Judul:</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Input judul pelajaran"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipe:</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Konten:</label>
              <textarea
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
                required
                placeholder="Input konten pelajaran"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Sumber:</label>
              <input
                type="text"
                className="form-control"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Input sumber pelajaran (opsional)"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Deskripsi:</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
                placeholder="Input deskripsi pelajaran (opsional)"
              />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button type="submit" className="btn btn-primary">
                {editMode ? "Update" : "Simpan"}
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
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID</th>
                  <th>Judul</th>
                  {/* <th>Tipe</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson.id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{lesson.id}</td>
                    <td width={150}>{lesson.title}</td>
                    {/* <td>{lesson.type}</td> */}
                    <td>
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="btn btn-sm btn-primary me-1 mb-1"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
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

export default LessonsModule;
