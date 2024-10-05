from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('authuser', '0002_location'),
    ]
    operations = [
        migrations.AddField(
            model_name='location',
            name='user',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='locations',
                to='authuser.User',
            ),
        ),
    ]