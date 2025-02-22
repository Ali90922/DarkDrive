from fastapi import FastAPI
import psutil
import socket
import platform
import uptime
import uvicorn

app = FastAPI()

def get_system_metrics():
    return {
        "hostname": socket.gethostname(),
        "os": platform.system(),
        "os_version": platform.version(),
        "architecture": platform.architecture()[0],
        "cpu": {
            "physical_cores": psutil.cpu_count(logical=False),
            "logical_cores": psutil.cpu_count(logical=True),
            "cpu_usage_percent": psutil.cpu_percent(interval=1),
            "load_average": psutil.getloadavg() if hasattr(psutil, "getloadavg") else "N/A"
        },
        "memory": {
            "total_memory_gb": round(psutil.virtual_memory().total / (1024 ** 3), 2),
            "used_memory_gb": round(psutil.virtual_memory().used / (1024 ** 3), 2),
            "available_memory_gb": round(psutil.virtual_memory().available / (1024 ** 3), 2),
            "memory_usage_percent": psutil.virtual_memory().percent,
        },
        "disk": {
            "total_disk_gb": round(psutil.disk_usage('/').total / (1024 ** 3), 2),
            "used_disk_gb": round(psutil.disk_usage('/').used / (1024 ** 3), 2),
            "free_disk_gb": round(psutil.disk_usage('/').free / (1024 ** 3), 2),
            "disk_usage_percent": psutil.disk_usage('/').percent,
        },
        "network": {
            "interfaces": {
                iface: {
                    "bytes_sent": psutil.net_io_counters(pernic=True)[iface].bytes_sent,
                    "bytes_received": psutil.net_io_counters(pernic=True)[iface].bytes_recv
                }
                for iface in psutil.net_io_counters(pernic=True)
            }
        },
        "uptime_seconds": uptime.uptime(),
    }

@app.get("/metrics")
async def metrics():
    return get_system_metrics()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)    
o

