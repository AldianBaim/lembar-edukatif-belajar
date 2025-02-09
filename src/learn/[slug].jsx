import { Link, useNavigate, useParams } from "react-router";
import Layout from "../components/global/Layout";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore"; // Pastikan impor yang benar

function Detail() {
	const { slug } = useParams();
	const [lesson, setLesson] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (slug) {
			fetchDetail(slug);
		}
	}, [slug]);

	const fetchDetail = async (lessonId) => {
		setLoading(true);
	
		try {
			Swal.fire({
				title: "Loading...",
				text: "Mengambil data lesson, harap tunggu",
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});
			// Buat query untuk mencari dokumen berdasarkan field "id"
			const q = query(collection(db, "lessons"), where("id", "==", lessonId));
			const querySnapshot = await getDocs(q);
	
			if (!querySnapshot.empty) {
				// Ambil data dari dokumen pertama yang ditemukan
				const lessonData = querySnapshot.docs[0].data();
				setLesson(lessonData);
				Swal.close();
			} else {
				setLesson(null);
				Swal.fire({
					icon: "error",
					// title: "Data Tidak Ditemukan",
					text: "QR Code tidak ditemukan.",
					confirmButtonText: "Scan QR Ulang",
				}).then((result) => {
					if (result.isConfirmed) {
						navigate("/learn");
					}
				});
			}
		} catch (error) {
			Swal.fire("Error", "Terjadi kesalahan dalam mengambil data!", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<Link to="/learn" className="text-decoration-none text-primary mb-3">
				<div>&larr; Kembali</div>
			</Link>
			<div>
				{
					lesson?.type === "video" && (
						<video className="w-100 mb-3 mt-3" height="240" controls>
							<source src={lesson?.source} type="video/mp4"/>
						</video>
					)
				}

				<h4>{lesson?.title}</h4>
				<p>{lesson?.content}</p>
			</div>
		</Layout>
	);
}

export default Detail;
