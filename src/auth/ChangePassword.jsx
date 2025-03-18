import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
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
// Import Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

function ChangePassword() {
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

    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      setError("Mohon masukkan semua data.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Password baru dan konfirmasi password baru tidak cocok.");
      return;
    }

    try {
      // **1. Cari pengguna berdasarkan email di collection `users`**
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

      // Asumsikan hanya ada satu pengguna dengan email tersebut
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const userRef = doc(db, "users", userDoc.id);

      // **2. Verifikasi password lama**
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

      // **3. Hash password baru**
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // **4. Update password di collection `users` dengan password yang di-hash**
      await updateDoc(userRef, {
        password: hashedPassword,
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
      <Link to="/" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "27px"}}>
				<img src="/image/arrow-back.svg" width={25}/>
			</Link>
      <div className="mt-3">
        <div className="text-center mb-3">
          <h4 className="fw-bold">Ganti Password</h4>
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
              type="text"
              className="form-control border-0 p-3 rounded-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password Lama:</label>
            <div className="input-group">
              <input
                type={showOldPassword ? "text" : "password"}
                className="form-control border-0 p-3 rounded-start-4"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password lama"
                required
              />
              <button
                className="btn btn-orange"
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <i
                  className={`bi ${
                    showOldPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password Baru:</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control border-0 p-3 rounded-start-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                required
              />
              <button
                className="btn btn-orange"
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i
                  className={`bi ${
                    showNewPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Ulangi Password Baru:</label>
            <div className="input-group">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                className="form-control border-0 p-3 rounded-start-4"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Ulangi password baru"
                required
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
        {/* <div className="mt-3 text-center text-dark">
          <Link to="/" className="text-dark text-decoration-none">
            Kembali ke Beranda
          </Link>
        </div> */}
      </div>
    </Layout>
  );
}

export default ChangePassword;
