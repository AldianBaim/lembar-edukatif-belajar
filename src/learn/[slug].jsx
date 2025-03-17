import { Link, useNavigate, useParams } from "react-router";
import Layout from "../components/global/Layout";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore"; // Pastikan impor yang benar

function Detail() {
	const { slug } = useParams();
	const [lesson, setLesson] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (slug) {
			fetchDetail(slug);
		}
	}, [slug]);

	const fetchDetail = async (lessonId) => {
	    Swal.fire({
	      title: "Loading...",
	      text: "Mengambil data lesson, harap tunggu",
	      allowOutsideClick: false,
	      didOpen: () => {
	        Swal.showLoading();
	      }
	    });
	  
	    try {
	      const q = query(collection(db, "lessons"), where("id", "==", lessonId));
	      const querySnapshot = await getDocs(q);
	
	      if (!querySnapshot.empty) {
	        const lessonData = querySnapshot.docs[0].data();
	        // Add artificial delay
	        await new Promise(resolve => setTimeout(resolve, 1000));
	        setLesson(lessonData);
	        Swal.close();
	      } else {
	        setLesson(null);
	        Swal.fire({
	          icon: "error",
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
	    }
	  };

	return (
		<Layout>
			<Link to="/learn" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "45px"}}>
				<img src="/image/arrow-back.svg" width={25}/>
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
			<Link to="/learn" className="text-decoration-none mt-5 d-block">
				<button
				className="btn btn-orange rounded-3 border-0 p-3 py-2 px-5 w-100 w-lg-75 mx-auto mb-3"
				>
				<div className="text-white">Scan Kartu Lain</div>
				</button>
			</Link>
		</Layout>
	);
}

export default Detail;
