from fastapi import FastAPI, File, UploadFile
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI instance
app = FastAPI()

# Enable CORS for all origins (Modify for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# New directory in the root (`/`) to store uploaded files
UPLOAD_DIR = "/file_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure directory exists

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename, "status": "File uploaded successfully", "saved_path": file_location}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
