import sys
import json
import pandas as pd
import os
import joblib
import numpy as np
import warnings

warnings.simplefilter("ignore", UserWarning)

# Define paths
base_dir = os.path.dirname(__file__)
career_codes_path = os.path.join(base_dir, 'data', 'careers.csv')
model_path = os.path.join(base_dir, 'models', 'career_predictor_model.pkl')
scaler_path = os.path.join(base_dir, 'models', 'scaler.pkl')

try:
    # Parse input data
    input_data = json.loads(sys.argv[1])
    job_name = sys.argv[2] if len(sys.argv) > 2 else None

    # Validate input
    if len(input_data) != 30:
        raise ValueError("Please ensure exactly 30 responses are entered.")

    # Load model, scaler, and career codes
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    career_codes = pd.read_csv(career_codes_path)

    # Scale the input data
    input_data_scaled = scaler.transform([input_data])
    predicted_code = model.predict(input_data_scaled)[0]

    # Get career names
    career_name = career_codes.loc[career_codes['Code'] == predicted_code, 'Career Name'].values[0]
    career_name_vie = career_codes.loc[career_codes['Code'] == predicted_code, 'Career Name (Vietnamese)'].fillna("").values[0]

    # Output prediction result
    output = f"{predicted_code}, {career_name}, {career_name_vie}"
    sys.stdout.buffer.write(output.encode('utf-8'))

except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
