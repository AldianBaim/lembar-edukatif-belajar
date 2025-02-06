import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import Layout from "./components/global/Layout";

function Learn() {

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
					window.open(result.data, '_blank');
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
			<video ref={videoRef} className="w-100 rounded" />
      <p><strong>Hasil Scan:</strong> {qrResult || "Belum ada hasil"}</p>
		</Layout>
	);
}

export default Learn;
