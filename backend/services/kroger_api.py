import requests
import base64
import os
from dotenv import load_dotenv

load_dotenv()
# Currently always returning a credentials error, will fix soon 
def get_kroger_access_token():
    client_id = os.getenv("KROGER_CLIENT_ID")
    client_secret = os.getenv("KROGER_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise Exception("Missing Kroger Client ID or Secret.")

    # Encode the client_id and client_secret
    auth_str = f"{client_id}:{client_secret}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {b64_auth}"
    }

    # Properly encode as x-www-form-urlencoded
    data = "grant_type=client_credentials&scope=product.compact"

    response = requests.post("https://api.kroger.com/v1/connect/oauth2/token", headers=headers, data=data)

    if response.status_code != 200:
        print("ERROR:", response.status_code)
        print("RESPONSE:", response.text)
        raise Exception("Failed to get access token.")

    return response.json()['access_token']

# Try calling the function
token = get_kroger_access_token()
print("Access token:", token)
