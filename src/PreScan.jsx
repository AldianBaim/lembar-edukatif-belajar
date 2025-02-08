import { Link } from "react-router";
import Layout from "./components/global/Layout";

export default function PreScan() {
	return (
		<Layout>
			<Link to="/" className="text-decoration-none text-primary mb-1">
				<div>&larr; Kembali</div>
			</Link>
			<h5 className="text-center">Lembar Edukatif</h5>

			<div className="card bg-success-subtle">
				<div className="card-body">
					{/* Petunjuk penggunaan scan qr code */}
					<div className="">
						<p className="fw-bold">Petunjuk Penggunaan Scan QR Code</p>
						<ol>
							<li>Aktifkan akses kamera pada perangkat</li>
							<li>Scan QR Code yang terdapat pada kartu</li>
							<li>Anda akan diarahkan ke halaman pembelajaran</li>
						</ol>
						<div className="text-center">
							<Link to="/learn" className="btn btn-sm btn-outline-primary">Mulai Belajar</Link>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}