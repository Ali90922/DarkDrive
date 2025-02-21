import React from "react";
import {
	FileText,
	Image,
	Film,
	Music,
	File,
	MoreVertical,
	Download,
	Trash2,
	Share2,
} from "lucide-react";

const FileGrid = ({ selectedFolder }) => {
	// Mock data - replace with your actual data fetching logic
	const files = [
		{
			id: 1,
			name: "Project Proposal.pdf",
			type: "pdf",
			size: "2.4 MB",
			modified: "2024-02-20",
			starred: false,
		},
		{
			id: 2,
			name: "Vacation Photos.jpg",
			type: "image",
			size: "4.8 MB",
			modified: "2024-02-19",
			starred: true,
		},
		{
			id: 3,
			name: "Presentation.pptx",
			type: "powerpoint",
			size: "6.2 MB",
			modified: "2024-02-18",
			starred: false,
		},
		{
			id: 4,
			name: "Project Demo.mp4",
			type: "video",
			size: "158 MB",
			modified: "2024-02-17",
			starred: false,
		},
		{
			id: 5,
			name: "Meeting Recording.mp3",
			type: "audio",
			size: "24.6 MB",
			modified: "2024-02-16",
			starred: false,
		},
	];

	const getFileIcon = (type) => {
		switch (type) {
			case "pdf":
				return <FileText size={24} />;
			case "image":
				return <Image size={24} />;
			case "video":
				return <Film size={24} />;
			case "audio":
				return <Music size={24} />;
			default:
				return <File size={24} />;
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className='flex-1 bg-gray-900 p-6'>
			{/* Header */}
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold text-white'>Files</h1>
				<div className='flex gap-2'>
					<button className='px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200'>
						List View
					</button>
					<button className='px-4 py-2 text-white bg-gray-800 rounded-lg'>Grid View</button>
				</div>
			</div>

			{/* Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
				{files.map((file) => (
					<div
						key={file.id}
						className='bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200 group'
					>
						{/* File Preview */}
						<div className='aspect-square rounded-lg bg-gray-700 mb-3 flex items-center justify-center text-gray-400'>
							{getFileIcon(file.type)}
						</div>

						{/* File Info */}
						<div className='space-y-1'>
							<div className='flex items-start justify-between'>
								<h3 className='text-white font-medium truncate'>{file.name}</h3>
								<div className='relative'>
									<button className='p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
										<MoreVertical size={16} />
									</button>
									{/* Dropdown menu could go here */}
								</div>
							</div>
							<div className='flex items-center justify-between text-sm text-gray-400'>
								<span>{file.size}</span>
								<span>{formatDate(file.modified)}</span>
							</div>
						</div>

						{/* Hover Actions */}
						<div className='absolute inset-0 bg-gray-800/90 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg'>
							<button className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200'>
								<Download size={20} />
							</button>
							<button className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200'>
								<Share2 size={20} />
							</button>
							<button className='p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors duration-200'>
								<Trash2 size={20} />
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Empty State */}
			{files.length === 0 && (
				<div className='flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-400'>
					<File size={48} className='mb-4' />
					<h3 className='text-xl font-medium mb-2'>No files yet</h3>
					<p>Upload files or create a new folder to get started</p>
				</div>
			)}
		</div>
	);
};

export default FileGrid;
