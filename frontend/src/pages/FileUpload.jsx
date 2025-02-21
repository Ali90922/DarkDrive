import React, { useState } from "react";
import { uploadFiles } from "../../api/transfer.js";

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleUpload = async () => {
    setUploadStatus("Uploading...");

    const result = await uploadFiles(files);

    if (result.success) {
      setUploadStatus("Upload successful!");
      setFiles([]); // Clear files after successful upload
    } else {
      setUploadStatus(`Upload failed: ${result.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-bold text-white">Upload Files</h2>

        <div
          className={`rounded-lg border-2 border-dashed p-8 ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 bg-gray-800"} transition-colors duration-200`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-lg text-gray-300">
              Drag and drop your files here, or
            </p>
            <label className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700">
              Browse Files
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleChange}
              />
            </label>
            <p className="text-sm text-gray-400">
              Supported files: All file types accepted
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold text-white">
              Selected Files
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-800 p-3"
                >
                  <span className="text-gray-300">{file.name}</span>
                  <span className="text-sm text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              className="mt-4 rounded-md bg-green-600 px-6 py-2 text-white transition-colors duration-200 hover:bg-green-700"
            >
              Upload Files
            </button>
          </div>
        )}

        {uploadStatus && (
          <div
            className={`mt-4 rounded-lg p-3 ${
              uploadStatus.includes("failed")
                ? "bg-red-900/50 text-red-200"
                : uploadStatus.includes("successful")
                  ? "bg-green-900/50 text-green-200"
                  : "bg-blue-900/50 text-blue-200"
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
