import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from imblearn.combine import SMOTEENN
import joblib
import os
import numpy as np

# File paths
survey_data_path = './data/responses.csv'
career_codes_path = './data/careers.csv'
model_output_path = './models/career_predictor_model.pkl'
scaler_output_path = './models/scaler.pkl'

# Load data
survey_data = pd.read_csv(survey_data_path)

# Filter out classes with very low sample sizes
min_samples_per_class = 2
class_counts = survey_data['Career_Code'].value_counts()
filtered_data = survey_data[survey_data['Career_Code'].isin(class_counts[class_counts >= min_samples_per_class].index)]

# Split features and labels
X = filtered_data.drop(columns=['Career_Code'])
y = filtered_data['Career_Code']

# Apply SMOTEENN for balanced resampling
sm = SMOTEENN(sampling_strategy='auto')
X_resampled, y_resampled = sm.fit_resample(X, y)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Hyperparameter tuning for RandomForest
param_grid = {
    'n_estimators': [100, 200, 500],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'bootstrap': [True, False]
}

# Initialize the model
rf = RandomForestClassifier(random_state=42)
rf_random = RandomizedSearchCV(estimator=rf, param_distributions=param_grid, n_iter=50, cv=3, verbose=2, random_state=42, n_jobs=-1)
rf_random.fit(X_train, y_train)

# Best Model Evaluation
best_rf = rf_random.best_estimator_
y_pred = best_rf.predict(X_test)
print("RandomForest with Hyperparameter Tuning")
print(classification_report(y_test, y_pred))

# Train a GradientBoostingClassifier for ensemble comparison
gbc = GradientBoostingClassifier(random_state=42)
gbc.fit(X_train, y_train)
y_pred_gbc = gbc.predict(X_test)
print("GradientBoostingClassifier Results")
print(classification_report(y_test, y_pred_gbc))

# Save best performing model and scaler
final_model = best_rf if best_rf.score(X_test, y_test) > gbc.score(X_test, y_test) else gbc

os.makedirs('./models', exist_ok=True)
joblib.dump(final_model, model_output_path)
joblib.dump(scaler, scaler_output_path)
print("Best Model and scaler saved to './models'")
k = input()
