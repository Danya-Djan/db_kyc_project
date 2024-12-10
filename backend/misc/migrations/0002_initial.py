# Generated by Django 5.0.4 on 2024-04-26 08:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('misc', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='popupreceiverinfo',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='popup_receiver_infos', to='users.tguser', verbose_name='Пользователь'),
        ),
        migrations.AddField(
            model_name='popup',
            name='users',
            field=models.ManyToManyField(related_name='popups', through='misc.PopupReceiverInfo', to='users.tguser', verbose_name='Пользователи'),
        ),
    ]
