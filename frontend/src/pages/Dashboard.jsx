import { useState, useEffect } from "react";
import axios from "axios";
import KeyModal from "../components/KeyModal";
import FileUpload from "../components/FileUpload";
import { Download, Trash2 } from "lucide-react";

const Dashboard = () => {
	const [files, setFiles] = useState([]);
	const [file, setFile] = useState(null);
	const [getKey, showGetKey] = useState(false); // state to show/hide the key modal

	// Base URL for file listing and upload (from server.py)
	const API_URL = import.meta.env.VITE_FILE_API_URL;

	const handleDelete = async (filename) => {
		try {
			const email = localStorage.getItem("email");
			const response = await axios.delete(`http://127.0.0.1:8001/delete/${email}/${filename}`);
		} catch (err) {}
	};

	useEffect(() => {
		const getUserData = async () => {
			try {
				const email = localStorage.getItem("email");
				// const response = await axios.get(`${API_URL}/users/files/${email}`);
				const response = await axios.get(`http://127.0.0.1:8001/users/files/${email}`);
				setFiles(response.data.files);
			} catch (err) {
				console.error("Error fetching files:", err);
			}
		};

		getUserData();
	}, []);

	return (
		<main className='flex flex-col md:flex-row md:flex-grow'>
			<section className='flex flex-col flex-grow'>
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
								<div className='flex gap-4'>
									<button
										title='Download'
										onClick={() => {
											setFile(file);
											showGetKey(true);
										}}
										className='cursor-pointer w-fit p-0 bg-transparent text-accent underline'
									>
										<Download />
									</button>
									<button
										onClick={() => handleDelete(file)}
										title='Delete'
										className='p-0 bg-transparent text-red-600'
									>
										<Trash2 />
									</button>
								</div>
							</li>
						))
					) : (
						<p className='text-lg font-bold'>Upload and securely store your files.</p>
					)}
				</ul>
			</section>
		</main>
	);
};

export default Dashboard;
