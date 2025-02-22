from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from cryptography.fernet import Fernet

# Create FastAPI instance
app = FastAPI()

# Enable CORS (modify for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend's domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store encrypted files
UPLOAD_DIR = "/home/ec2-user/encrypted_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure directory exists


def encrypt_file(file_data: bytes):
    """Encrypts the file and returns (encrypted data, encryption key)."""
    key = Fernet.generate_key()  # Generate a unique encryption key
    cipher = Fernet(key)
    encrypted_data = cipher.encrypt(file_data)
    return encrypted_data, key


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """Encrypts an uploaded file, stores it, and returns the encryption key."""
    file_data = await file.read()  # Read file content as bytes

    # Encrypt file
    encrypted_data, key = encrypt_file(file_data)

    # Save encrypted file
    encrypted_filename = file.filename + ".enc"
    encrypted_file_path = os.path.join(UPLOAD_DIR, encrypted_filename)

    with open(encrypted_file_path, "wb") as f:
        f.write(encrypted_data)

    return {
        "message": "File encrypted and stored successfully",
        "encrypted_filename": encrypted_filename,
        "encryption_key": key.decode(),  # Convert key to string to return
        "download_url": f"/download/{encrypted_filename}"  # URL to download encrypted file
    }


@app.get("/download/{file_name}")
async def download_encrypted_file(file_name: str):
    """Allows the user to download an encrypted file."""
    encrypted_file_path = os.path.join(UPLOAD_DIR, file_name)

    # Check if the file exists
    if not os.path.exists(encrypted_file_path):
        raise HTTPException(status_code=404, detail="Encrypted file not found")

    return FileResponse(encrypted_file_path, filename=file_name)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
