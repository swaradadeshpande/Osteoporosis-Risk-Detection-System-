"""
ml_model.py — Osteoporosis Risk Prediction Inference Module
Loads the trained EfficientNetV2S + Tabular Fusion model and runs prediction + Grad-CAM.
Falls back to a rule-based heuristic if model file is not found.
"""

import os
import sys
import numpy as np
import cv2
from pathlib import Path

# ── Try to import TensorFlow ──────────────────────────────────────────────────
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    from tensorflow.keras import Model
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("[ml_model] TensorFlow not available — using heuristic fallback.")

IMG_SIZE = (224, 224)
NUM_CLASSES = 3
MODEL_PATH = os.environ.get("MODEL_PATH", "osteoporosis_risk_model_final.keras")

RISK_LABELS = {0: "Low Risk", 1: "Medium Risk", 2: "High Risk"}
RECOMMENDATIONS = {
    0: "No immediate action needed. Maintain a healthy lifestyle with adequate calcium and vitamin D.",
    1: "Consider bone density screening. Review calcium and Vitamin D intake. Discuss with your doctor.",
    2: "Urgent bone density test (DEXA scan) recommended. Consult a physician immediately.",
}

_model = None
_scaler_min = 0.0
_scaler_max = 230.0  # approximate max boneage in dataset (months)
_model_loaded = False


def _load_model():
    global _model, _model_loaded
    if _model is not None:
        return True
    if not TF_AVAILABLE:
        return False
    if not os.path.exists(MODEL_PATH):
        print(f"[ml_model] Model file not found at '{MODEL_PATH}'. Using heuristic fallback.")
        return False
    try:
        print(f"[ml_model] Loading model from '{MODEL_PATH}' ...")
        # Define focal loss so Keras can deserialize it
        def focal_loss(gamma=2.0, alpha=0.25):
            def loss_fn(y_true, y_pred):
                y_pred = tf.clip_by_value(y_pred, 1e-8, 1.0)
                ce = -y_true * tf.math.log(y_pred)
                pt = tf.reduce_sum(y_true * y_pred, axis=-1, keepdims=True)
                focal_w = alpha * tf.pow(1.0 - pt, gamma)
                return tf.reduce_mean(focal_w * ce)
            return loss_fn

        _model = load_model(
            MODEL_PATH,
            custom_objects={"loss_fn": focal_loss(gamma=2.0, alpha=0.25)},
            compile=False,
        )
        _model_loaded = True
        print("[ml_model] Model loaded successfully.")
        return True
    except Exception as e:
        print(f"[ml_model] Failed to load model: {e}")
        return False


def _normalize_boneage(boneage: float) -> float:
    """MinMax normalize boneage to [0, 1] using training dataset range."""
    return float(np.clip((boneage - _scaler_min) / (_scaler_max - _scaler_min), 0.0, 1.0))


def _load_image_tensor(image_path: str):
    """Load image from disk and convert to model-ready tensor."""
    img_raw = tf.io.read_file(image_path)
    img = tf.image.decode_image(img_raw, channels=1, expand_animations=False)
    img = tf.image.grayscale_to_rgb(img)
    img = tf.image.resize(img, IMG_SIZE)
    img = tf.cast(img, tf.float32)
    return tf.expand_dims(img, 0)  # (1, 224, 224, 3)


def _get_last_conv_layer_name(model) -> str:
    """Find the name of the last Conv2D layer for Grad-CAM."""
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    # Look inside nested sub-models (EfficientNet base)
    for layer in reversed(model.layers):
        if hasattr(layer, "layers"):
            for sub in reversed(layer.layers):
                if isinstance(sub, tf.keras.layers.Conv2D):
                    return sub.name
    return None


def _generate_gradcam(img_tensor, tab_tensor, model, last_conv_name: str, pred_index: int) -> np.ndarray:
    """Generate a Grad-CAM heatmap."""
    try:
        try:
            conv_layer = model.get_layer(last_conv_name)
        except ValueError:
            conv_layer = None
            for layer in model.layers:
                if hasattr(layer, "layers"):
                    try:
                        conv_layer = layer.get_layer(last_conv_name)
                        break
                    except ValueError:
                        continue
        if conv_layer is None:
            return None

        grad_model = Model(inputs=model.inputs, outputs=[conv_layer.output, model.output])
        tab_t = tf.convert_to_tensor(tab_tensor, dtype=tf.float32)

        with tf.GradientTape() as tape:
            conv_out, preds = grad_model([img_tensor, tab_t], training=False)
            class_score = preds[:, pred_index]

        grads = tape.gradient(class_score, conv_out)
        pooled = tf.reduce_mean(grads, axis=(0, 1, 2))
        heatmap = conv_out[0] @ pooled[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0)
        heatmap = heatmap / (tf.reduce_max(heatmap) + 1e-8)
        return heatmap.numpy()
    except Exception as e:
        print(f"[ml_model] Grad-CAM failed: {e}")
        return None


