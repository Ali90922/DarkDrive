import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import axios from "axios";

const Home = () => {
  const [files, setFiles] = useState([]);

  // Base URL for file listing and upload (from server.py)
  const API_URL = "http://98.83.145.159:8000";
  // Separate base URL for downloads (from download_api.py)
  const DOWNLOAD_API_URL = "http://98.83.145.159:8001";

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
    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-screen bg-gray-900 text-white">
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Upload Files</h2>
        <FileUpload />
      </section>
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">My Files</h2>
        <ul className="max-h-96 overflow-y-auto border border-gray-700 rounded-lg p-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between p-2 border-b border-gray-600 last:border-b-0 hover:bg-gray-700 transition"
              >
                <p>{file}</p>
                <button
                  onClick={() => handleDownload(file)}
                  className="text-blue-400 cursor-pointer"
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

export default Home;
