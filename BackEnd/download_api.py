from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Allow all origins; for production, tighten these settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory where your files are stored
UPLOAD_DIR = "/home/ec2-user/uploads"

@app.get("/download/{filename:path}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Debugging: log the request and computed file path
    print(f"[DEBUG] Download request received for filename: {filename}")
    print(f"[DEBUG] Computed file path: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"[DEBUG] File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")
    
    print(f"[DEBUG] File found. Returning file: {file_path}")
    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=filename
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
