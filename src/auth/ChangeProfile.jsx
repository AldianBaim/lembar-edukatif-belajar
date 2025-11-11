import React, { useEffect, useState } from "react";
import {
  db,
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "../firebase";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Layout from "../components/global/Layout";
import bcrypt from "bcryptjs";
import "bootstrap-icons/font/bootstrap-icons.css";

function ChangeProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      Swal.fire({
        icon: "error",
        text: "Email tidak ditemukan.",
      });
      return;
    }

    try {
      // **1. Cari pengguna berdasarkan email**
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          icon: "error",
          text: "Email tidak ditemukan.",
        });
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userRef = doc(db, "users", userDoc.id);

      // Jika user ingin mengganti password
      if (newPassword || confirmNewPassword || oldPassword) {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
          Swal.fire({
            icon: "warning",
            text: "Mohon isi semua kolom password untuk mengganti password.",
          });
          return;
        }

        if (newPassword !== confirmNewPassword) {
          Swal.fire({
            icon: "warning",
            text: "Password baru dan konfirmasi password baru tidak cocok.",
          });
          return;
        }

        // Verifikasi password lama
        const isPasswordCorrect = await bcrypt.compare(
          oldPassword,
          userData.password
        );

        if (!isPasswordCorrect) {
          Swal.fire({
            icon: "error",
            text: "Password lama salah.",
          });
          return;
        }

        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update name + password
        await updateDoc(userRef, {
          name: name || userData.name,
          password: hashedPassword,
          lastPasswordReset: new Date(),
        });

        Swal.fire("Berhasil!", "Profil dan password berhasil diperbarui.", "success");
        setMessage("Profil dan password berhasil diperbarui.");
      } else {
        // Hanya update nama
        await updateDoc(userRef, {
          name: name || userData.name,
        });

        Swal.fire("Berhasil!", "Nama berhasil diperbarui.", "success");
        setMessage("Nama berhasil diperbarui.");
      }

    } catch (error) {
      console.error("Error mengubah profil:", error);
      Swal.fire("Error!", "Gagal mengubah profil.", "error");
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("token"));
    if (data) {
      setEmail(data.email);
      setName(data.name || "");
    }
  }, []);

  return (
    <Layout>
      <Link
        to="/"
        className="text-decoration-none text-primary position-absolute top-0 ms-2"
        style={{ marginTop: "27px" }}
      >
        <img src="/image/arrow-back.svg" width={25} />
      </Link>

      <div className="mt-3">
        <div className="text-center mb-3">
          <h4 className="fw-bold">Ganti Profil</h4>
          <img
            src="/image/maskot-lembaredukatif.png"
            width={200}
            alt="Mascot"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="text"
              className="form-control border-0 p-3 rounded-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>

          {/* Nama */}
          <div className="mb-3">
            <label className="form-label">Nama:</label>
            <input
              type="text"
              className="form-control border-0 p-3 rounded-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama baru"
            />
          </div>

          {/* Password Lama */}
          <div className="mb-3">
            <label className="form-label">Password Lama:</label>
            <div className="input-group">
              <input
                type={showOldPassword ? "text" : "password"}
                className="form-control border-0 p-3 rounded-start-4"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password lama (jika ingin ubah password)"
              />
              <button
                className="btn btn-orange"
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <i
                  className={`bi ${showOldPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Password Baru */}
          <div className="mb-3">
            <label className="form-label">Password Baru:</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control border-0 p-3 rounded-start-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru (opsional)"
              />
              <button
                className="btn btn-orange"
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i
                  className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div className="mb-3">
            <label className="form-label">Ulangi Password Baru:</label>
            <div className="input-group">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                className="form-control border-0 p-3 rounded-start-4"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Ulangi password baru (opsional)"
              />
              <button
                className="btn btn-orange"
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
              >
                <i
                  className={`bi ${
                    showConfirmNewPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <div className="d-grid mt-5">
            <button type="submit" className="btn p-3 rounded-4 btn-orange">
              Update
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ChangeProfile;
