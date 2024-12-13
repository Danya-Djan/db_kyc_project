import aio_pika
from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from functools import partial
from starlette.exceptions import HTTPException

from app.src.routers.api import router as router_api
from app.src.routers.handlers import http_error_handler
from app.src.domain.setting import launch_consumer
from app.src.db import connect_pg, connect_redis, get_connection, get_channel, get_rmq


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

@app.on_event("startup")
async def startup():
    launch_consumer(get_connection)

    app.state.pg_pool = await connect_pg()

    app.state.redis_pool = connect_redis()

    rmq_conn_pool = aio_pika.pool.Pool(get_connection, max_size=2)
    rmq_chan_pool = aio_pika.pool.Pool(partial(get_channel, conn_pool=rmq_conn_pool), max_size=10)
    app.state.rmq_chan_pool = rmq_chan_pool


@app.on_event("shutdown")
async def shutdown():
    await app.state.pg_pool.close()
    await app.state.redis.close()

