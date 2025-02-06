import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import Layout from "./components/global/Layout";

function Learn() {

	const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState("");
  const [error, setError] = useState("");

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
							window.open(result.data, '_blank');
            },
            { returnDetailedScanResult: true }
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
			{error ? <p style={{ color: "red" }}>{error}</p> : <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} />}
      <p><strong>Hasil Scan:</strong> {qrResult || "Belum ada hasil"}</p>
		</Layout>
	);
}

export default Learn;
