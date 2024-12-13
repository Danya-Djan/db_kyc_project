import aio_pika
import asyncpg
import redis
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated, Tuple
from ..domain.click import (
    ClickResponse, BatchClickRequest, EnergyResponse, ClickValueResponse,
    add_click_batch_copy, check_registration, check_energy, get_energy, click_value, delete_user_info
)

from ..dependencies import get_token_header
from ..db import get_pg, get_redis, get_rmq
from ..config import BACKEND_URL


router = APIRouter(
    prefix="",
    tags=['click'],
    dependencies=[],
    responses={404: {'description': 'Not found'}},
)


@router.post("/batch-click/", response_model=ClickResponse, status_code=200)
async def batch_click(req: BatchClickRequest, auth_info: Annotated[Tuple[int, str], Depends(get_token_header)], pg: Annotated[asyncpg.Connection, Depends(get_pg)], r: Annotated[redis.Redis, Depends(get_redis)], rmq: Annotated[aio_pika.Channel, Depends(get_rmq)]):
    user_id, token = auth_info
    if not await check_registration(r, user_id, token, BACKEND_URL):
        raise HTTPException(status_code=403, detail='Unauthorized')

    _energy, spent = await check_energy(r, user_id, req.count, token)
    if spent == 0:
        raise HTTPException(status_code=400, detail='No energy')

    click = await add_click_batch_copy(r, pg, rmq, user_id, spent)
    return ClickResponse(
        click=click,
        energy=_energy
    )


@router.get("/energy", response_model=EnergyResponse, status_code=200)
async def energy(auth_info: Annotated[Tuple[int, str], Depends(get_token_header)], r: Annotated[redis.Redis, Depends(get_redis)]):
    user_id, token = auth_info
    if not await check_registration(r, user_id, token, BACKEND_URL):
        raise HTTPException(status_code=403, detail='Unauthorized')

    _energy = await get_energy(r, user_id, token)
    return EnergyResponse(
        energy=_energy
    )


@router.get('/coefficient', response_model=ClickValueResponse, status_code=200)
async def coefficient(auth_info: Annotated[Tuple[int, str], Depends(get_token_header)], r: Annotated[redis.Redis, Depends(get_redis)], pg: Annotated[asyncpg.Connection, Depends(get_pg)]):
    user_id, token = auth_info
    if not await check_registration(r, user_id, token, BACKEND_URL):
        raise HTTPException(status_code=403, detail='Unauthorized')

    value = await click_value(r, pg, user_id)
    return ClickValueResponse(
        value=value
    )


@router.delete('/internal/user', status_code=204)
async def delete_user(auth_info: Annotated[Tuple[int, str], Depends(get_token_header)], r: Annotated[redis.Redis, Depends(get_redis)], pg: Annotated[asyncpg.Connection, Depends(get_pg)]):
    user_id, token = auth_info
    if not await check_registration(r, user_id, token, BACKEND_URL):
        raise HTTPException(status_code=403, detail='Unauthorized')

    await delete_user_info(r, pg, user_id)