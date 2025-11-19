#!/usr/bin/env python3
"""
predict_health.py

Usage (CLI):
  python3 predict_health.py <age> <heartRate> <temperature> <oxygen> <bp_sys> <bp_dia>

Example:
  python3 predict_health.py 70 150 104.2 85 180 100
"""

import sys
import os
import joblib
import numpy as np

# Try pandas only if needed (to build DataFrame for feature names)
try:
    import pandas as pd
except Exception:
    pd = None

def load_model_try_paths():
    """Try several relative paths to find model.pkl (returns model or None)."""
    script_dir = os.path.dirname(os.path.realpath(__file__))
    candidates = [
        os.path.join(script_dir, "model.pkl"),
        os.path.join(script_dir, "../model.pkl"),
        os.path.join(script_dir, "app/model.pkl"),
        os.path.join(script_dir, "../app/model.pkl"),
        os.path.join(script_dir, "../../backend/app/model.pkl"),
        os.path.join(script_dir, "../../app/model.pkl"),
    ]
    for p in candidates:
        p = os.path.normpath(p)
        if os.path.exists(p):
            try:
                model = joblib.load(p)
                # print debug to stderr
                print(f"DEBUG: Loaded model from {p}", file=sys.stderr)
                return model
            except Exception as e:
                print(f"DEBUG: Found model file but failed to load {p}: {e}", file=sys.stderr)
    return None

def fallback_rule(age, hr, temp, ox, bp_sys, bp_dia):
    """
    Simple fallback rule-based predictor (conservative).
    Returns one of: "Normal", "Warning", "Critical"
    These thresholds are heuristic and used only when model file missing.
    """
    # Basic sanity corrections
    try:
        age = float(age)
        hr = float(hr)
        temp = float(temp)
        ox = float(ox)
        bp_sys = float(bp_sys)
        bp_dia = float(bp_dia)
    except Exception:
        return "Normal"

    score = 0

    # heart rate
    if hr >= 140 or hr <= 30:
        score += 3
    elif hr >= 110 or hr <= 40:
        score += 2
    elif hr >= 100:
        score += 1

    # temperature (F)
    if temp >= 104 or temp <= 92:
        score += 3
    elif temp >= 102 or temp <= 94:
        score += 2
    elif temp >= 100:
        score += 1

    # oxygen
    if ox < 85:
        score += 4
    elif ox < 90:
        score += 2
    elif ox < 94:
        score += 1

    # blood pressure extremes
    if bp_sys >= 180 or bp_dia >= 120:
        score += 3
    elif bp_sys >= 160 or bp_dia >= 100:
        score += 2

    # age factor
    if age >= 75:
        score += 1

    if score >= 6:
        return "Critical"
    if score >= 3:
        return "Warning"
    return "Normal"

def main(argv):
    if len(argv) < 7:
        print("ERROR: missing args", file=sys.stderr)
        print("Usage: predict_health.py <age> <heartRate> <temperature> <oxygen> <bp_sys> <bp_dia>", file=sys.stderr)
        sys.exit(1)

    # Read args (strings)
    age, heart_rate, temperature, oxygen, bp_sys, bp_dia = argv[1:7]

    # Try to load model
    model = load_model_try_paths()

    # Prepare features vector (float)
    try:
        features = np.array([[float(age), float(heart_rate), float(temperature), float(oxygen), float(bp_sys), float(bp_dia)]])
    except Exception as e:
        # on bad values, fallback to Normal
        print(f"DEBUG: Bad numeric conversion: {e}", file=sys.stderr)
        print("Normal")
        return

    if model is None:
        # fallback rule
        pred = fallback_rule(age, heart_rate, temperature, oxygen, bp_sys, bp_dia)
        print(pred)
        return

    # If model exists, attempt to feed it properly
    X = features
    # If model expects feature names (sklearn has attribute)
    try:
        feature_names = getattr(model, "feature_names_in_", None)
        if feature_names is not None and pd is not None:
            # build DataFrame with correct column order
            df = pd.DataFrame(X, columns=feature_names)
            X = df
    except Exception as e:
        # ignore and pass raw numpy array
        print(f"DEBUG: while preparing DataFrame: {e}", file=sys.stderr)

    try:
        y_pred = model.predict(X)
    except Exception as e:
        # If predict fails (shape mismatch), try trimming or fallback
        print(f"DEBUG: model.predict failed: {e}", file=sys.stderr)
        # Try with only first 4 features (older model)
        try:
            y_pred = model.predict(np.array([[float(age), float(heart_rate), float(temperature), float(oxygen)]]))
        except Exception as e2:
            print(f"DEBUG: fallback predict also failed: {e2}", file=sys.stderr)
            # final fallback
            pred = fallback_rule(age, heart_rate, temperature, oxygen, bp_sys, bp_dia)
            print(pred)
            return

    # y_pred might be array of ints or strings
    label = y_pred[0]
    # If numeric, map to labels (common mapping)
    if isinstance(label, (int, np.integer)):
        mapping = {0: "Normal", 1: "Warning", 2: "Critical"}
        label = mapping.get(int(label), str(label))

    # Print the label only (stdout) — Node backend reads this
    print(str(label))

    # Also print probabilities to stderr for debugging if available
    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X)[0]
            # print to stderr so it doesn't interfere with stdout parsing
            print(f"DEBUG: probs={probs}", file=sys.stderr)
    except Exception as e:
        print(f"DEBUG: predict_proba failed: {e}", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv)
