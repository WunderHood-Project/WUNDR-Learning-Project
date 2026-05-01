import os,bson

SCRUB_RULES = {
    "Users": ["email", "password", "phoneNumber", "address", "city", "state", "zipCode"],
    "Children": ["firstName", "lastName", "preferredName", "allergiesMedical", "notes", "waiverSignedByName"],
    "EmergencyContact": ["firstName", "lastName", "phoneNumber"],
    "Volunteers": ["email", "phoneNumber", "firstName", "lastName"],
    "PartnerApplications": ["email", "phone", "contactName", "orgName"],
    "TaxReturnCredentials": ["email", "address", "address2", "city", "state", "phoneNumber", "firstName", "lastName"],
    "Donations": ["email"],
}

DB_NAME = "WonderHood"  # replace with your actual prod DATABASE_NAME
dump_path = f"./dump/{DB_NAME}"

for collection, fields in SCRUB_RULES.items():
    path = os.path.join(dump_path, f"{collection}.bson")
    if not os.path.exists(path):
        continue
    with open(path, "rb") as f:
        docs = bson.decode_all(f.read())
    for doc in docs:
        for field in fields:
            if field in doc:
                doc[field] = f"redacted_{doc['_id']}"
    with open(path, "wb") as f:
        for doc in docs:
            f.write(bson.encode(doc))
    print(f"Scrubbed {collection}: {len(docs)} docs")