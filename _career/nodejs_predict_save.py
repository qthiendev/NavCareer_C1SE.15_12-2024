import sys
import json
import pandas as pd
import os

# Define paths
base_dir = os.path.dirname(__file__)
career_codes_path = os.path.join(base_dir, 'data', 'careers.csv')
responses_path = os.path.join(base_dir, 'data', 'responses.csv')

def load_career_codes():
    return pd.read_csv(career_codes_path)

def load_responses():
    if os.path.exists(responses_path):
        return pd.read_csv(responses_path)
    return pd.DataFrame(columns=[f"Q{i+1}" for i in range(30)] + ["Code"])

def save_response(responses, code):
    response_data = responses + [code]
    new_entry_df = pd.DataFrame([response_data], columns=[f"Q{i+1}" for i in range(30)] + ["Code"])
    new_entry_df.to_csv(responses_path, mode='a', header=not os.path.exists(responses_path), index=False)
    return f"Response saved with code {code}"

try:
    # Parse arguments
    input_data = json.loads(sys.argv[1])
    job_name = sys.argv[2]

    # Validate input length
    if len(input_data) != 30:
        raise ValueError("Please ensure exactly 30 responses are entered.")
    
    # Load data
    career_codes = load_career_codes()
    responses_df = load_responses()
    
    # Check if job name exists and get code, or assign a new code
    if job_name in career_codes['Career Name'].values or job_name in career_codes['Career Name (Vietnamese)'].values:
        code = career_codes.loc[(career_codes['Career Name'] == job_name) | (career_codes['Career Name (Vietnamese)'] == job_name), 'Code'].values[0]
    else:
        # Assign new code
        code = career_codes['Code'].max() + 1
        new_career_entry = pd.DataFrame([[code, job_name, job_name]], columns=["Code", "Career Name", "Career Name (Vietnamese)"])
        career_codes = pd.concat([career_codes, new_career_entry], ignore_index=True)
        career_codes.to_csv(career_codes_path, index=False)

    # Save response
    message = save_response(input_data, code)
    print(message)
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
