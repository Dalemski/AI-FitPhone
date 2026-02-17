from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

model = joblib.load("fitphone_pipeline.joblib")

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://i548036.hera.fontysict.net", 
    "https://i548036.hera.fontysict.net",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SleepInput(BaseModel):
    screen_time_hours: float
    work_screen_hours: float
    leisure_screen_hours: float
    stress_level_0_10: float
    productivity_0_100: float
    exercise_minutes_per_week: float
    social_hours_per_week: float
    age: float
    mental_wellness_index_0_100: float
    gender: str
    occupation: str
    work_mode: str

@app.post("/predict")
def predict_sleep(data: SleepInput):
    X = pd.DataFrame([data.dict()])
    pred = model.predict(X)[0]
    return {"sleep_quality": int(pred)}
