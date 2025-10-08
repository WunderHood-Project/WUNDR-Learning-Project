from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from typing import Annotated
from models.user_models import User
from db.prisma_client import db
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from .utils import verify_password
import logging

logger = logging.getLogger(__name__)

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))


oauth2_scheme = HTTPBearer()

# For authentication of user by id
security = HTTPBearer()

# Router
router = APIRouter()


async def authenticate_user(db, username: str, password: str):
    user = await db.users.find_unique(
        where={"email": username}
    )

    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = await db.users.find_unique(
        where={"email": username}
    )
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user


async def get_current_user_by_email(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    """
    Extract and validate JWT token, return current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Extract token from credentials
        token = credentials.credentials
        logger.debug(f'Decoding token: {token[:20]}...')

        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.debug(f'Token Payload: {payload}')


        # Get user identifier from token
        user_identifier = payload.get("sub")
        if user_identifier is None:
            logger.error("No 'sub' field in token payload")
            raise credentials_exception
        
        
        # Clean whitespace and normalize
        user_identifier = user_identifier.strip()
        
        logger.debug(f'Looking up user with identifier: {user_identifier}')

    except InvalidTokenError as e:
        logger.error(f'Token validation failed: {str(e)}')
        raise credentials_exception
    
    except Exception as e:
        logger.error(f'Unexpected error decoding token: {str(e)}')
        raise credentials_exception
    
    try:
        # OPTION A: If JWT 'sub' contains user ID
        user = await db.users.find_unique(
            where={"email":user_identifier}
        )

        if user is None:
            logger.error(f"User not found with identifier: {user_identifier}")
            raise credentials_exception
    
        logger.debug(f"Successfully found user: {user.email}")
        return user
    
    except Exception as e:
        logger.debug(f'Database error looking up user: {str(e)}')
        raise credentials_exception
    
async def get_current_active_user_by_email(
        current_user: Annotated[User, Depends(get_current_user_by_email)]
):
    return current_user

@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    email = form_data.username
    password = form_data.password

    user = await authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user

