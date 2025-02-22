import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import axios from "axios";

const Home = () => {
  const [files, setFiles] = useState([]);

  // Adjust if your FastAPI is hosted differently
  const API_URL = "http://18.220.232.235:8000";

  useEffect(() => {
    const getUserData = async () => {
      try {
        // We assume the server is running the new route
        // "GET /users/files/:email"
        const email = localStorage.getItem("email") || "demo@example.com";
        const response = await axios.get(`${API_URL}/users/files/${email}`);
        // The server returns something like { files: ["JD-Q2.asm.enc", "test.txt.enc", ...] }
        console.log(response.data.files);
        setFiles(response.data.files);
      } catch (err) {
        console.log(err);
      }
    };

    getUserData();
  }, []);

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
                {/* Show the exact filename, e.g. "JD-Q2.asm.enc" */}
                <p>{file}</p>
                <a
                  // Must request EXACT name, including ".enc"
                  href={`${API_URL}/download/${encodeURIComponent(file)}`}
                  download={file} 
                  className="text-blue-400 cursor-pointer"
                >
                  Download
                </a>
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
