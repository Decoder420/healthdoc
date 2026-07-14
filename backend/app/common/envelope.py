"""Response envelope middleware — B1-W1-06.

Every JSON API response is wrapped as:
  {"success": bool, "data": ..., "error": null | {"code", "message"}, "meta": {...}}
Handlers just return their payload; this middleware wraps it.
Docs/openapi/health endpoints pass through untouched.
"""
import json
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

SKIP_PATHS = ("/docs", "/openapi.json", "/redoc")


class EnvelopeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id

        if any(request.url.path.endswith(p) for p in SKIP_PATHS):
            return response
        if response.headers.get("content-type", "").split(";")[0] != "application/json":
            return response

        body = b""
        async for chunk in response.body_iterator:
            body += chunk
        try:
            payload = json.loads(body) if body else None
        except json.JSONDecodeError:
            return Response(body, status_code=response.status_code, headers=dict(response.headers))

        if isinstance(payload, dict) and {"success", "data", "error"} <= payload.keys():
            envelope = payload  # already wrapped (e.g. exception handler)
        elif response.status_code >= 400:
            detail = payload.get("detail") if isinstance(payload, dict) else payload
            envelope = {
                "success": False,
                "data": None,
                "error": {"code": response.status_code, "message": detail},
                "meta": {"request_id": request_id},
            }
        else:
            envelope = {
                "success": True,
                "data": payload,
                "error": None,
                "meta": {"request_id": request_id},
            }

        headers = dict(response.headers)
        headers.pop("content-length", None)
        return JSONResponse(envelope, status_code=response.status_code, headers=headers)
