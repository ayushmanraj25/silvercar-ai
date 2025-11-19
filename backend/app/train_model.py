import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# -------------------------------
# 1. Load dataset
# -------------------------------
csv_path = os.path.join(os.path.dirname(__file__), "../data/health_data.csv")
csv_path = os.path.normpath(csv_path)

print(f"Loading dataset from: {csv_path}")

df = pd.read_csv(csv_path)

# Ensure column order is correct
expected_cols = ["age", "heartRate", "temperature", "oxygen", "bp_sys", "bp_dia", "status"]
df.columns = expected_cols  # overwrite if needed


# -------------------------------
# 2. Encode labels
# -------------------------------
label_encoder = LabelEncoder()
df["status_encoded"] = label_encoder.fit_transform(df["status"])

print("Label Mapping:")
for k, v in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)):
    print(f"  {k} -> {v}")

# -------------------------------
# 3. Prepare features and target
# -------------------------------
X = df[["age", "heartRate", "temperature", "oxygen", "bp_sys", "bp_dia"]]
y = df["status_encoded"]

# -------------------------------
# 4. Train-test split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# -------------------------------
# 5. Train Model
# -------------------------------
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)

# -------------------------------
# 6. Evaluate
# -------------------------------
y_pred = model.predict(X_test)

print("\nModel Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# -------------------------------
# 7. Save Model
# -------------------------------
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
model_path = os.path.normpath(model_path)

joblib.dump(model, model_path)

print(f"\nModel saved to: {model_path}")
print("\nTraining complete ✔️")
