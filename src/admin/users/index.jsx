import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "../../firebase"; // Pastikan path ini benar
import Layout from "../../components/global/Layout";
import Swal from "sweetalert2";
import { Link } from "react-router";
import bcrypt from "bcryptjs";

function UsersModule() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Gagal memuat data pengguna.");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRole("user");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !role) {
      setError("Mohon lengkapi semua data (kecuali password saat update)!");
      return;
    }

    if (!editMode && !password) {
      setError("Password wajib diisi saat menambahkan pengguna baru!");
      return;
    }

    try {
      let userDataToUpdate = {
        name,
        email,
        phone_number: phone,
        role,
        updated_at: new Date(),
      };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        userDataToUpdate.password = hashedPassword;
      }

      if (editMode) {
        // Update existing user
        await updateDoc(doc(db, "users", currentId), userDataToUpdate);
        Swal.fire("Berhasil!", "Data pengguna berhasil diubah.", "success");
      } else {
        // Create new user (hash password selalu)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        userDataToUpdate = {
          name,
          email,
          phone_number: phone,
          password: hashedPassword,
          role,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await addDoc(collection(db, "users"), userDataToUpdate);
        Swal.fire("Berhasil!", "Pengguna berhasil ditambahkan.", "success");
      }
      await fetchUsers(); // Reload data
      setShowForm(false);
      setEditMode(false);
      resetForm();
    } catch (error) {
      console.error("Error menyimpan data pengguna:", error);
      setError("Gagal menyimpan data pengguna.");
      Swal.fire("Error!", "Gagal menyimpan data pengguna.", "error");
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setShowForm(true);
    setCurrentId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone_number || "");
    setRole(user.role);
    setPassword("");
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
          await deleteDoc(doc(db, "users", id));
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          await fetchUsers(); // Reload data
          Swal.fire("Berhasil!", "Pengguna berhasil dihapus.", "success");
        } catch (error) {
          console.error("Error menghapus pengguna:", error);
          setError("Gagal menghapus pengguna.");
          Swal.fire("Error!", "Gagal menghapus pengguna.", "error");
        }
      }
    });
  };

  return (
    <Layout>
      <Link
        to="/admin/dashboard"
        className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "45px"}}
      >
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>
      <div className="mt-3">
        <h3 className="mb-4">Kelola Pengguna</h3>
        <div className="text-end">
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              resetForm();
            }}
            className="btn btn-sm btn-success mb-3"
          >
            Tambah Pengguna
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card p-4 shadow mb-3">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Input name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Input email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number:</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Input phone number"
                pattern="[0-9]*"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input password"
                required={!editMode} // Password wajib saat tambah
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role:</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
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
                className="btn btn-secondary"
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
                  <th>Nama</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Hapus
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

export default UsersModule;
