import { Link } from "react-router";
import Layout from "./components/global/Layout";

export default function PreScan() {
  return (
    <Layout>
      <div className="containter">
        <Link to="/" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "45px"}}>
          <img src="/image/arrow-back.svg" width={25}/>
        </Link>

        <div className="text-center text-muted mt-3">
          Aktifkan akses kamera pada perangkat, kemudian scan QR Code yang
          terdapat pada sisi bagian belakang kartu.
        </div>

        <div className="text-center mt-5">
          <img src="/image/subtract.png" width={300} alt="" />
        </div>

        <Link
          to="/learn"
          className="d-block text-center text-decoration-none btn-orange py-2 w-100 mt-5"
          style={{ borderRadius: "10px" }}
        >
          Scan Kartu
        </Link>
      </div>
    </Layout>
  );
}
