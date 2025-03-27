from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from cryptography.fernet import Fernet
import os
import shutil
import uuid
import io

app = FastAPI()

# Enable CORS (update allow_origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/home/ec2-user/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_user_upload_dir(email: str):
    """Returns the directory path for a specific user's uploads."""
    user_dir = os.path.join(UPLOAD_DIR, email)
    os.makedirs(user_dir, exist_ok=True)
    return user_dir

@app.post("/upload/{email}")
async def upload_file(email: str, file: UploadFile = File(...)):
    """
    Upload a file for a specific user, encrypt it, and store it securely.
    """
    user_dir = get_user_upload_dir(email)
    temp_file_location = os.path.join(user_dir, file.filename)
    
    with open(temp_file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate encryption key
    encryption_key = Fernet.generate_key()
    fernet = Fernet(encryption_key)
    
    with open(temp_file_location, "rb") as original_file:
        original_data = original_file.read()

    # Encrypt file data
    encrypted_data = fernet.encrypt(original_data)
    encrypted_filename = file.filename + ".enc"
    encrypted_file_location = os.path.join(user_dir, encrypted_filename)

    with open(encrypted_file_location, "wb") as encrypted_file:
        encrypted_file.write(encrypted_data)
    
    # Remove plaintext file
    os.remove(temp_file_location)
    
    return {
        "filename": encrypted_filename,
        "status": "File uploaded and encrypted successfully",
        "encryption_key": encryption_key.decode(),  # Send key for decryption
        "token": str(uuid.uuid4()),  # Example additional metadata
    }

@app.get("/users/files/{email}")
async def get_user_files(email: str):
    """
    Retrieve the list of encrypted files belonging to a specific user.
    """
    user_dir = os.path.join(UPLOAD_DIR, email)
    
    if not os.path.exists(user_dir):
        return {"files": []}  # No files if user directory doesn't exist

    enc_files = [f for f in os.listdir(user_dir) if f.endswith(".enc")]
    return {"files": enc_files}

@app.get("/download/{email}")
async def download_file(email: str, filename: str, key: str):
    """
    Decrypt a file for the user and send it as a downloadable response.
    """
    user_dir = os.path.join(UPLOAD_DIR, email)
    file_path = os.path.join(user_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    with open(file_path, "rb") as encrypted_file:
        encrypted_data = encrypted_file.read()

    # Initialize Fernet with provided key
    try:
        fernet = Fernet(key)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Fernet key: {str(e)}")

    # Decrypt data
    try:
        decrypted_data = fernet.decrypt(encrypted_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Decryption failed: {str(e)}")

    # Get original filename
    original_filename = filename.removesuffix(".enc")  # Requires Python 3.9+

    file_like = io.BytesIO(decrypted_data)
    response = StreamingResponse(
        file_like,
        media_type="application/octet-stream",
    )
    response.headers["Content-Disposition"] = (
        f'attachment; filename="{original_filename}"'
    )
    return response

@app.delete("/delete/{email}/{filename}")
async def delete_file(email: str, filename: str):
    """
    Deletes a specific user's file.
    """
    user_dir = os.path.join(UPLOAD_DIR, email)
    file_path = os.path.join(user_dir, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        os.remove(file_path)
        return {"ok": True, "message": f"File '{filename}' deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
