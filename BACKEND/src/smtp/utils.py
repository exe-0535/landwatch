from django.core.mail import send_mail
from django.conf import settings

def send_notification_email(user_email):
    subject = f"Landsat Satellite Capturing Data for your location"
    message = f"The Landsat satellite is currently capturing data for your location. Stay tuned for the results!"
    
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently=False,
    )