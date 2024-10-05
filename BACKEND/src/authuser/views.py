from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from ninja.main import NinjaAPI
from ninja.security import HttpBearer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from .schemas import UserRegisterSchema, UserLoginSchema, TokenSchema, TokenRefreshSchema
from .serializers import get_tokens_for_user, refresh_access_token

apiauth = NinjaAPI(version="1.0")
data = NinjaAPI(version="2.0")


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        jwt_auth = JWTAuthentication()
        try:
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            return user
        except:
            return None


auth = AuthBearer()

User = get_user_model()


@apiauth.post("/sign-up", response={200: TokenSchema, 400: dict})
def register(request, payload: UserRegisterSchema):
    if User.objects.filter(email=payload.email).exists():
        return 400, {"error": "User with this email already exists."}
    user = User.objects.create_user(
        email=payload.email,
        password=payload.password
    )
    tokens = get_tokens_for_user(user)
    return 200, tokens


@apiauth.post("/sign-in", response={200: TokenSchema, 401: dict})
def login(request, payload: UserLoginSchema):
    user = authenticate(request, email=payload.email, password=payload.password)
    if user is not None:
        tokens = get_tokens_for_user(user)
        return 200, tokens
    else:
        return 401, {"error": "Invalid credentials"}


@apiauth.post("/refresh", response={200: dict, 401: dict})
def refresh_token(request, payload: TokenRefreshSchema):
    try:
        new_access_token = refresh_access_token(payload.refresh)
        return 200, new_access_token
    except InvalidToken as e:
        return 401, {"error": str(e)}


@apiauth.get("/protected", auth=auth, response={200: dict, 401: dict})
def protected(request):
    if request.user:
        return 200, {"message": f"Hello {request.user.email}, you are authenticated."}
    return 401, {"error": "Unauthorized"}


@apiauth.post("/me", response={200: dict, 401: dict})
def get_me(request, payload: TokenSchema):
    jwt_auth = JWTAuthentication()
    try:
        validated_token = jwt_auth.get_validated_token(payload.access)
        user = jwt_auth.get_user(validated_token)
        return 200, {"email": user.email}
    except InvalidToken as e:
        return 401, {"error": "Invalid token"}
    except Exception as e:
        return 401, {"error": str(e)}


@data.post("/get-landsat-image")
def get_landsat_image(request, path: int, grid: int):
    # get path/grid data from user
    return "Hello world"
