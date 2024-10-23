from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException

from .src.routers.api import router as router_api
from .src.routers.handlers import http_error_handler


def get_application() -> FastAPI:
    application = FastAPI()

    application.include_router(router_api, prefix='/api')

    application.add_exception_handler(HTTPException, http_error_handler)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return application


app = get_application()