def _apply_clahe(gray_img: np.ndarray) -> np.ndarray:
    """Apply CLAHE contrast enhancement to X-ray image."""
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    return clahe.apply(gray_img)


def _save_gradcam_overlay(image_path: str, heatmap: np.ndarray) -> str:
    """Save Grad-CAM overlay image and return path."""
    img_gray = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img_gray is None:
        return None
    img_gray = cv2.resize(img_gray, IMG_SIZE)
    img_gray_clahe = _apply_clahe(img_gray)
    img_rgb = cv2.cvtColor(img_gray_clahe, cv2.COLOR_GRAY2RGB)

    heatmap_resized = cv2.resize(heatmap, IMG_SIZE)
    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(img_rgb, 0.5, heatmap_colored, 0.5, 0)

    out_path = Path(image_path).parent / f"gradcam_{Path(image_path).stem}.jpg"
    overlay_bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
    cv2.imwrite(str(out_path), overlay_bgr)
    return str(out_path)


def _heuristic_predict(boneage: float, is_male: bool) -> dict:
    """
    Rule-based fallback when model is not available.
    Higher bone age → higher risk (older bones more brittle).
    Female → slightly higher risk.
    """
    # Normalize score 0-1
    age_factor = min(boneage / 200.0, 1.0)
    gender_factor = 0.05 if not is_male else 0.0

    score = age_factor + gender_factor

    if score < 0.45:
        risk_class = 0
    elif score < 0.75:
        risk_class = 1
    else:
        risk_class = 2

    # Simulate probabilities
    probs = [0.1, 0.1, 0.1]
    probs[risk_class] = 0.75 + np.random.uniform(0, 0.2)
    remaining = 1.0 - probs[risk_class]
    other = [i for i in range(3) if i != risk_class]
    probs[other[0]] = remaining * 0.6
    probs[other[1]] = remaining * 0.4

    return {
        "risk_class": risk_class,
        "risk_label": RISK_LABELS[risk_class],
        "confidence": probs[risk_class],
        "all_probabilities": {RISK_LABELS[i]: probs[i] for i in range(3)},
        "recommendation": RECOMMENDATIONS[risk_class],
        "gradcam_path": None,
        "mode": "heuristic",
    }


def predict_risk(image_path: str, boneage: float, is_male: bool) -> dict:
    """
    Main prediction function.
    Returns dict with risk_class, risk_label, confidence, all_probabilities,
    recommendation, gradcam_path.
    """
    model_ok = _load_model()

    if not model_ok or _model is None:
        return _heuristic_predict(boneage, is_male)

    try:
        img_tensor = _load_image_tensor(image_path)
        age_norm = _normalize_boneage(boneage)
        tab_tensor = np.array([[age_norm, float(int(is_male))]], dtype="float32")

        probs = _model.predict([img_tensor, tab_tensor], verbose=0)[0]
        risk_class = int(np.argmax(probs))
        confidence = float(probs[risk_class])

        # Grad-CAM
        gradcam_path = None
        last_conv = _get_last_conv_layer_name(_model)
        if last_conv:
            heatmap = _generate_gradcam(img_tensor, tab_tensor, _model, last_conv, risk_class)
            if heatmap is not None:
                gradcam_path = _save_gradcam_overlay(image_path, heatmap)

        return {
            "risk_class": risk_class,
            "risk_label": RISK_LABELS[risk_class],
            "confidence": confidence,
            "all_probabilities": {RISK_LABELS[i]: float(probs[i]) for i in range(3)},
            "recommendation": RECOMMENDATIONS[risk_class],
            "gradcam_path": gradcam_path,
            "mode": "model",
        }
    except Exception as e:
        print(f"[ml_model] Prediction error: {e}. Falling back to heuristic.")
        return _heuristic_predict(boneage, is_male)


def get_model_status() -> str:
    model_ok = _load_model()
    if model_ok:
        return "loaded"
    if not TF_AVAILABLE:
        return "tensorflow_not_installed"
    if not os.path.exists(MODEL_PATH):
        return f"model_file_not_found ({MODEL_PATH})"
    return "load_failed"
