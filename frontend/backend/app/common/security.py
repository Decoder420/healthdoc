"""Crypto helpers.

B2-W1-03 implements here:
  - aadhaar_blind_index(aadhaar: str) -> str   # HMAC-SHA256 keyed hash, hex
  - encrypt_pii(value: str) -> bytes           # AES-GCM via app key or pgcrypto
  - decrypt_pii(blob: bytes) -> str
Rules: Aadhaar is NEVER stored or logged in plaintext and is never a DB key.
Tests must prove no plaintext path (see tests/test_security.py stub).
"""


def aadhaar_blind_index(aadhaar: str) -> str:  # pragma: no cover — B2-W1-03
    raise NotImplementedError("B2-W1-03")
