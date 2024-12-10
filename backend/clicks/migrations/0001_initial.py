# Generated by Django 5.0.4 on 2024-04-26 08:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Click',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.DecimalField(decimal_places=2, max_digits=102, verbose_name='Значение')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время')),
            ],
            options={
                'verbose_name': 'Клик',
                'verbose_name_plural': 'Клики',
            },
        ),
    ]
