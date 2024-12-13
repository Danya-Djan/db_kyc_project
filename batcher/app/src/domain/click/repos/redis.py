import decimal
from typing import Optional, List

import redis.asyncio as redis


async def get_period_sum(r: redis.Redis, user_id: int, period: int) -> decimal.Decimal:
    sum_bytes = await r.get(f'period_{period}_user_{user_id}')
    if sum_bytes is None:
        return decimal.Decimal(0)
    return decimal.Decimal(sum_bytes.decode())


async def incr_period_sum(r: redis.Redis, user_id: int, _period: int, value: decimal.Decimal) -> decimal.Decimal:
    return await r.incrbyfloat(f'period_{_period}_user_{user_id}', float(value))


async def get_max_period_sum(r: redis.Redis, _period: int) -> decimal.Decimal:
    max_sum_bytes = await r.get(f'max_period_{_period}')
    if max_sum_bytes is None:
        return decimal.Decimal(0)
    return decimal.Decimal(max_sum_bytes.decode())


async def compare_max_period_sum(r: redis.Redis, _period: int, _sum: decimal.Decimal) -> None:
    _script = r.register_script('''
        local currentValue = tonumber(redis.call('GET', KEYS[1]))
        local cmpValue = tonumber(ARGV[1])
        if not currentValue or cmpValue > currentValue then
            redis.call('SET', KEYS[1], ARGV[1])
            return cmpValue
        else
            return currentValue
        end
    ''')
    await _script(keys=[f'max_period_{_period}'], args=[str(_sum)])


async def get_energy(r: redis.Redis, user_id: int) -> int:
    energy_str = await r.get(f'energy_{user_id}')
    if energy_str is None:
        return 0
    return int(energy_str)


async def set_energy(r: redis.Redis, user_id: int, energy: int) -> int:
    await r.set(f'energy_{user_id}', energy)


async def decr_energy(r: redis.Redis, user_id: int, amount: int) -> (int, int):
    _script = r.register_script('''
        local energy = tonumber(redis.call('GET', KEYS[1]))
        local delta = tonumber(ARGV[1])
        if energy < delta then
            redis.call('SET', KEYS[1], 0)
            return {0, energy}
        else
            local newEnergy = tonumber(redis.call('DECRBY', KEYS[1], ARGV[1]))
            return {newEnergy, delta}
        end
    ''')
    new_energy, spent= map(int, await _script(keys=[f'energy_{user_id}'], args=[amount]))
    return new_energy, spent


async def get_global_average(r: redis.Redis) -> decimal.Decimal:
    avg_bytes = await r.get('global_average')
    if avg_bytes is None:
        return decimal.Decimal(0)
    return decimal.Decimal(avg_bytes.decode())


async def update_global_average(r: redis.Redis, value_to_add: decimal.Decimal) -> decimal.Decimal:
    _script = r.register_script('''
        local delta = tonumber(ARGV[1]) / tonumber(redis.call('GET', KEYS[1]))
        return redis.call('INCRBYFLOAT', KEYS[2], delta)
    ''')
    return decimal.Decimal((await _script(keys=["user_count", "global_average"], args=[float(value_to_add)])).decode())


async def get_user_total(r: redis.Redis, user_id: int) -> decimal.Decimal:
    total_bytes = await r.get(f'total_{user_id}')
    if total_bytes is None:
        return decimal.Decimal(0)
    return decimal.Decimal(total_bytes.decode())


async def incr_user_count_if_no_clicks(r: redis.Redis, user_id: int) -> int:
    _script = r.register_script('''
        local clickCount = tonumber(redis.call('GET', KEYS[1]))
        local userCount = tonumber(redis.call('GET', KEYS[2]))
        if (not clickCount) then
            local oldUserCount = redis.call('GET', KEYS[2])
            if (not oldUserCount) then
                redis.call('SET', KEYS[2], 1)
                redis.call('SET', KEYS[3], 0)
                return 1
            end
            userCount = tonumber(redis.call('INCR', KEYS[2]))
            oldUserCount = tonumber(oldUserCount)
            local globalAverage = tonumber(redis.call('GET', KEYS[3]))
            redis.call('SET', KEYS[3], globalAverage / userCount * oldUserCount)
        end
        return userCount
    ''')
    return int(await _script(keys=[f'total_{user_id}', 'user_count', 'global_average'], args=[]))


async def incr_user_total(r: redis.Redis, user_id: int, value: decimal.Decimal) -> decimal.Decimal:
    return await r.incrbyfloat(f'total_{user_id}', float(value))


async def get_user_session(r: redis.Redis, user_id: int) -> Optional[str]:
    session_bytes = await r.get(f'session_{user_id}')
    if session_bytes is None:
        return None
    return session_bytes.decode()


async def set_user_session(r: redis.Redis, user_id: int, token: str) -> None:
    await r.set(f'session_{user_id}', token, ex=30 * 60)


async def get_user_count(r: redis.Redis) -> int:
    user_count_str = await r.get('user_count')
    if user_count_str is None:
        return 0
    return int(user_count_str)


async def incr_user_count(r: redis.Redis) -> int:
    _script = r.register_script('''
        local oldCount = redis.call('GET', KEYS[1])
        if (not oldCount) then
            redis.call('SET', KEYS[1], 1)
            redis.call('SET', KEYS[2], 0)
            return 1
        end
        local newCount = tonumber(redis.call('INCR', KEYS[1]))
        local globalAverage = tonumber(redis.call('GET', KEYS[2]))
        redis.call('SET', KEYS[2], globalAverage / newCount * oldCount)
        return newCount
    ''')
    return int(await _script(keys=['user_count', 'global_average'], args=[]))


async def delete_user_info(r: redis.Redis, user_id: int, periods: List[int]):
    _script = r.register_script('''
        local userTotal = redis.call('GET', KEYS[3])
        if (not userTotal) then
            return
        end
        local oldUserCount = tonumber(redis.call('GET', KEYS[1]))
        local newUserCount = tonumber(redis.call('DECR', KEYS[1]))
        local globalAverage = tonumber(redis.call('GET', KEYS[2]))
        redis.call('SET', KEYS[2], (globalAverage * oldUserCount - userTotal) / newUserCount)
        for i, v in ipairs(KEYS) do
            if (i > 2) then
                redis.call('DEL', v)
            end
        end
    ''')
    keys = [
        'user_count',
        'global_average',
        f'total_{user_id}'
        f'energy_{user_id}',
        f'session_{user_id}',
    ]
    for period in periods:
        keys.append(f'period_{period}_user_{user_id}')
    await _script(keys=keys, args=[])
