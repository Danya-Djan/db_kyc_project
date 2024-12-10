# Generated by Django 5.0.4 on 2024-05-04 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auction', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='auction',
            name='current_end_time',
        ),
        migrations.AddField(
            model_name='auction',
            name='times_postponed',
            field=models.IntegerField(default=0, verbose_name='Количество переносов'),
        ),
        migrations.AlterField(
            model_name='auction',
            name='initial_end_time',
            field=models.DateTimeField(verbose_name='Изначальная дата окончания'),
        ),
    ]
