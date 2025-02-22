import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import axios from "axios";

const Dashboard = () => {
	const [files, setFiles] = useState([]);

	// Base URL for file listing and upload (from server.py)
	const API_URL = import.meta.env.VITE_FILE_API_URL;
	// Separate base URL for downloads (from download_api.py)
	const DOWNLOAD_API_URL = import.meta.env.VITE_DOWNLOAD_API_URL;

	useEffect(() => {
		const getUserData = async () => {
			try {
				const email = localStorage.getItem("email") || "demo@example.com";
				const response = await axios.get(`${API_URL}/users/files/${email}`);
				console.log("Files received:", response.data.files);
				setFiles(response.data.files);
			} catch (err) {
				console.error("Error fetching files:", err);
			}
		};

		getUserData();
	}, []);

	// Function to download file using axios from the separate download API
	const handleDownload = async (file) => {
		console.log("handleDownload called for file:", file);
		try {
			const downloadUrl = `${DOWNLOAD_API_URL}/download/${encodeURIComponent(file)}`;
			console.log("Calling download API at:", downloadUrl);
			const response = await axios.get(downloadUrl, { responseType: "blob" });
			console.log("Download API response received:", response);

			// Create a URL from the blob
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", file); // specify the file name
			document.body.appendChild(link);
			link.click();
			// Clean up
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Error downloading file:", err);
		}
	};

	return (
		<main className='flex'>
			<section>
				<FileUpload />
			</section>
			<section className='p-6 w-5/6'>
				<ul className='max-h-screen flex flex-col gap-4 border-gray-700'>
					{files.length > 0 ? (
						files.map((file, index) => (
							<li key={index} className='flex justify-between border-b-2 py-1 transition'>
								<p>{file.slice(0, -4)}</p>
								<button
									onClick={() => handleDownload(file)}
									className='cursor-pointer w-fit p-0 bg-transparent text-accent underline'
								>
									Download
								</button>
							</li>
						))
					) : (
						<p>Add files to show.</p>
					)}
				</ul>
			</section>
		</main>
	);
};

export default Dashboard;
