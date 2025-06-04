import requests

BASE_URL = "http://localhost:4567/api"
MASTER_TOKEN = "supersecrettoken"  # Use the token from your config.json

HEADERS = {
    "Authorization": f"Bearer {MASTER_TOKEN}"
}

def create_user(username, email, password):
    payload = {
        "username": username,
        "email": email,
        "password": password
    }
    res = requests.post(f"{BASE_URL}/v3/users", json=payload, headers=HEADERS)
    if res.ok:
        print(f"✅ Created user: {username}")
        return res.json()["payload"]["uid"]
    else:
        print(f"❌ Failed to create user {username}: {res.text}")
        return None

def create_category(name, description=""):
    payload = {
        "name": name,
        "description": description
    }
    res = requests.post(f"{BASE_URL}/v3/categories", json=payload, headers=HEADERS)
    if res.ok:
        print(f"✅ Created category: {name}")
        return res.json()["payload"]["cid"]
    else:
        print(f"❌ Failed to create category {name}: {res.text}")
        return None

def create_topic(cid, title, content, uid):
    payload = {
        "cid": cid,
        "title": title,
        "content": content,
        "uid": uid
    }
    res = requests.post(f"{BASE_URL}/v3/topics", json=payload, headers=HEADERS)
    if res.ok:
        print(f"✅ Created topic: {title}")
    else:
        print(f"❌ Failed to create topic: {res.text}")

def main():
    # Create mock users
    user_ids = []
    for i in range(3):
        uid = create_user(f"user{i}", f"user{i}@example.com", "password123")
        if uid:
            user_ids.append(uid)

    # Create a category
    cid = create_category("Mock Category", "For testing content")

    # Add topics by each user
    if cid:
        for i, uid in enumerate(user_ids):
            create_topic(cid, f"Sample Topic {i+1}", "This is example content.", uid)

if __name__ == "__main__":
    main()
