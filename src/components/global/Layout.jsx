import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

function Layout({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (checkToken) {
      setIsLoggedIn(true);
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    Swal.fire({
      icon: "success",
      title: "Logout Berhasil",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="row justify-content-center p-3 bg-primary position-relative" style={{ minHeight: "100vh" }}>
      <div className="col-lg-4 py-3">
        {isLoggedIn && (
          <div className="text-end">
            <div className="dropdown">
              <button
                className="btn dropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src="/image/setting.png" width={30} alt="" />
              </button>
              <ul className="dropdown-menu bg-orange">
                <li className="border-bottom">
                  <Link
                    to="/change-password"
                    className="dropdown-item text-decoration-none text-white"
                  >
                    Ganti Password
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item text-decoration-none text-white"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Layout;
