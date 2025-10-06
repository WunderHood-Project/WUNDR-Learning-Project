from passlib.context import CryptContext
from models.user_models import User
from fastapi import HTTPException, status
from datetime import datetime
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def enforce_admin(current_user: User, action: str = "perform this action"):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized. You must be an admin to {action}."
        )

def enforce_authentication(current_user: User, action: str = "perform this action"):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unauthorized. You must be authenticated to {action}."
        )

def convert_iso_date_to_string(date):
    """
        Callback to convert iso string into mm/dd/yyyy
    """

    dt = datetime.fromisoformat(str(date))

    formatted = dt.strftime("%m/%d/%Y")
    return formatted