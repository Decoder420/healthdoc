"""The reverse proxy must preserve SSE disconnect semantics in every environment."""
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def _api_location(config: str) -> str:
    marker = "location /api/ {"
    start = config.index(marker)
    end = config.index("\n    }", start)
    return config[start:end]


def test_dev_and_production_disable_api_proxy_buffering():
    for relative in (
        "infra/nginx/conf.d/healthdoc.conf",
        "infra/nginx/prod-conf.d/healthdoc.conf",
    ):
        block = _api_location((ROOT / relative).read_text())
        assert "proxy_buffering off;" in block, (
            f"{relative} buffers SSE responses; closed browser tabs will leave "
            "upstream streams alive and block graceful backend shutdown"
        )
