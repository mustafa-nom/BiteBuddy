# BiteBuddy

BiteBuddy is an AI-powered nutrition planner that reduces food waste by generating personalized recipe ideas from ingredients you already have. It also creates customized meal plans based on your mood, dietary needs, and preferences.

## Key Features 

1. **Personalized Recipe Generation**
   - Enter your current mood or cravings (e.g., "I'm feeling cozy", "I want something to boost my energy") to get tailored recipe suggestions.
   - Uses **Google Gemini API** to interpret natural language queries and fetch relevant recipes from **Spoonacular API**.

2. **Smart Ingredient Matching**
   - Log ingredients available in your fridge/pantry via the **Fridge Page**.
   - Recipes prioritize using ingredients you already own to minimize food waste.

3. **Dietary Restriction Support**
   - Set preferences like vegan, gluten-free, halal, etc. which all recommendations will take into account.

4. **7-Day Meal Planning**
   - Generate a full week of meals based on your mood, dietary needs, and available ingredients.

5. **User Profiles & Storage**
   - **Firebase Authentication** for secure user login/signup.
   - **Firestore Database** to save:
     - Saved recipes and meal plans (visible on **Dashboard**).
     - Ingredients are saved to user's account (auto-populates the **Fridge Page**).

6. **API Integrations**
   - [**Spoonacular API**](https://spoonacular.com/food-api): Fetches recipes based on ingredients and dietary filters.
   - [**Google Gemini API**](https://ai.google.dev/gemini-api/docs): Enhances query understanding for mood-based recommendations.


## Setup Instructions
1. Clone the repo
```bash
git clone https://github.com/your_username/BiteBuddy.git
cd bitebuddy/backend
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
4. To run the app, you must put the following in a `.env` file & update their values (Note: verify it's ignored in the .gitignore file):
```
SPOONACULAR_API_KEY=api_key_here 
GEMINI_API_KEY=api_key_here
GEOAPIFY_API_KEY=api_key_here
GOOGLE_APPLICATION_CREDENTIALS=
REACT_APP_API_KEY= ""
REACT_APP_AUTH_DOMAIN= ""
REACT_APP_PROJECT_ID= ""
REACT_APP_STORAGE_BUCKET=""
REACT_APP_MESSAGING_SENDER_ID= ""
REACT_APP_APP_ID=""
REACT_APP_MEASUREMENT_ID="" 

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
