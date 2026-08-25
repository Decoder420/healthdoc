"""Low-cardinality Prometheus metrics for the internal production scraper."""

import time

from prometheus_client import Counter, Histogram
from starlette.types import ASGIApp, Message, Receive, Scope, Send

HTTP_REQUESTS = Counter(
    "healthdoc_http_requests_total",
    "Completed HealthDoc HTTP requests.",
    ("method", "route", "status"),
)
HTTP_DURATION = Histogram(
    "healthdoc_http_request_duration_seconds",
    "HealthDoc HTTP request duration in seconds.",
    ("method", "route"),
    buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10),
)


class MetricsMiddleware:
    """Measure HTTP traffic without buffering responses or exposing raw URLs."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or scope.get("path") == "/metrics":
            await self.app(scope, receive, send)
            return

        started = time.perf_counter()
        status = 500

        async def observe_status(message: Message) -> None:
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
            await send(message)

        try:
            await self.app(scope, receive, observe_status)
        finally:
            route = getattr(scope.get("route"), "path", "<unmatched>")
            method = scope.get("method", "UNKNOWN")
            HTTP_REQUESTS.labels(method=method, route=route, status=str(status)).inc()
            HTTP_DURATION.labels(method=method, route=route).observe(time.perf_counter() - started)
