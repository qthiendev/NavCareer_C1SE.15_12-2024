import pandas as pd
import numpy as np
import random
import os

career_archetypes = {
    1: "IT", 2: "Software Engineering", 3: "Management Information Systems", 4: "Human Resources",
    5: "Marketing", 6: "Business Administration", 7: "Financial Analysis", 8: "Accounting",
    9: "Teaching", 10: "Healthcare", 11: "Hospitality & Tourism", 12: "Event Management",
    13: "Arts & Design", 14: "Law", 15: "Mechanical & Automation Engineering", 16: "Food Technology",
    17: "Hotel Management", 18: "Language & Translation", 19: "Logistics", 20: "Director",
    21: "Government Services", 22: "Bartending", 23: "Aviation", 24: "Primary Education",
    25: "Software Quality Assurance", 26: "Sales", 27: "Semiconductor Industry", 28: "Criminal Justice",
    29: "Agriculture", 30: "Graphic Design", 31: "Cybersecurity", 32: "Data Science", 33: "Game Development",
    34: "Project Management", 35: "Supply Chain Management", 36: "Customer Service", 37: "UX Design",
    38: "Product Management", 39: "Environmental Science", 40: "Healthcare Administration",
    41: "Biotechnology", 42: "Banking", 43: "Insurance", 44: "Real Estate", 45: "Pharmaceuticals",
    46: "Sales Management", 47: "Public Relations", 48: "Political Science", 49: "Economics",
    50: "Urban Planning", 51: "Construction Management", 52: "Veterinary Science", 53: "Chemical Engineering",
    54: "Electrical Engineering", 55: "Mechanical Engineering", 56: "Civil Engineering", 57: "Agricultural Engineering",
    58: "Energy Engineering", 59: "Marine Biology", 60: "Geology", 61: "Physics", 62: "Astronomy",
    63: "History", 64: "Sociology", 65: "Psychology", 66: "Philosophy", 67: "Journalism",
    68: "Literature", 69: "Photography", 70: "Film Studies", 71: "Theater Arts", 72: "Music Production",
    73: "Dance", 74: "Anthropology", 75: "Linguistics", 76: "Social Work", 77: "Archaeology",
    78: "Fashion Design", 79: "Interior Design", 80: "Landscape Architecture", 81: "Architecture",
    82: "Museum Studies", 83: "Art History", 84: "Library Science", 85: "Forensic Science",
    86: "Astronautics", 87: "Metallurgy", 88: "Robotics", 89: "Nanotechnology", 90: "Biomedical Engineering",
    91: "Public Administration", 92: "Fire Science", 93: "Criminology", 94: "Risk Management",
    95: "Healthcare Management", 96: "Speech Pathology", 97: "Nutrition", 98: "Occupational Therapy",
    99: "Physical Therapy", 100: "Other"
}

