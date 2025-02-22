import { useRef } from "react";
import axios from "axios";

const KeyModal = ({ onSubmit, file }) => {
	const inputRef = useRef();

	const URL = import.meta.env.VITE_DOWNLOAD_API_URL;
	const downloadFile = async () => {
		console.log(localStorage.getItem("key"));
		try {
			const response = await axios.get(`${URL}/download`, {
				params: {
					filename: file,
					key: localStorage.getItem("key"),
				},
				responseType: "blob", // Important! Treat response as binary data
			});

			// Create a Blob from the response data
			const blob = new Blob([response.data], { type: "application/octet-stream" });

			// Create a download link and click it
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", file.slice(0, -4)); // Change filename accordingly
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Cleanup
			onSubmit();
		} catch (err) {
			console.log("Download failed:", err);
		}
	};

	return (
		<div className='absolute bg-primary flex flex-col items-center justify-center p-32 rounded-3xl gap-8'>
			<h1>Enter the Encryption Key</h1>
			<input ref={inputRef} className='w-full' />
			<span className='flex w-full justify-between'>
				<button onClick={() => onSubmit(onSubmit())} className='bg-white/50'>
					Cancel
				</button>
				<button
					onClick={() => {
						localStorage.setItem("key", inputRef.current.value);
						downloadFile();
						// onSubmit(inputRef.current.value);
					}}
				>
					Send
				</button>
			</span>
		</div>
	);
};

export default KeyModal;
