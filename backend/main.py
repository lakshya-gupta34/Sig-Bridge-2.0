"""
SignBridge - FastAPI Main Server
Provides:
- Bidirectional ISL <-> English/Hindi NLP REST Endpoints
- Real-time WebSocket Landmark Streaming Endpoint
- Full ISLRTC Corpus Inspection Endpoint
"""

import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from isl_grammar_engine import ISLGrammarProcessor
from landmark_classifier import ISLLandmarkClassifier

app = FastAPI(
    title="SignBridge API",
    description="Advanced Bilingual Indian Sign Language (ISL) <-> English & Hindi Processing API",
    version="1.0.0"
)

# Enable CORS for frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = ISLLandmarkClassifier()


# --- Pydantic Request Models ---
class TextToISLRequest(BaseModel):
    text: str
    source_language: Optional[str] = "en"  # "en" or "hi"

class ISLToTextRequest(BaseModel):
    sign_sequence: List[str]

class LandmarkFrameRequest(BaseModel):
    feature_vector: List[float]


# --- REST Endpoints ---
@app.get("/")
def root():
    return {
        "service": "SignBridge ISL Backend API",
        "status": "online",
        "standards": "ISLRTC Aligned",
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "supported_languages": ["ISL", "English", "Hindi"],
        "grammar_engine": "ISL SOV Ruleset v1.0"
    }

@app.post("/api/v1/translate/text-to-isl")
def translate_text_to_isl(payload: TextToISLRequest):
    """Translates English or Hindi natural text into ISL SOV gloss sequence."""
    result = ISLGrammarProcessor.text_to_isl(payload.text)
    return result

@app.post("/api/v1/translate/isl-to-text")
def translate_isl_to_text(payload: ISLToTextRequest):
    """Reconstructs natural English and Hindi sentences from an ordered sequence of ISL signs."""
    result = ISLGrammarProcessor.isl_to_text(payload.sign_sequence)
    return {
        "sign_sequence": payload.sign_sequence,
        "english": result["english"],
        "hindi": result["hindi"]
    }

@app.post("/api/v1/classify-landmarks")
def classify_landmarks(payload: LandmarkFrameRequest):
    """Classifies a normalized landmark feature vector into an ISL sign."""
    sign_id, confidence = classifier.classify_frame(payload.feature_vector)
    return {
        "predicted_sign": sign_id,
        "confidence_percentage": confidence,
        "status": "classified" if sign_id else "unknown"
    }


# --- WebSocket Stream Endpoint for Real-time Video Frames ---
@app.websocket("/ws/landmark-stream")
async def websocket_landmark_stream(websocket: WebSocket):
    await websocket.accept()
    stream_classifier = ISLLandmarkClassifier()
    try:
        while True:
            data_text = await websocket.receive_text()
            payload = json.loads(data_text)
            features = payload.get("features", [])

            sign_id, confidence = stream_classifier.classify_frame(features)

            await websocket.send_json({
                "predicted_sign": sign_id,
                "confidence": confidence,
                "timestamp": payload.get("timestamp")
            })
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
