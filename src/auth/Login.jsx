import { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { db } from "../firebase"; // Import Firebase database instance
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard");
    }
  }, []);

  const login = async (event) => {
    event.preventDefault();

    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("token", "admin");
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang, admin!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        const token = {
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin",
        };
        localStorage.setItem("token", JSON.stringify(token));
        navigate("/");
      });
    } else {
      // Check firebase users collection
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email)); // Query by email only
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text: "Akun tidak ditemukan. Periksa email dan password Anda.",
          });
        } else {
          const userDoc = querySnapshot.docs[0]; // Get the first matching document
          const userData = userDoc.data();
          const hashedPassword = userData.password; // Assuming the hashed password field is named "password"

          bcrypt.compare(password, hashedPassword, function (err, result) {
            if (err) {
              console.error("Password comparison error:", err);
              Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: "Terjadi kesalahan saat memverifikasi kata sandi.",
              });
            } else if (result === true) {
              // Passwords match!
              const token = {
                name: userData.name,
                email: userData.email,
                role: userData.role,
              };
              localStorage.setItem("token", JSON.stringify(token));
              Swal.fire({
                icon: "success",
                title: "Login Berhasil",
                text: "Selamat datang!",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                navigate("/");
              });
            } else {
              // Passwords don't match
              Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: "Password salah.",
              });
            }
          });
        }
      } catch (error) {
        console.error("Firebase login error:", error);
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Terjadi kesalahan saat login.",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="text-center mb-3">
        <h6>Lembar Edukatif</h6>
        <img src="/image/maskot-lembaredukatif.png" width={200} alt="Mascot" />
      </div>
      <form className="w-100" onSubmit={login}>
        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn w-100 btn-orange mt-3">
          Login
        </button>
      </form>
    </Layout>
  );
}
