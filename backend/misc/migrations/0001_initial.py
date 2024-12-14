# Generated by Django 5.0.4 on 2024-04-26 08:14

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Button',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Текст на кнопке')),
                ('link', models.CharField(max_length=250, verbose_name='Ссылка на кнопке')),
            ],
            options={
                'verbose_name': 'Кнопка',
                'verbose_name_plural': 'Кнопки',
            },
        ),
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Желательно в формате: SAMPLE_NAME', max_length=250, verbose_name='Машиночитаемое название')),
                ('description', models.TextField(verbose_name='Описание')),
                ('value', models.JSONField(verbose_name='Значение')),
            ],
            options={
                'verbose_name': 'Настройка',
                'verbose_name_plural': 'Настройки',
            },
        ),
        migrations.CreateModel(
            name='Style',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='Название')),
                ('color_1', models.CharField(max_length=7, validators=[django.core.validators.RegexValidator(message='Пожалуйста введите название текста в формате #11AA11', regex='#[0-9A-F]{6}')], verbose_name='Основной цвет')),
                ('color_2', models.CharField(max_length=7, validators=[django.core.validators.RegexValidator(message='Пожалуйста введите название текста в формате #11AA11', regex='#[0-9A-F]{6}')], verbose_name='Цвет №2')),
                ('color_3', models.CharField(max_length=7, validators=[django.core.validators.RegexValidator(message='Пожалуйста введите название текста в формате #11AA11', regex='#[0-9A-F]{6}')], verbose_name='Цвет №3')),
                ('color_4', models.CharField(max_length=7, validators=[django.core.validators.RegexValidator(message='Пожалуйста введите название текста в формате #11AA11', regex='#[0-9A-F]{6}')], verbose_name='Цвет №4')),
                ('description', models.TextField(verbose_name='Описание')),
                ('is_available', models.BooleanField(verbose_name='Доступен ли')),
                ('background', models.FileField(upload_to='styles/', verbose_name='Фон')),
            ],
            options={
                'verbose_name': 'Стиль',
                'verbose_name_plural': 'Стили',
            },
        ),
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='Название')),
                ('media', models.FileField(upload_to='banners/', verbose_name='Обложка')),
                ('is_available', models.BooleanField(verbose_name='Доступен ли')),
                ('button', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='banners', to='misc.button', verbose_name='Кнопка')),
            ],
            options={
                'verbose_name': 'Баннер',
                'verbose_name_plural': 'Баннеры',
            },
        ),
        migrations.CreateModel(
            name='Popup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='Название')),
                ('text', models.TextField(verbose_name='Текст публикации')),
                ('media', models.FileField(upload_to='popup/', verbose_name='Обложка')),
                ('button', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='popups', to='misc.button', verbose_name='Кнопка')),
            ],
            options={
                'verbose_name': 'Попап',
                'verbose_name_plural': 'Попап',
            },
        ),
        migrations.CreateModel(
            name='PopupReceiverInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('viewed', models.BooleanField(default=False, verbose_name='Просмотрен ли')),
                ('popup', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='popup_receiver_infos', to='misc.popup', verbose_name='Рассылка')),
            ],
            options={
                'verbose_name': 'Информация о получателе попапа',
                'verbose_name_plural': 'Информация о получателях рассылки',
            },
        ),
    ]