"""B2-W1-03 completes this: prove no plaintext Aadhaar path exists."""
import pytest

from app.common.security import aadhaar_blind_index


def test_blind_index_not_implemented_yet():
    with pytest.raises(NotImplementedError):
        aadhaar_blind_index("999999990019")
