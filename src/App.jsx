import { Link, useNavigate } from "react-router";
import Layout from "./components/global/Layout";
import { useEffect, useState } from "react";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();
  // Check localstorage
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = JSON.parse(token);
        if (userData.role === "admin") {
          setShowAdmin(true);
        }
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      setShowAdmin(false);
    }
  }, []);

  return (
    <Layout>
      <div className="text-center">
        <h6>LembarEdukatif</h6>
        <h2 className="fw-bold mb-2">Mengenal Huruf</h2>
        <img
          src="/image/maskot-lembaredukatif.png"
          width={230}
          className="mb-3"
          alt=""
        />
      </div>

      <Link to="/learn" className="text-decoration-none">
        <button
          className="btn border-0 p-3 py-5 px-5 w-100 w-lg-75 mx-auto mb-3"
          style={{ borderRadius: "20px", backgroundColor: "#A1C265" }}
        >
          <div className="text-white">SCAN KARTU</div>
        </button>
      </Link>

      <Link to="/quiz" className="text-decoration-none">
        <button
          className="btn border-0 p-3 py-5 px-5 w-100 w-lg-75 mx-auto mb-3"
          style={{ borderRadius: "20px", backgroundColor: "#EDAD43"  }}
        >
          <div className="text-white">TANTANGAN</div>
        </button>
      </Link>

      {showAdmin && (
        <Link to="/login" className="text-decoration-none text-dark">
          <button
            className="btn-custom rounded-pill p-3 px-5 w-100 w-lg-75 mx-auto mb-3"
            style={{ backgroundColor: "#EAEAEA" }}
          >
            <div className="text d-flex align-items-center">
              <img src="/image/admin.png" className="me-3" width={40} alt="" />
              <div className="text-dark">Admin</div>
            </div>
          </button>
        </Link>
      )}
    </Layout>
  );
}

export default App;
