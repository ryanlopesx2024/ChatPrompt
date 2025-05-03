import os
import time
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
from openai import OpenAI

# Config
# Use environment variables for sensitive information
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "your_api_key_here")
OPENAI_ASSISTANT_ID = os.environ.get("OPENAI_ASSISTANT_ID", "your_assistant_id_here")
EMAIL = os.environ.get("APP_EMAIL", "ia@gmail.com")
PASSWORD = os.environ.get("APP_PASSWORD", "senha123")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI()

# CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user_id: str = "user_1"

class Attachment(BaseModel):
    file_id: str
    type: str = "file"

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    attachment_ids: Optional[List[str]] = None

class ChatResponse(BaseModel):
    response: str
    thread_id: str
    message_id: str

# Simple token for session (in production use JWT or similar)
SESSION_TOKEN = "fixed-session-token"

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    if token != SESSION_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"user_id": "user_1"}

@app.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    if data.email == EMAIL and data.password == PASSWORD:
        return {"token": SESSION_TOKEN, "user_id": "user_1"}
    raise HTTPException(status_code=401, detail="Credenciais inválidas.")

@app.post("/chat", response_model=ChatResponse)
async def chat(data: ChatRequest, user=Depends(get_current_user)):
    try:
        # Create thread if not provided
        thread_id = data.thread_id
        if not thread_id:
            thread = client.beta.threads.create()
            thread_id = thread.id
        
        # Prepare message with attachments if any
        message_params = {
            "role": "user",
            "content": data.message
        }
        
        # Add attachments if provided
        if data.attachment_ids and len(data.attachment_ids) > 0:
            attachments = []
            for file_id in data.attachment_ids:
                attachments.append({"file_id": file_id, "type": "file"})
            message_params["attachments"] = attachments
        
        # Create message
        message = client.beta.threads.messages.create(
            thread_id=thread_id,
            **message_params
        )
        
        # Run assistant
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=OPENAI_ASSISTANT_ID
        )
        
        # Poll for completion
        max_attempts = 60  # 1 minute timeout
        attempts = 0
        while attempts < max_attempts:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )
            
            if run_status.status == "completed":
                break
            elif run_status.status in ["failed", "cancelled", "expired"]:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Assistant run failed with status: {run_status.status}"
                )
            
            attempts += 1
            time.sleep(1)
            
        if attempts >= max_attempts:
            raise HTTPException(status_code=504, detail="Assistant timed out")
        
        # Get latest assistant message
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        response_msg = None
        
        for msg in messages.data:
            if msg.role == "assistant":
                response_msg = msg
                break
        
        if not response_msg:
            return {"response": "Não foi possível obter uma resposta do assistente.", "thread_id": thread_id, "message_id": ""}
        
        # Extract text content
        content_text = ""
        for content in response_msg.content:
            if content.type == "text":
                content_text += content.text.value
        
        return {"response": content_text, "thread_id": thread_id, "message_id": response_msg.id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/attachments")
async def upload_attachment(file: UploadFile = File(...), user=Depends(get_current_user)):
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload file to OpenAI
        openai_file = client.files.create(
            file=(file.filename, file_content),
            purpose="assistants"
        )
        
        return {"file_id": openai_file.id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.get("/")
def root():
    return {"status": "ok"}
