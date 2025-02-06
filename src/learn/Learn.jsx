import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import Layout from "../components/global/Layout";
import { Link, useNavigate } from "react-router";

function Learn() {

	const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState("");
  const [error, setError] = useState("");
	const navigate = useNavigate();

  useEffect(() => {
    async function checkPermissionsAndStart() {
      try {
        const permission = await navigator.permissions.query({ name: "camera" });

        if (permission.state === "denied") {
          setError("Akses kamera ditolak! Harap izinkan akses di pengaturan browser.");
          return;
        }

        if (videoRef.current) {
          const qrScanner = new QrScanner(
            videoRef.current,
            (result) => {
              console.log("Decoded QR Code:", result.data);
              setQrResult(result.data);
							if (result.data) {
                window.location.href = result.data;
							}

            },
            { returnDetailedScanResult: true, highlightScanRegion: true, highlightCodeOutline: true, highlightScanRegionOutline: true }
          );

          qrScanner.start();

          return () => qrScanner.stop();
        }
      } catch (err) {
        setError("Browser tidak mendukung izin kamera atau akses ditolak.");
      }
    }

    checkPermissionsAndStart();
  }, []);

	return (
		<Layout>
      <Link to="/" className="text-decoration-none text-primary">
        <div>&larr; Kembali</div>
      </Link>
			{error ? <p className="mt-3" style={{ color: "red" }}>{error}</p> : <video className="mt-3" ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} />}
      <p><strong>Hasil Scan:</strong> {qrResult || "Belum ada hasil"}</p>
		</Layout>
	);
}

export default Learn;
