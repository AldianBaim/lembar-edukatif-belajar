import { Link, useParams } from "react-router";
import Layout from "../components/global/Layout";

function Detail() {
	const { slug } = useParams();
	return (
		<Layout>
			<Link to="/" className="text-decoration-none text-primary">
        <div>&larr; Kembali</div>
      </Link>
			<h4 className="text-center mb-3 mt-3">Video Pembelajaran {slug}</h4>
			<div class="ratio ratio-16x9">
					<iframe c src="https://www.youtube.com/embed/-_3dgN-NVMg?si=unAUIZvq6_w5ypF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
			</div>
		</Layout>
	);
}

export default Detail