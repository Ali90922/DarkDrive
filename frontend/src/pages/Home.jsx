import FileUpload from "./FileUpload";

const Home = () => {
	const files = ["123.txt", "234.txt", "awjiw.raw", "addw.ca"];

	return (
		<main className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-screen bg-gray-900 text-white'>
			<section className='bg-gray-800 p-6 rounded-lg shadow-lg'>
				<h2 className='text-xl font-semibold mb-4 text-center'>Upload Files</h2>
				<FileUpload />
			</section>
			<section className='bg-gray-800 p-6 rounded-lg shadow-lg'>
				<h2 className='text-xl font-semibold mb-4 text-center'>My Files</h2>
				<ul className='max-h-96 overflow-y-auto border border-gray-700 rounded-lg p-4'>
					{files.map((file, index) => (
						<li
							key={index}
							className='p-2 border-b border-gray-600 last:border-b-0 hover:bg-gray-700 transition'
						>
							{file}
						</li>
					))}
				</ul>
			</section>
		</main>
	);
};

export default Home;
