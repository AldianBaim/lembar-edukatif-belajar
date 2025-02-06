import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Link } from "react-router";
import Layout from "./components/global/Layout";
// import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log("Decoded QR Code:", result.data);
        setQrResult(result.data);
        // Redirect to another page
        if (result.data) {
          window.location.href = result.data;
        }
      },
      { returnDetailedScanResult: true, highlightScanRegion: true, highlightCodeOutline: true, highlightScanRegionOutline: true }
    );

    qrScanner.start();

    return () => {
      qrScanner.stop();
    };
  }, []);

  return (
    <Layout>
      <div className="text-end">
        <img src="/image/setting.png" width={30} alt="" />
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
            <div>Mulai Belajar</div>
          </div>
        </button>
      </Link>

      <Link to="/challenge" className="text-decoration-none text-dark">
        <button className="btn-custom rounded-pill p-3 px-5 w-100 w-lg-75 mx-auto mb-3" style={{ backgroundColor: "#ECCBCD" }}>
          <div className="text d-flex align-items-center">
            <img src="/image/archery.png" className="me-3" width={40} alt="" />
            <div>Tantangan</div>
          </div>
        </button>
      </Link>

      

    </Layout>
  );
}

export default App;
