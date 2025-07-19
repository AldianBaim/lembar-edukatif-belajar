import { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default function Login() {

  // Credential include email or phone number
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard");
    }
  }, []);

  const login = async (event) => {
    event.preventDefault();

    // Bypass admin login
    const isAdminLogin = (credential === "admin@gmail.com" || credential === "085624865065") && password === "admin";
    
    if (isAdminLogin) {
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang, admin!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        const token = {
          name: "Admin",
          phone_number: "085624865066",
          email: "admin@gmail.com",
          role: "admin",
        };
        localStorage.setItem("token", JSON.stringify(token));
        navigate("/");
      });
    } else {
      try {
        // Detect credential is email or phone number
        const isEmail = credential.includes('@');
        const fieldToQuery = isEmail ? 'email' : 'phone_number';

        const usersRef = collection(db, "users");

        // Dynamic query based on credential to firestore
        const q = query(usersRef, where(fieldToQuery, "==", credential));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text: "Akun tidak ditemukan. Periksa Email/Nomor HP dan Password Anda.",
          });
        } else {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const hashedPassword = userData.password;

          bcrypt.compare(password, hashedPassword, function (err, result) {
            if (err) {
              console.error("Password comparison error:", err);
              Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: "Terjadi kesalahan saat memverifikasi kata sandi.",
              });
            } else if (result === true) {
              const token = {
                name: userData.name,
                phone_number: userData.phone_number,
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
      <section style={{ marginTop: "70px" }}>
        <div className="text-center mb-3">
          <h6>LembarEdukatif</h6>
          <img src="/image/maskot-lembaredukatif.png" width={250} alt="Mascot" />
        </div>
        <form className="w-100" onSubmit={login}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control border-0 p-3 rounded-4"
              id="credential"
              placeholder="Masukkan Email atau Nomor HP"
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control border-0 p-3 rounded-4"
              id="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn w-100 btn-orange mt-3 rounded-4 p-3">
            Login
          </button>
        </form>
        <div className="text-center mt-5">
          Belum punya akun? <a href="https://lembaredukatif.id" className="text-decoration-none fw-bold text-dark">Daftar sekarang</a>
        </div>
      </section>
    </Layout>
  );
}