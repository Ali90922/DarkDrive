from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
from cryptography.fernet import Fernet
import uuid

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

# Directory to store uploaded files
UPLOAD_DIR = "/home/ec2-user/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure directory exists

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Define temporary file location
    temp_file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded file temporarily
    with open(temp_file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate encryption key
    encryption_key = Fernet.generate_key()
    fernet = Fernet(encryption_key)
    
    # Read the original file content
    with open(temp_file_location, "rb") as original_file:
        original_data = original_file.read()
    
    # Encrypt the file data
    encrypted_data = fernet.encrypt(original_data)
    
    # Define encrypted file location (with .enc extension)
    encrypted_file_location = os.path.join(UPLOAD_DIR, f"{file.filename}.enc")
    with open(encrypted_file_location, "wb") as encrypted_file:
        encrypted_file.write(encrypted_data)
    
    # Optionally, remove the original unencrypted file for security
    os.remove(temp_file_location)
    
    # Generate a unique success token
    success_token = str(uuid.uuid4())
    
    # Create the response dictionary
    response = {
        "filename": file.filename,
        "status": "File uploaded and encrypted successfully",
        "encryption_key": encryption_key.decode(),
        "token": success_token
    }
    
    # Print the response to the console
    print("Response:", response)
    
    # Return the JSON response to the user
    return response

@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download the encrypted file from the server.
    Expects the filename (without .enc extension) as a path parameter.
    """
    file_path = os.path.join(UPLOAD_DIR, f"{filename}.enc")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return the file for download.
    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=f"{filename}.enc"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
