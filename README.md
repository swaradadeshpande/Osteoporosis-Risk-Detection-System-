# OsteoAI — Osteoporosis Risk Prediction System

Full-stack application: React (Vite + TypeScript) frontend + FastAPI backend + EfficientNetV2S ML model.

---

## Project Structure

```
osteoai/
├── backend/
│   ├── main.py                  ← FastAPI server (all API routes)
│   ├── ml_model.py              ← ML inference + Grad-CAM
│   ├── requirements.txt         ← Python dependencies
│   ├── start_backend.bat        ← Windows one-click start
│   └── uploads/xrays/           ← Auto-created, stores uploaded X-rays + Grad-CAM images
│
├── frontend/
│   ├── src/
│   │   ├── lib/api.ts           ← API client (points to localhost:8000)
│   │   ├── pages/Upload.tsx     ← Updated: sends real image + boneage + gender
│   │   ├── pages/Result.tsx     ← Updated: shows real Grad-CAM heatmap
│   │   └── ...                  ← All other pages unchanged
│   ├── package.json
│   └── start_frontend.bat       ← Windows one-click start
│
└── README.md
```

---

## Setup Instructions (Windows + Python 3.11/3.12)

### ⚠️ IMPORTANT: Python Version for TensorFlow

TensorFlow 2.x does NOT officially support Python 3.13 yet.
You MUST use Python 3.11 or 3.12 for TensorFlow to work.

**Steps to get the correct Python:**
1. Go to https://www.python.org/downloads/
2. Download Python 3.11.x or 3.12.x (not 3.13)
3. Install it — note the install path (e.g. `C:\Python311\`)
4. When creating the venv below, use that specific python:
   ```
   C:\Python311\python.exe -m venv venv
   ```

---

## Step 1 — Backend Setup

Open a terminal in the `backend/` folder:

```cmd
cd osteoai\backend

# Create virtual environment with Python 3.11 or 3.12
C:\Python311\python.exe -m venv venv

# Activate it
venv\Scripts\activate

# Install base dependencies
pip install -r requirements.txt

# Install TensorFlow (choose one):
# For CPU only (easier, works everywhere):
pip install tensorflow-cpu==2.17.0

# For GPU (NVIDIA only, needs CUDA 12):
pip install tensorflow[and-cuda]==2.17.0
```

### Add your trained model file

Copy your trained model file to the backend folder:
```
osteoai\backend\osteoporosis_risk_model_final.keras
```

If the model file is NOT present, the backend will still work using a rule-based
heuristic fallback (based on bone age + gender). The heatmap won't be generated
in fallback mode.

### Start the backend

```cmd
# Make sure venv is activated
venv\Scripts\activate

# Start FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or just double-click `start_backend.bat` (it will use system Python — make sure to
edit it to point to your Python 3.11/3.12 venv if needed).

Backend will be available at: http://localhost:8000
API docs at: http://localhost:8000/docs

---

## Step 2 — Frontend Setup

Open a NEW terminal in the `frontend/` folder:

```cmd
cd osteoai\frontend

# Install Node.js dependencies
npm install

# Start the dev server
npm run dev
```

Frontend will be available at: http://localhost:3000

Or double-click `start_frontend.bat`.

---

## How to Use

1. Open http://localhost:3000 in your browser
2. Click **Sign Up** or **Log In**
   - Use any email — if it contains "patient" you'll log in as a patient, otherwise as a doctor
   - Example doctor login: `doctor@osteoai.com` / any password
   - Example patient login: `patient@osteoai.com` / any password

3. **To run a prediction:**
   - Go to Upload (sidebar)
   - Enter Patient ID, Name, Bone Age (in months), Gender
   - Upload a hand X-ray image (PNG or JPG)
   - Click "Run AI Prediction"
   - You'll be redirected to the Result page with:
     - Risk classification (Normal / Osteopenia / Osteoporosis)
     - Confidence score and class probabilities
     - Grad-CAM heatmap (if model loaded)
     - Recommendation text
     - PDF download button

4. **Other features:**
   - Dashboard: stats and appointment overview
   - History: search patient history by ID
   - Doctors: browse specialists and book appointments
   - Chatbot: rule-based bone health Q&A
   - Cost: medication cost estimator
   - Side Effects: health advice

---

## Default Test Patients

| Patient ID | Name | Condition |
|---|---|---|
| P001 | Arjun Verma | Chronic back pain |
| P002 | Sunita Devi | Previous hip fracture |
| P003 | Rahul Sharma | Osteoporosis screening |
| P004 | Priya Singh | Vitamin D deficiency |
| P005 | Amit Patel | Low bone density |
| P006 | Kavita Reddy | Menopausal bone health |
| P007 | Sanjay Gupta | History of vertebral fracture |
| P008 | Meera Iyer | Family history |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/login | Login |
| POST | /auth/signup | Signup |
| GET | /patients | All patients |
| GET | /patients/{id} | Single patient |
| POST | /patients/add | Add/update patient |
| POST | /predict | Run ML prediction (multipart/form-data) |
| GET | /history/{id} | Patient history |
| GET | /stats | Dashboard stats |
| GET | /doctors | Doctor list |
| POST | /appointments/book | Book appointment |
| POST | /chatbot | Chatbot query |
| GET | /health | Health check + model status |

### /predict expects:

```
Content-Type: multipart/form-data
Fields:
  patientId  (string)
  boneage    (float, in months)
  gender     (string: "Male" / "Female")
  xray       (file: PNG or JPG)
```

---

## Troubleshooting

**Backend won't start:**
- Make sure venv is activated
- Make sure you're on Python 3.11 or 3.12 (not 3.13)
- Run: `python --version` to check

**TensorFlow import error:**
- Uninstall and reinstall: `pip uninstall tensorflow && pip install tensorflow-cpu==2.17.0`

**CORS error in browser:**
- Make sure backend is running on port 8000
- The backend already allows all origins

**Model file not found:**
- The system still works with heuristic fallback — you'll see results but no Grad-CAM
- Copy your `.keras` model file to `backend/` folder

**Frontend npm install fails:**
- Make sure Node.js 18+ is installed: https://nodejs.org/

---

## Notes

- No database required — all data is in-memory (resets on backend restart)
- No Gemini API key required — chatbot uses rule-based responses
- Model file is NOT included (too large) — copy your trained model to `backend/`
