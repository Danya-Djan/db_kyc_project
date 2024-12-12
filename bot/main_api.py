import os
import secrets
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from create_bot import bot
from config import on_startup, on_shutdown
from routes import bot_api_router
from back_send import send_message_router

def init_app():

    app = FastAPI(
        title='Clicker Bot',
        description='',
        version='1',
    )

    @app.on_event('startup')
    async def startup():
        await on_startup()

    @app.on_event('shutdown')
    async def shutdown():
        await on_shutdown()

    app.include_router(
        bot_api_router,
        prefix=''
    )
    
    app.include_router(
        send_message_router,
        prefix=''
    )

    origins = [
        'bot:7313',
        'localhost:7313',
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )

    return app


app = init_app()
