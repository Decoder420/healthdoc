"""Redis connection (queue tokens, pub/sub for live displays).

B4-W1-02 extends this with the pub/sub helper for queue-display websockets.
"""
import redis.asyncio as aioredis

from app.common.config import get_settings

_pool: aioredis.Redis | None = None


def get_redis() -> aioredis.Redis:
    global _pool
    if _pool is None:
        _pool = aioredis.from_url(get_settings().redis_url, decode_responses=True)
    return _pool
