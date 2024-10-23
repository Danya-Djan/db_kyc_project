from fastapi import APIRouter
from . import click

router = APIRouter()


def include_api_routes():
    router.include_router(click.router, prefix='/v1')


include_api_routes()