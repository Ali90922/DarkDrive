from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import bcrypt
import smtplib
from email.message import EmailMessage
from pydantic import BaseModel
from fastapi.responses import RedirectResponse

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
def get_db_connection():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn

# User Model
class User(BaseModel):
    email: str
    password: str
    linkedin: str = None
    files: str = None

# Password Hashing Functions
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

# Function to Send Verification Email
def send_verification_email(email: str):
    verification_link = f"http://18.220.232.235:8000/users/verify/{email}"
    msg = EmailMessage()
    msg["Subject"] = "Verify Your Email"
    msg["From"] = "rayankash71@gmail.com"  # Replace with your email
    msg["To"] = email
    msg.set_content(f"Click the link to verify your email: {verification_link}")

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login("rayankash71@gmail.com", "vqrfdutlhbiagdox")  # Replace with credentials
            smtp.send_message(msg)
    except Exception as e:
        print(f"Email sending failed: {e}")

# ✅ Signup with Email Verification
@app.post("/users/signup")
def signup(user: User):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if email exists
    existing_user = cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,)).fetchone()
    if existing_user:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and insert user with `verified = 0`
    hashed_password = hash_password(user.password)
    cursor.execute("INSERT INTO users (email, password, linkedin, files, verified) VALUES (?, ?, ?, ?, ?)",
                   (user.email, hashed_password, user.linkedin, user.files, 0))
    conn.commit()
    conn.close()

    send_verification_email(user.email)  # Send verification email

    return {"message": "Signup successful! Please verify your email."}

# ✅ Verify Email Endpoint
@app.get("/users/verify/{email}")
def verify_email(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute("UPDATE users SET verified = 1 WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    return RedirectResponse(url="http://safarnamaaa.ca")

# login
@app.post("/users/login")
def login(user: User):
    conn = get_db_connection()
    cursor = conn.cursor()

    db_user = cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,)).fetchone()
    if not db_user:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not db_user["verified"]:
        conn.close()
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")

    if not verify_password(user.password, db_user["password"]):
       conn.close()
       raise HTTPException(status_code=400, detail="Invalid email or password")

    conn.close()
    
    return {"message": "Login successful", "email": user.email}

# ✅ Get All Users
@app.get("/users")
def get_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, email, linkedin, files, verified FROM users").fetchall()
    conn.close()
    return {"users": [dict(user) for user in users]}

# ✅ Get a User by Email
@app.get("/users/{email}")
def get_user(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute("SELECT id, email, linkedin, files, verified FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)

# ✅ Delete a User by Email
@app.delete("/users/delete/{email}")
def delete_user(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    existing_user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not existing_user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    conn.commit()
    conn.close()
    
    return {"message": "User deleted successfully"}

# ✅ Delete All Users & Reset ID Counter
@app.delete("/users/clear")
def clear_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM users;")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='users';")
    
    conn.commit()
    conn.close()
    
    return {"message": "All users deleted and ID counter reset"}


# ✅ Upload File for a Specific User
@app.post("/users/upload/{email}")
def upload_file(email: str, file: UploadFile = File(...)):
    """
    Expects a multipart/form-data with a key 'file'.
    Example: 
      POST /users/upload/test%40example.com
      form-data => { file: <the actual file> }
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the user exists
    user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Store only the filename in DB (not the file content)
    existing_files = user["files"]
    new_files = file.filename if existing_files is None else f"{existing_files},{file.filename}"

    cursor.execute("UPDATE users SET files = ? WHERE email = ?", (new_files, email))
    conn.commit()
    conn.close()

    return {"message": "Filename stored successfully", "filename": file.filename}

@app.get("/users/files/{email}")
def get_user_files(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    # Retrieve the comma-separated filenames (if any)
    files_csv = user["files"]
    
    # Convert CSV string -> list; if it's None or empty, use an empty list
    if files_csv:
        files_list = files_csv.split(",")
    else:
        files_list = []
    
    conn.close()

      # Also retrieve the verified status (0 or 1)
    verified_status = user["verified"]  # This is typically 0 or 1 in the DB    
    # Return a JSON object, e.g. { "files": ["file1.pdf", "file2.png"] }
    return {"files": files_list,"verified": verified_status}
