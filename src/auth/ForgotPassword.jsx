import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth"; // Hanya import getAuth
import {
  db,
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "../firebase"; // Import db, doc, updateDoc, getDocs, collection
import { Link } from "react-router";
import Swal from "sweetalert2";
import Layout from "../components/global/Layout";
import bcrypt from "bcryptjs";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // State untuk password baru
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !newPassword) {
      setError("Mohon masukkan email dan password baru.");
      return;
    }

    try {
      // **1. Cari pengguna berdasarkan email di collection `users`**
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email)); // Import `query` dan `where` dari Firebase
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          icon: "error",
          text: "Email tidak ditemukan.",
        });
        return;
      }

      // Asumsikan hanya ada satu pengguna dengan email tersebut
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);

      // **2. Update password di collection `users` (TANPA ENKRIPSI!)**
      await updateDoc(userRef, {
        password: bcrypt.hashSync(newPassword, 10), // **PASSWORD DISIMPAN TANPA ENKRIPSI!**
        lastPasswordReset: new Date(),
      });

      setMessage(
        "Password berhasil diubah. Silakan login dengan password baru Anda."
      );
      Swal.fire(
        "Berhasil!",
        "Password berhasil diubah. Silakan login dengan password baru Anda.",
        "success"
      );
    } catch (error) {
      console.error("Error mengubah password:", error);
      Swal.fire("Error!", "Gagal mengubah password.", "error");
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("token"));
    if (data) {
      setEmail(data.email);
    }
  }, []);

  return (
    <Layout>
      <div className="">
        <div className="text-center mb-3">
          <h6>Forgot Password</h6>
          <img
            src="/image/maskot-lembaredukatif.png"
            width={200}
            alt="Mascot"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password Baru:</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-orange">
              Ubah Password
            </button>
          </div>
        </form>
        <div className="mt-3 text-center text-dark">
          <Link to="/" className="text-dark text-decoration-none">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
