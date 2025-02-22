from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from cryptography.fernet import Fernet
import os
import shutil
import uuid
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with your real domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/home/ec2-user/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    1) Save the uploaded file as a temp file.
    2) Encrypt it using Fernet.
    3) Save only the encrypted version with .enc appended.
    4) Delete the original cleartext file.
    5) Return JSON with "filename": "<original>.enc" and the "encryption_key".
    """
    # Build full path to a temporary location
    temp_file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded file (plaintext)
    with open(temp_file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate encryption key (Fernet)
    encryption_key = Fernet.generate_key()
    fernet = Fernet(encryption_key)
    
    # Read the original file data
    with open(temp_file_location, "rb") as original_file:
        original_data = original_file.read()

    # Encrypt the file data
    encrypted_data = fernet.encrypt(original_data)
    
    # Create the new filename with ".enc"
    encrypted_filename = file.filename + ".enc"
    encrypted_file_location = os.path.join(UPLOAD_DIR, encrypted_filename)

    # Write the encrypted file to disk
    with open(encrypted_file_location, "wb") as encrypted_file:
        encrypted_file.write(encrypted_data)
    
    # Remove the original plaintext file
    os.remove(temp_file_location)
    
    # Return JSON response
    response = {
        "filename": encrypted_filename,
        "status": "File uploaded and encrypted successfully",
        "encryption_key": encryption_key.decode(),  # Return key if you need it for decryption
        "token": str(uuid.uuid4()),  # Example additional data
    }
    print("Response:", response)
    return response

@app.get("/users/files/{email}")
async def get_user_files(email: str):
    """
    Return a list of ALL .enc files in UPLOAD_DIR.
    (No real filtering by user here—just a demo.)
    The frontend uses this to display a list of encrypted files.
    """
    all_files = os.listdir(UPLOAD_DIR)
    # Only return files ending in ".enc"
    enc_files = [f for f in all_files if f.endswith(".enc")]
    
    # In a real scenario, you'd filter files by user or DB logic
    return {"files": enc_files}

@app.get("/download")
async def download_file(filename: str, key: str):
    print(filename,key)
    """
    Decrypt the .enc file from the server using the provided key
    and return the decrypted file to the user as a download.

    Example usage:
      GET /download/myfile.txt.enc?key=BASE64_FERNET_KEY
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
	
    if not os.path.exists(file_path):
	
        raise HTTPException(status_code=404, detail="File not found")

    # Read the encrypted bytes
    with open(file_path, "rb") as encrypted_file:
        encrypted_data = encrypted_file.read()

    # Initialize Fernet with the provided key
    try:
        fernet = Fernet(key)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid Fernet key: {str(e)}"
        )

    # Decrypt the data
    try:
        decrypted_data = fernet.decrypt(encrypted_data)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Decryption failed: {str(e)}"
        )

    # Optionally remove ".enc" from filename for the downloaded file
    original_filename = filename.removesuffix(".enc")  # requires Python 3.9+

    # Use StreamingResponse to send decrypted bytes
    file_like = io.BytesIO(decrypted_data)
    response = StreamingResponse(
        file_like,
        media_type="application/octet-stream",
    )
    response.headers["Content-Disposition"] = (
        f'attachment; filename="{original_filename}"'
    )
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
