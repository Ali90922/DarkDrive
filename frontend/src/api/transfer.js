import axios from "axios";
import { getToken } from "./auth"; // Assuming auth.js is in the same directory

const uploadEndpoint = "http://98.83.145.159:8000/upload/";
const fileNameEndpoint = "http://18.220.232.235:8000/users/upload/";

export const uploadFiles = async (files) => {
	try {
		const results = [];

		for (const file of files) {
			console.log(file.name);

			// sendFileName(file.name);
			const formData = new FormData();
			formData.append("file", file);

			// Use axios to upload the file
			const response = await axios.post(uploadEndpoint, formData, {
				headers: {
					"Content-Type": "multipart/form-data", // Specify the content type for file upload
				},
			});

			localStorage.setItem("encryptionKey", response.data.encryption_key);
			console.log(response);

			if (response.status !== 200) {
				throw new Error(`Upload failed for ${file.name}`);
			}

			// Once the file is uploaded, send just the file name to the fileNameEndpoint
			const uploadUrl = `http://18.220.232.235:8000/users/upload/${encodeURIComponent(
				localStorage.getItem("email")
			)}`;

			const response2 = await axios.post(uploadUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response2.status !== 200) {
				throw new Error(`Failed to send file name for ${file.name}`);
			}

			results.push({
				fileName: file.name,
				success: true,
			});
		}

		return {
			success: true,
			message: "All files uploaded and file names sent successfully",
			results,
		};
	} catch (error) {
		console.error("Upload error:", error);
		return {
			success: false,
			message: error.message,
			error,
		};
	}
};
