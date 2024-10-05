from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from ninja.schema import Schema

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def refresh_access_token(refresh_token: str):
    try:
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        return {'access': str(access_token)}
    except TokenError as e:
        raise InvalidToken(e.args[0])