archetype_patterns = {
    1: [0.1, 0.1, 0.2, 0.3, 0.3],  # IT
    2: [0.1, 0.2, 0.2, 0.3, 0.2],  # Software Engineering
    3: [0.15, 0.2, 0.25, 0.25, 0.15],  # Management Information Systems
    4: [0.3, 0.2, 0.2, 0.2, 0.1],  # Human Resources
    5: [0.2, 0.3, 0.2, 0.2, 0.1],  # Marketing
    6: [0.25, 0.25, 0.2, 0.2, 0.1],  # Business Administration
    7: [0.2, 0.2, 0.25, 0.2, 0.15],  # Financial Analysis
    8: [0.3, 0.25, 0.2, 0.15, 0.1],  # Accounting
    9: [0.3, 0.3, 0.2, 0.1, 0.1],  # Teaching
    10: [0.2, 0.2, 0.2, 0.2, 0.2],  # Healthcare
    11: [0.2, 0.25, 0.2, 0.2, 0.15],  # Hospitality & Tourism
    12: [0.25, 0.25, 0.2, 0.15, 0.15],  # Event Management
    13: [0.4, 0.3, 0.2, 0.05, 0.05],  # Arts & Design
    14: [0.25, 0.3, 0.25, 0.1, 0.1],  # Law
    15: [0.15, 0.2, 0.25, 0.25, 0.15],  # Mechanical & Automation Engineering
    16: [0.2, 0.2, 0.2, 0.2, 0.2],  # Food Technology
    17: [0.2, 0.25, 0.25, 0.15, 0.15],  # Hotel Management
    18: [0.25, 0.3, 0.2, 0.15, 0.1],  # Language & Translation
    19: [0.15, 0.2, 0.25, 0.25, 0.15],  # Logistics
    20: [0.2, 0.25, 0.25, 0.15, 0.15],  # Director
    21: [0.3, 0.25, 0.2, 0.15, 0.1],  # Government Services
    22: [0.25, 0.3, 0.2, 0.15, 0.1],  # Bartending
    23: [0.15, 0.2, 0.3, 0.2, 0.15],  # Aviation
    24: [0.25, 0.3, 0.2, 0.15, 0.1],  # Primary Education
    25: [0.15, 0.2, 0.25, 0.25, 0.15],  # Software Quality Assurance
    26: [0.2, 0.2, 0.25, 0.25, 0.1],  # Sales
    27: [0.2, 0.25, 0.25, 0.2, 0.1],  # Semiconductor Industry
    28: [0.3, 0.2, 0.2, 0.2, 0.1],  # Criminal Justice
    29: [0.25, 0.25, 0.25, 0.15, 0.1],  # Agriculture
    30: [0.3, 0.25, 0.2, 0.15, 0.1],  # Graphic Design
    31: [0.15, 0.2, 0.25, 0.25, 0.15],  # Cybersecurity
    32: [0.2, 0.2, 0.2, 0.2, 0.2],  # Data Science
    33: [0.15, 0.25, 0.25, 0.2, 0.15],  # Game Development
    34: [0.2, 0.2, 0.2, 0.2, 0.2],  # Project Management
    35: [0.15, 0.2, 0.25, 0.25, 0.15],  # Supply Chain Management
    36: [0.2, 0.3, 0.2, 0.15, 0.15],  # Customer Service
    37: [0.25, 0.25, 0.2, 0.15, 0.15],  # UX Design
    38: [0.2, 0.25, 0.2, 0.2, 0.15],  # Product Management
    39: [0.25, 0.25, 0.2, 0.15, 0.15],  # Environmental Science
    40: [0.3, 0.25, 0.2, 0.15, 0.1],  # Healthcare Administration
    41: [0.2, 0.3, 0.25, 0.15, 0.1],  # Biotechnology
    42: [0.25, 0.2, 0.3, 0.15, 0.1],  # Banking
    43: [0.2, 0.25, 0.3, 0.15, 0.1],  # Insurance
    44: [0.15, 0.3, 0.25, 0.2, 0.1],  # Real Estate
    45: [0.2, 0.3, 0.2, 0.2, 0.1],  # Pharmaceuticals
    46: [0.15, 0.2, 0.3, 0.2, 0.15],  # Sales Management
    47: [0.25, 0.25, 0.2, 0.2, 0.1],  # Public Relations
    48: [0.3, 0.2, 0.25, 0.15, 0.1],  # Political Science
    49: [0.25, 0.25, 0.2, 0.15, 0.15],  # Economics
    50: [0.2, 0.2, 0.25, 0.2, 0.15],  # Urban Planning
    51: [0.25, 0.2, 0.25, 0.15, 0.15],  # Construction Management
    52: [0.2, 0.3, 0.2, 0.2, 0.1],  # Veterinary Science
    53: [0.15, 0.25, 0.25, 0.25, 0.1],  # Chemical Engineering
    54: [0.15, 0.2, 0.25, 0.3, 0.1],  # Electrical Engineering
    55: [0.2, 0.2, 0.2, 0.2, 0.2],  # Mechanical Engineering
    56: [0.3, 0.25, 0.2, 0.15, 0.1],  # Civil Engineering
    57: [0.25, 0.25, 0.2, 0.15, 0.15],  # Agricultural Engineering
    58: [0.25, 0.2, 0.25, 0.15, 0.15],  # Energy Engineering
    59: [0.3, 0.25, 0.2, 0.15, 0.1],  # Marine Biology
    60: [0.2, 0.25, 0.2, 0.2, 0.15],  # Geology
    61: [0.25, 0.25, 0.2, 0.15, 0.15],  # Physics
    62: [0.2, 0.2, 0.3, 0.15, 0.15],  # Astronomy
    63: [0.3, 0.2, 0.25, 0.15, 0.1],  # History
    64: [0.2, 0.3, 0.25, 0.15, 0.1],  # Sociology
    65: [0.25, 0.3, 0.2, 0.15, 0.1],  # Psychology
    66: [0.2, 0.25, 0.3, 0.15, 0.1],  # Philosophy
    67: [0.3, 0.25, 0.2, 0.15, 0.1],  # Journalism
    68: [0.25, 0.3, 0.2, 0.15, 0.1],  # Literature
    69: [0.2, 0.2, 0.25, 0.25, 0.1],  # Photography
    70: [0.15, 0.3, 0.25, 0.2, 0.1],  # Film Studies
    71: [0.25, 0.25, 0.2, 0.15, 0.15],  # Theater Arts
    72: [0.2, 0.3, 0.2, 0.2, 0.1],  # Music Production
    73: [0.3, 0.25, 0.2, 0.15, 0.1],  # Dance
    74: [0.25, 0.3, 0.2, 0.15, 0.1],  # Anthropology
    75: [0.2, 0.25, 0.2, 0.15, 0.2],  # Linguistics
    76: [0.3, 0.2, 0.25, 0.2, 0.05],  # Social Work
    77: [0.25, 0.25, 0.2, 0.2, 0.1],  # Archaeology
    78: [0.2, 0.3, 0.25, 0.15, 0.1],  # Fashion Design
    79: [0.2, 0.2, 0.3, 0.15, 0.15],  # Interior Design
    80: [0.3, 0.2, 0.25, 0.15, 0.1],  # Landscape Architecture
    81: [0.2, 0.3, 0.2, 0.2, 0.1],  # Architecture
    82: [0.25, 0.25, 0.2, 0.15, 0.15],  # Museum Studies
    83: [0.3, 0.25, 0.2, 0.15, 0.1],  # Art History
    84: [0.25, 0.3, 0.2, 0.15, 0.1],  # Library Science
    85: [0.15, 0.3, 0.25, 0.2, 0.1],  # Forensic Science
    86: [0.25, 0.25, 0.2, 0.2, 0.1],  # Astronautics
    87: [0.2, 0.25, 0.3, 0.15, 0.1],  # Metallurgy
    88: [0.25, 0.25, 0.25, 0.15, 0.1],  # Robotics
    89: [0.2, 0.3, 0.25, 0.15, 0.1],  # Nanotechnology
    90: [0.3, 0.25, 0.2, 0.15, 0.1],  # Biomedical Engineering
    91: [0.25, 0.2, 0.2, 0.15, 0.2],  # Public Administration
    92: [0.3, 0.25, 0.2, 0.15, 0.1],  # Fire Science
    93: [0.2, 0.2, 0.25, 0.2, 0.15],  # Criminology
    94: [0.25, 0.3, 0.2, 0.15, 0.1],  # Risk Management
    95: [0.2, 0.2, 0.3, 0.15, 0.15],  # Healthcare Management
    96: [0.2, 0.25, 0.3, 0.15, 0.1],  # Speech Pathology
    97: [0.2, 0.3, 0.2, 0.2, 0.1],  # Nutrition
    98: [0.3, 0.2, 0.2, 0.2, 0.1],  # Occupational Therapy
    99: [0.15, 0.2, 0.3, 0.2, 0.15],  # Physical Therapy
    100: [0.2, 0.2, 0.2, 0.2, 0.2]   # Other
}


num_samples = 30000
question_count = 30
generated_data = []

# Path for responses.csv
responses_path = "./data/responses.csv"

# Generate synthetic responses
generated_data = []
for _ in range(num_samples):
    career_code = random.choice(list(career_archetypes.keys()))
    pattern = archetype_patterns.get(career_code, [0.2, 0.2, 0.2, 0.2, 0.2])
    answers = [np.random.choice([1, 2, 3, 4, 5], p=pattern) for _ in range(question_count)]
    generated_data.append(answers + [career_code])

# Convert to DataFrame
responses_df = pd.DataFrame(generated_data, columns=[f"Q{i+1}" for i in range(question_count)] + ["Career_Code"])

# Append or create `responses.csv`
if os.path.exists(responses_path):
    responses_df.to_csv(responses_path, mode='a', header=False, index=False)
else:
    responses_df.to_csv(responses_path, mode='w', header=True, index=False)

print(f"{num_samples} Data appended to '{responses_path}' successfully.")
k = input()
