import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import Layout from "../components/global/Layout";
import { Link, useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure this path is correct

function Learn() {
  const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDetail = async (lessonId) => {
    setLoading(true);
    try {
      const q = query(collection(db, "lessons"), where("id", "==", lessonId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lessonData = querySnapshot.docs[0].data();
        Swal.close();
        navigate(`${lessonId}`); // Adjust this path according to your routing
      } else {
        Swal.fire({
          icon: "error",
          text: "QR Code tidak ditemukan.",
          confirmButtonText: "Scan QR Ulang",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan dalam mengambil data!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkPermissionsAndStart() {
      try {
        const permission = await navigator.permissions.query({
          name: "camera",
        });

        if (permission.state === "denied") {
          setError(
            "Akses kamera ditolak! Harap izinkan akses di pengaturan browser."
          );
          Swal.fire({
            icon: 'warning',
            title: 'Akses Kamera Ditolak',
            text: 'Harap izinkan akses di pengaturan perangkat.',
            confirmButtonColor: '#3085d6',
          });
          return;
        }

        if (videoRef.current) {
          const qrScanner = new QrScanner(
            videoRef.current,
            (result) => {
              console.log("Decoded QR Code:", result.data);
              setQrResult(result.data);
              if (result.data) {
                fetchDetail(result.data);
              }
            },
            {
              returnDetailedScanResult: true,
              highlightScanRegion: true,
              highlightCodeOutline: true,
              highlightScanRegionOutline: true,
              maxScansPerSecond: 1,
            }
          );

          qrScanner.start();

          return () => qrScanner.stop();
        }
      } catch (err) {
        setError("Browser tidak mendukung izin kamera atau akses ditolak.");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Browser tidak mendukung izin kamera atau akses ditolak.',
          confirmButtonColor: '#3085d6',
        });
      }
    }

    checkPermissionsAndStart();
  }, []);

  return (
    <Layout>
      <Link to="/" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "27px"}}>
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>
      <div className="mt-4 small text-muted text-center">
        Aktifkan akses kamera pada perangkat, <br /> kemudian scan QR Code yang
        terdapat pada <br /> sisi bagian belakang kartu.
      </div>
      
      {error ? (
        // <p className="mt-3" style={{ color: "red" }}>
        //   {error}
        // </p>
        <div className="text-center mt-5">
          <img src="/image/Subtract.svg" width={300} alt="" />
        </div>
      ) : (
        <video
          className="mt-5 ms-lg-3"
          ref={videoRef}
          style={{ 
            width: "100%", 
            maxWidth: "400px",
            display: "block",
            margin: "20px auto"
          }}
        />
      )}
      <p>{qrResult}</p>
    </Layout>
  );
}

export default Learn;
