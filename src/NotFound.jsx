import { Link } from "react-router"

function NotFound () {
	return (
		<div class="container text-center d-flex align-items-center justify-content-center vh-100">
			<div>
				<h1 class="display-1 fw-bold">404</h1>
				<h3 class="text-danger">Oops! Halaman tidak ditemukan</h3>
				<p class="lead">Halaman yang Anda cari mungkin belum ada.</p>
				<Link to="/" class="btn btn-outline-primary mt-3">Kembali ke Beranda</Link>
			</div>
		</div>
	)
}

export default NotFound