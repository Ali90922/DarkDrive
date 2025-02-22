import { useState, useEffect } from "react";
import axios from "axios";
import KeyModal from "../components/KeyModal";
import FileUpload from "../components/FileUpload";

const Dashboard = () => {
	const [files, setFiles] = useState([]);
	const [key, setKey] = useState(null); // store the entered key
	const [file, setFile] = useState(null);
	const [getKey, showGetKey] = useState(false); // state to show/hide the key modal

	// Base URL for file listing and upload (from server.py)
	const API_URL = import.meta.env.VITE_FILE_API_URL;
	// Separate base URL for downloads (from download_api.py)
	const DOWNLOAD_API_URL = import.meta.env.VITE_DOWNLOAD_API_URL;

	useEffect(() => {
		const getUserData = async () => {
			try {
				const email = localStorage.getItem("email") || "demo@example.com";
				const response = await axios.get(`${API_URL}/users/files/${email}`);
				setFiles(response.data.files);
			} catch (err) {
				console.error("Error fetching files:", err);
			}
		};

		getUserData();
	}, []);

	const handleDownload = async (file) => {
		if (!key) {
			showGetKey(true); // Show the key modal if the key is not provided
			return;
		}

		// Proceed with downloading the file once the key is provided
		console.log("handleDownload called for file:", file);
		try {
			const downloadUrl = `${DOWNLOAD_API_URL}/download/${encodeURIComponent(
				file
			)}/${encodeURIComponent(key)}`;
			const response = await axios.get(downloadUrl, { responseType: "blob" });
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", file); // specify the file name
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Error downloading file:", err);
		}
	};

	// Handle the encryption key submission
	const handleKeySubmit = (enteredKey) => {
		if (enteredKey) {
			setKey(enteredKey);
			showGetKey(false);

			setTimeout(() => {
				console.log(key); // This still prints the old value
			}, 0);

			setKey((prevKey) => {
				console.log(prevKey); // This prints the latest value!
				return enteredKey;
			});
		} else {
			console.log("Encryption key not provided, download canceled.");
		}
	};

	const closeModal = () => {
		showGetKey(false);
	};

	return (
		<main className='flex'>
			<section>
				<FileUpload />
			</section>
			<section className='p-6 w-5/6'>
				{/* Show Key Modal when `getKey` is true */}
				{getKey && <KeyModal onSubmit={showGetKey} file={file} />}

				<ul className='max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-2 border-gray-700'>
					{files.length > 0 ? (
						files.map((file, index) => (
							<li
								key={index}
								className='flex justify-between bg-white/10 p-2 px-4 rounded-md hover:bg-white/5 transition'
							>
								<p>{file.slice(0, -4)}</p>
								<button
									onClick={() => {
										setFile(file);
										showGetKey(true);
									}}
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
