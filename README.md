# BiteBuddy

Stuff here about features 

## Setup Instructions
1. clone the repo
```bash
git clone https://github.com/your-username/track-your-reps.git
cd reptracker/backend
```
2. Create local environment
```
cd backend
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
```
3. Install dependencies
```
pip install -r requirements.txt
```
4. To run the app, you must put the following in a `.env` file (Note: verify it's ignored in the .gitignore file):
```
SPOONACULAR_API_KEY=api_key_here 
GEMINI_API_KEY=api_key_here
```
5. Run the app
```
python app.py
```
### Frontend Side
1. Navigate to frontend directory
```
cd ../frontend
```
2. Install frontend dependencies
```
npm install
```
3. Start the server
```
npm run dev
```