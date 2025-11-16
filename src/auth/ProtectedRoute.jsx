import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ProtectedRoute = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect jika tidak ada token
      return;
    }

    if (adminOnly) {
      try {
        const userData = JSON.parse(token);
        if (userData.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Akses Ditolak",
            text: "Anda tidak memiliki izin untuk mengakses halaman admin.",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/"); // Redirect ke halaman utama
          });
          return;
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        navigate("/login");
        return;
      }
    }
  }, [token, navigate, adminOnly]);

  if (!token) return null;
  
  if (adminOnly) {
    try {
      const userData = JSON.parse(token);
      if (userData.role !== "admin") {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
