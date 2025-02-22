import React, { useState, useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const AdminDashboard = () => {
	// State for metrics and averages
	const [metrics, setMetrics] = useState([]);
	const [averages, setAverages] = useState({
		cpu_usage: 0,
		memory_usage: 0,
		disk_usage: 0,
	});

	useEffect(() => {
		// Mock API data - Replace this with actual API call
		const fetchData = async () => {
			const mockData = [
				{
					id: 1,
					hostname: "ip-172-31-41-173.ec2.internal",
					cpu: { cpu_usage_percent: 55.2 },
					memory: { memory_usage_percent: 60.3 },
					disk: { disk_usage_percent: 75.1 },
				},
				{
					id: 2,
					hostname: "ip-172-31-41-174.ec2.internal",
					cpu: { cpu_usage_percent: 40.5 },
					memory: { memory_usage_percent: 35.7 },
					disk: { disk_usage_percent: 60.4 },
				},
				// Add more machines as needed...
			];
			setMetrics(mockData);

			// Calculate averages
			const cpuUsage =
				mockData.reduce((acc, machine) => acc + machine.cpu.cpu_usage_percent, 0) / mockData.length;
			const memoryUsage =
				mockData.reduce((acc, machine) => acc + machine.memory.memory_usage_percent, 0) /
				mockData.length;
			const diskUsage =
				mockData.reduce((acc, machine) => acc + machine.disk.disk_usage_percent, 0) /
				mockData.length;

			setAverages({
				cpu_usage: cpuUsage,
				memory_usage: memoryUsage,
				disk_usage: diskUsage,
			});
		};

		fetchData();
	}, []);

	const cpuChartData = {
		labels: ["Machine 1", "Machine 2"], // Adjust as per your data
		datasets: [
			{
				label: "CPU Usage (%)",
				data: metrics.map((machine) => machine.cpu.cpu_usage_percent),
				fill: false,
				backgroundColor: "rgb(255, 99, 132)",
				borderColor: "rgba(255, 99, 132, 0.2)",
				tension: 0.1,
			},
		],
	};

	const diskChartData = {
		labels: ["Used", "Free"],
		datasets: [
			{
				data: [
					metrics.reduce((acc, machine) => acc + machine.disk.disk_usage_percent, 0) /
						metrics.length, // Example: Average disk usage
					100 -
						metrics.reduce((acc, machine) => acc + machine.disk.disk_usage_percent, 0) /
							metrics.length,
				],
				backgroundColor: ["#ff6347", "#28a745"],
				borderColor: ["#ff6347", "#28a745"],
				borderWidth: 1,
			},
		],
	};

	const cpuChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: "white",
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: "CPU Load Average",
				color: "white",
				font: {
					size: 16,
					weight: "bold",
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
				ticks: {
					color: "white",
				},
			},
			x: {
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
				ticks: {
					color: "white",
				},
			},
		},
	};

	const diskChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: "white",
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: "Total Disk Usage (GB)",
				color: "white",
				font: {
					size: 16,
					weight: "bold",
				},
			},
		},
	};

	const StatCard = ({ title, value, unit = "" }) => (
		<div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
			<h3 className='text-gray-400 text-sm font-medium mb-2'>{title}</h3>
			<div className='flex items-baseline'>
				<span className='text-2xl font-bold text-white'>{value.toFixed(1)}</span>
				{unit && <span className='ml-1 text-gray-400'>{unit}</span>}
			</div>
		</div>
	);

	const MachineCard = ({ machine }) => (
		<div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
			<h3 className='text-lg font-semibold text-white mb-4'>{machine.hostname.split(".")[0]}</h3>
			<div className='space-y-3'>
				<div className='flex justify-between items-center'>
					<span className='text-gray-400'>CPU</span>
					<span className='text-white'>{machine.cpu.cpu_usage_percent}%</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-gray-400'>Memory</span>
					<span className='text-white'>{machine.memory.memory_usage_percent}%</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-gray-400'>Disk</span>
					<span className='text-white'>{machine.disk.disk_usage_percent}%</span>
				</div>
			</div>
		</div>
	);

	if (!metrics || !averages) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-900'>
				<div className='text-white text-xl'>Loading metrics...</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-900 p-6'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-3xl font-bold text-white'>System Dashboard</h1>
						<p className='text-gray-400 mt-1'>Monitoring {metrics.length} machines</p>
					</div>
				</div>

				{/* Average Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					<StatCard title='Average CPU Usage' value={averages.cpu_usage} unit='%' />
					<StatCard title='Average Memory Usage' value={averages.memory_usage} unit='%' />
					<StatCard title='Average Disk Usage' value={averages.disk_usage} unit='%' />
				</div>

				{/* Charts */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
					<div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
						<Line data={cpuChartData} options={cpuChartOptions} />
					</div>
					<div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
						<Doughnut data={diskChartData} options={diskChartOptions} />
					</div>
				</div>

				{/* Individual Machine Stats */}
				<div>
					<h2 className='text-xl font-semibold text-white mb-6'>Individual Machine Stats</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{metrics.map((machine) => (
							<MachineCard key={machine.id} machine={machine} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
