"""HealthDoc backend.

MINIMUM PYTHON IS ENFORCED HERE, AND ONLY HERE.

Application code uses `datetime.UTC` (app/patients/service.py,
app/files/service.py, app/queue/service.py and others), which is 3.11+. Nothing
declared that. `pyproject.toml` carries no `[project]` table — it is ruff and
pytest configuration only — so there is no `requires-python` for pip to check,
and the failure mode on an older interpreter is:

    ImportError: cannot import name 'UTC' from 'datetime'

raised from whichever module happened to be imported first. That names neither
the real problem nor the fix, and it is what a developer on a distro Python
actually sees.

The check lives in `app/__init__.py` rather than `app/main.py` because the test
suite imports submodules directly (`from app.files import service`) without
ever touching main, and the package __init__ is the one thing every import path
crosses.

3.12, not 3.11. The code floor is 3.11, but 3.11 is not tested anywhere:
Dockerfile is python:3.12-slim, CI pins 3.12, and ruff's target-version is
py312. Declaring a floor nobody exercises would be a claim this project cannot
back, so this states what is actually verified.
"""

import sys

_MINIMUM = (3, 12)

if sys.version_info < _MINIMUM:  # pragma: no cover - depends on the interpreter
    raise RuntimeError(
        f"HealthDoc requires Python {_MINIMUM[0]}.{_MINIMUM[1]} or newer; this is "
        f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}. "
        "The Dockerfile, CI and ruff all target 3.12. Application code uses "
        "datetime.UTC (3.11+), so on an older interpreter you would otherwise see "
        "a confusing ImportError from an unrelated module."
    )
