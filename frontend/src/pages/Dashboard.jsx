import React from "react";
import { Users, FileText, Upload, AlertCircle, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartdata = [
  { date: "Jan", uploads: 167, users: 145 },
  { date: "Feb", uploads: 125, users: 156 },
  { date: "Mar", uploads: 156, users: 165 },
  { date: "Apr", uploads: 165, users: 185 },
  { date: "May", uploads: 153, users: 198 },
  { date: "Jun", uploads: 176, users: 200 },
];

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    icon: Users,
    change: "+12.3%",
    isIncrease: true
  },
  {
    title: "Total Files",
    value: "4,567",
    icon: FileText,
    change: "+8.2%",
    isIncrease: true
  },
  {
    title: "Upload Rate",
    value: "95.5%",
    icon: Upload,
    change: "-2.1%",
    isIncrease: false
  },
  {
    title: "System Health",
    value: "98.2%",
    icon: Activity,
    change: "+0.5%",
    isIncrease: true
  },
];

const recentUploads = [
  { name: "annual_report.pdf", size: "2.4 MB", status: "success" },
  { name: "presentation.pptx", size: "5.1 MB", status: "success" },
  { name: "data_export.csv", size: "1.2 MB", status: "pending" },
  { name: "image_batch.zip", size: "15.7 MB", status: "failed" },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, here's what's happening</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
            <AlertCircle className="text-yellow-500 w-5 h-5" />
            <span className="text-gray-300 text-sm">System Status: Operational</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </div>
                <stat.icon className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex items-center mt-4">
                {stat.isIncrease ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  stat.isIncrease ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-white font-semibold mb-4">Upload Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartdata}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uploads" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-white font-semibold mb-4">User Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartdata}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-white font-semibold mb-4">Recent Uploads</h3>
          <div className="space-y-2">
            {recentUploads.map((upload) => (
              <div key={upload.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-white">{upload.name}</p>
                    <p className="text-gray-400 text-sm">{upload.size}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  upload.status === 'success' ? 'bg-green-900/50 text-green-400' :
                  upload.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;