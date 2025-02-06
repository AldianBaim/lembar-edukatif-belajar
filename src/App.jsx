import { Link } from "react-router";
import Layout from "./components/global/Layout";

function App() {

  return (
    <Layout>
      <div className="text-end">
        <Link to="/setting" className="text-decoration-none text-dark">
          <img src="/image/setting.png" width={30} alt="" />
        </Link>
      </div>
      <div className="text-center">
        <h5>Lembar Edukatif</h5>
        <h3 className="fw-bold mb-5">Mengenal Alfabet</h3>
        <img src="https://cdn.pixabay.com/photo/2023/10/18/22/47/owl-8325215_960_720.png" width={200} className="mb-5" alt="" />
      </div>

      <Link to="/learn" className="text-decoration-none text-dark">
        <button className="btn-custom rounded-pill p-3 px-5 w-100 w-lg-75 mx-auto mb-3" style={{ backgroundColor: "#A1DDD1" }}>
          <div className="text d-flex align-items-center">
            <img src="/image/qr-code.png" className="me-3" width={40} alt="" />
            <div className="text-dark">Mulai Belajar</div>
          </div>
        </button>
      </Link>

      <Link to="/challenge" className="text-decoration-none text-dark">
        <button className="btn-custom rounded-pill p-3 px-5 w-100 w-lg-75 mx-auto mb-3" style={{ backgroundColor: "#ECCBCD" }}>
          <div className="text d-flex align-items-center">
            <img src="/image/archery.png" className="me-3" width={40} alt="" />
            <div className="text-dark">Tantangan</div>
          </div>
        </button>
      </Link>

    </Layout>
  );
}

export default App;
