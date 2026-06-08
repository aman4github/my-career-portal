from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app) 

DATABASE = 'career_progress.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        # Table for Skill Checkboxes (Completed items)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS skill_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT,
                skill_name TEXT,
                is_completed INTEGER,
                UNIQUE(user_email, skill_name)
            )
        ''')
        # Table for Persistent Dashboard Analysis (The whole AI Result)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS last_analysis (
                user_email TEXT PRIMARY KEY,
                analysis_json TEXT
            )
        ''')
        conn.commit()

# --- SKILL UPGRADATION ROUTES ---

@app.route('/get-progress', methods=['GET'])
def get_progress():
    email = request.args.get('email')
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT skill_name FROM skill_progress WHERE user_email = ? AND is_completed = 1", (email,))
        completed = [row[0] for row in cursor.fetchall()]
    return jsonify({"completedSkills": completed})

@app.route('/toggle-skill', methods=['POST'])
def toggle_skill():
    data = request.json
    email = data.get('email')
    skill = data.get('skill')
    status = data.get('status') 
    
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO skill_progress (user_email, skill_name, is_completed)
            VALUES (?, ?, ?)
        ''', (email, skill, status))
        conn.commit()
    return jsonify({"message": "Status updated"})

# NEW: Route to get only the missing skills list for the Upgradation page
@app.route('/get-missing-skills', methods=['GET'])
def get_missing_skills():
    email = request.args.get('email')
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT analysis_json FROM last_analysis WHERE user_email = ?", (email,))
        row = cursor.fetchone()
    
    if row:
        analysis = json.loads(row[0])
        return jsonify({"missingSkills": analysis.get('missingSkills', [])})
    return jsonify({"missingSkills": []})

# --- DASHBOARD PERSISTENCE ROUTES ---

@app.route('/save-analysis', methods=['POST'])
def save_analysis():
    data = request.json
    email = data.get('email')
    analysis = data.get('analysis') # JSON string from React
    
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO last_analysis (user_email, analysis_json)
            VALUES (?, ?)
        ''', (email, analysis))
        conn.commit()
    return jsonify({"status": "success", "message": "Analysis persisted"})

@app.route('/get-analysis', methods=['GET'])
def get_analysis():
    email = request.args.get('email')
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT analysis_json FROM last_analysis WHERE user_email = ?", (email,))
        row = cursor.fetchone()
    
    return jsonify({"analysis": row[0] if row else None})

if __name__ == '__main__':
    init_db()
    app.run(port=5000, debug=True)