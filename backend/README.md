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

3. Run the development server from the BACKEND directory using:

    NEW  ->  1) python -m pip install uvicorn
    NEW  ->  2) python -m uvicorn main:app --reload

    OLD    uvicorn backend.main:app --reload 

    - After starting the server, navigate to http://127.0.0.1:8000/ on your local device to being viewing endpoint responses.
    -Navigate to http://127.0.0.1:8000/docs for interactive API docs.

# Deploy on ...

ADD INSTRUCTIONS FOR HOW WE ARE DEPLOYING HERE
