import pandas as pd
import joblib
import re
import numpy as np
import os

# File paths
career_codes_path = './data/careers.csv'
model_path = './models/career_predictor_model.pkl'
scaler_path = './models/scaler.pkl'
responses_path = './data/responses.csv'

# Load files
career_codes = pd.read_csv(career_codes_path)
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

def parse_responses(response_string):
    matches = re.findall(r"\d+", response_string)
    responses = list(map(int, matches))
    if len(responses) != 30:
        raise ValueError("Please ensure exactly 30 responses are entered.")
    return responses

def predict_career(responses):
    responses_scaled = scaler.transform([responses])
    predicted_code = model.predict(responses_scaled)[0]
    career_name = career_codes.loc[career_codes['Code'] == predicted_code, 'Career Name'].values[0]
    return predicted_code, career_name

def new_response(responses, job_name):
    existing_job = career_codes[(career_codes['Career Name'] == job_name) | (career_codes['Career Name (Vietnamese)'] == job_name)]
    
    if not existing_job.empty:
        correct_code = existing_job.iloc[0]['Code']
    else:
        correct_code = career_codes['Code'].max() + 1
        new_career_entry = pd.DataFrame([[correct_code, job_name, job_name]], columns=['Code', 'Career Name', 'Career Name (Vietnamese)'])
        new_career_entry.to_csv(career_codes_path, mode='a', header=False, index=False)
        print(f"New career '{job_name}' added with code {correct_code}.")

    new_entry = responses + [correct_code]
    new_entry_df = pd.DataFrame([new_entry], columns=[f'Q{i+1}' for i in range(30)] + ['Code'])
    
    if not os.path.exists(responses_path):
        new_entry_df.to_csv(responses_path, mode='w', header=True, index=False)
    else:
        new_entry_df.to_csv(responses_path, mode='a', header=False, index=False)

    print(f"Response saved to {responses_path} with job code {correct_code}.")

response_string = input("Enter your responses in the format {1, 2, 5, 4, ...}: ").strip()
new_responses = parse_responses(response_string)

predicted_code, predicted_career = predict_career(new_responses)
print(f"Predicted Career: {predicted_code}: {predicted_career}")

user_input = input("Is this the right job? (y/n): ").strip().lower()
if user_input == 'y':
    new_response(new_responses, predicted_career)
else:
    correct_job_name = input("Enter the correct job name: ").strip()
    new_response(new_responses, correct_job_name)
