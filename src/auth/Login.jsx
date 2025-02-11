import { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard");
    }
  }, []);

  const login = (event) => {
    event.preventDefault();

    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("token", "admin");
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang, admin!",
        timer: 2000,
      }).then(() => {
        navigate("/admin/dashboard");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Email atau password salah",
      });
    }
  };

  return (
    <Layout>
      <h3 className="text-center mb-4">Login</h3>
      <form className="w-100" onSubmit={login}>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
    </Layout>
  );
}
