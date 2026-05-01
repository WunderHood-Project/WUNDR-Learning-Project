# WUNDR backend Instructions

## Getting Started with development environment

1. Ensure running from backend directory and:

    Activate virtual environment for Python 12 inside of the backend directory: 

        pyenv install 3.12.7
        pyenv local 3.12.7


    Create a virtual environment inside the ROOT directory and activate it:

        python -m venv .venv
        source .venv/bin/activate

    Install dependecies inside the backend directory: 
        
        pip install -r requirements.txt

2. Run Prisma commands:

        prisma generate
        prisma db push
        Clear PyCache using: find . -name "*.pyc" -delete

3. Run the server from the BACKEND directory using:

             1) python -m pip install uvicorn
    PROD  ->  2) python -m uvicorn main:app --reload

    STAGING -> 3) APP_ENV=staging uvicorn main:app --reload

    OLD    uvicorn backend.main:app --reload 

    - After starting the server, navigate to http://127.0.0.1:8000/ on your local device to being viewing endpoint responses.
    -Navigate to http://127.0.0.1:8000/docs for interactive API docs.

## How to set up Stripe sandbox (Test from the backend)

1. Install Stripe on your local device:

    brew install stripe/stripe-cli/stripe

2. Log in to Stripe using the below command:

    stripe login

3. Once logged in, listen to events with:

    stripe listen --forward-to localhost:8000/payments/webhook

4. You should now see a whsec value. This is the STRIPE_WEBHOOK_SECRET value that will live in the .env document. Copy and paste it there. Replace the value everytime the above stripe command is run.

    e.g. STRIPE_WEBHOOK_SECRET=whsec_12345abcde

## How to Test Stripe form in Development

1. Obtain the test secret key and add it to the backend/.env:

    e.g. STRIPE_SECRET_KEY=""

2. Generate a 'whsec' key using the below command, and add it to backend.env:

    stripe listen --forward-to localhost:8000/payments/webhook

3. Obtain the test publishable key and add it to the frontend/.env.local:

    e.g. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

3. Ensure that all routes and fetch calls are properly using .env.local keys

4. Restart the backend and frontend servers

5. Navigate to 'localhost:3000/donate' and fill out Stripe fields using test credit card info:

    credit card: 4242 4242 4242 4242
    Exp. Date: Any date in the future
    CSV: 123

# Deploy on ...
