import React, { useState, useRef } from "react";
import { Folder, FolderPlus, Star, Trash2, Upload, FolderOpen } from "lucide-react";
import { uploadFiles } from "../api/transfer.js";

const FoldersBar = () => {
	const [selectedFolder, setSelectedFolder] = useState("my-files");
	const [files, setFiles] = useState([]);
	const [uploadStatus, setUploadStatus] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const defaultFolders = [
		{ id: "my-files", name: "My Files", icon: <Folder size={20} />, count: 45 },
		{ id: "starred", name: "Starred", icon: <Star size={20} />, count: 12 },
		{ id: "trash", name: "Trash", icon: <Trash2 size={20} />, count: 3 },
	];

	const userFolders = [
		{ id: "documents", name: "Documents", icon: <FolderOpen size={20} />, count: 15 },
		{ id: "photos", name: "Photos", icon: <FolderOpen size={20} />, count: 23 },
		{ id: "work", name: "Work", icon: <FolderOpen size={20} />, count: 8 },
	];

	const handleFileSelect = (e) => {
		setFiles(Array.from(e.target.files));
		setUploadStatus("");
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleUpload = async () => {
		if (!files.length) {
			setUploadStatus("Please select files first");
			return;
		}

		setIsUploading(true);
		setUploadStatus("Uploading...");

		try {
			const result = await uploadFiles(files);

			if (result.success) {
				setUploadStatus("Upload successful!");
				setFiles([]);
				// You might want to refresh folder counts here
			} else {
				setUploadStatus(`Upload failed: ${result.message}`);
			}
		} catch (error) {
			setUploadStatus("Upload failed: An unexpected error occurred");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<aside className='w-64 h-screen bg-gray-800 border-r border-gray-700 flex flex-col'>
			{/* Hidden file input */}
			<input
				type='file'
				ref={fileInputRef}
				className='hidden'
				multiple
				onChange={handleFileSelect}
			/>

			{/* Upload Section */}
			<div className='p-4 space-y-2'>
				<button
					onClick={files.length ? handleUpload : handleUploadClick}
					disabled={isUploading}
					className='w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					<Upload size={20} />
					<span>{files.length ? "Upload Selected Files" : "Select Files"}</span>
				</button>

				{/* Upload Status */}
				{uploadStatus && (
					<div
						className={`text-sm text-center ${
							uploadStatus.includes("failed")
								? "text-red-400"
								: uploadStatus.includes("successful")
								? "text-green-400"
								: "text-blue-400"
						}`}
					>
						{uploadStatus}
					</div>
				)}

				{/* Selected Files */}
				{files.length > 0 && (
					<div className='text-sm text-gray-400 text-center'>{files.length} file(s) selected</div>
				)}
			</div>

			{/* Default Folders Section */}
			<div className='px-3 py-2'>
				<div className='text-gray-400 text-sm font-medium px-3 py-2'>Quick Access</div>
				{defaultFolders.map((folder) => (
					<button
						key={folder.id}
						onClick={() => setSelectedFolder(folder.id)}
						className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors duration-200 ${
							selectedFolder === folder.id
								? "bg-gray-700 text-white"
								: "text-gray-400 hover:bg-gray-700/50 hover:text-white"
						}`}
					>
						<div className='flex items-center gap-3'>
							{folder.icon}
							<span>{folder.name}</span>
						</div>
						<span className='text-sm text-gray-500'>{folder.count}</span>
					</button>
				))}
			</div>

			{/* User Folders Section */}
			<div className='px-3 py-2'>
				<div className='flex items-center justify-between px-3 py-2'>
					<span className='text-gray-400 text-sm font-medium'>My Folders</span>
					<button
						className='text-gray-400 hover:text-white transition-colors duration-200'
						title='Create new folder'
					>
						<FolderPlus size={18} />
					</button>
				</div>
				{userFolders.map((folder) => (
					<button
						key={folder.id}
						onClick={() => setSelectedFolder(folder.id)}
						className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors duration-200 ${
							selectedFolder === folder.id
								? "bg-gray-700 text-white"
								: "text-gray-400 hover:bg-gray-700/50 hover:text-white"
						}`}
					>
						<div className='flex items-center gap-3'>
							{folder.icon}
							<span>{folder.name}</span>
						</div>
						<span className='text-sm text-gray-500'>{folder.count}</span>
					</button>
				))}
			</div>
		</aside>
	);
};

export default FoldersBar;
