from django.contrib import admin
from django.urls import path
from authuser.views import apiauth, data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', apiauth.urls),
    path('data/', data.urls),
]