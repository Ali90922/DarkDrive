from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
from cryptography.fernet import Fernet
import uuid

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
    5) Return JSON with "filename": "<original>.enc".
    """
    temp_file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded file
    with open(temp_file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate encryption key
    encryption_key = Fernet.generate_key()
    fernet = Fernet(encryption_key)
    
    # Read the original file data
    with open(temp_file_location, "rb") as original_file:
        original_data = original_file.read()

    # Encrypt
    encrypted_data = fernet.encrypt(original_data)
    
    # Define the new filename with ".enc" appended
    encrypted_filename = file.filename + ".enc"
    encrypted_file_location = os.path.join(UPLOAD_DIR, encrypted_filename)

    # Save the encrypted file
    with open(encrypted_file_location, "wb") as encrypted_file:
        encrypted_file.write(encrypted_data)
    
    # Remove the original (unencrypted) file
    os.remove(temp_file_location)
    
    # Prepare a JSON response
    response = {
        "filename": encrypted_filename,
        "status": "File uploaded and encrypted successfully",
        "encryption_key": encryption_key.decode(),  # If you need the key for later usage
        "token": str(uuid.uuid4()),
    }
    print("Response:", response)
    return response

@app.get("/users/files/{email}")
async def get_user_files(email: str):
    """
    Return a list of ALL .enc files in UPLOAD_DIR.
    (No real filtering by user here—just a demo.)
    The frontend uses this to display a list of files.
    """
    all_files = os.listdir(UPLOAD_DIR)
    # In this example, let's only return files ending in ".enc"
    enc_files = [f for f in all_files if f.endswith(".enc")]
    
    # If you wanted to filter by user, you'd need a naming convention or DB link here.
    
    return {"files": enc_files}

@app.get("/download/{filename:path}")
async def download_file(filename: str):
    """
    Download EXACTLY the file name requested, e.g. "JD-Q2.asm.enc".
    We do NOT append ".enc" here. If the file on disk is "JD-Q2.asm.enc",
    you must request /download/JD-Q2.asm.enc
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Debugging: Log when the download endpoint is hit.
    print(f"[DEBUG] Download endpoint called for filename: {filename}")
    print(f"[DEBUG] Full file path computed: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"[DEBUG] File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")
    
    print(f"[DEBUG] File found. Preparing to send file: {file_path}")
    
    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=filename
    )




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
