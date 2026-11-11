"""US-015: the README has a setup and a usage guide (AC-040, AC-041, NFR-016)."""

import re
from pathlib import Path

import pytest

README = (Path(__file__).resolve().parents[2] / "README.md").read_text(encoding="utf-8")


def _section(pattern: str) -> str:
    """Text from the first heading matching `pattern` up to the next heading of the same level."""
    m = re.search(rf"^(#+)[ \t]+[^\n]*(?:{pattern})[^\n]*$", README, re.I | re.M)
    assert m, f"README has no heading matching {pattern!r}"
    level = len(m.group(1))
    rest = README[m.end() :]
    nxt = re.search(rf"^#{{1,{level}}}[ \t]", rest, re.M)
    return rest[: nxt.start()] if nxt else rest


@pytest.mark.parametrize(
    "needle",
    [
        "DATABASE_URL",
        "postgresql+psycopg",
        "alembic|migrat",
        "uvicorn",
        "npm run dev",
        "/login|Login",
    ],
)
def test_ac040_setup_covers_database_start_and_login(needle: str) -> None:
    setup = _section("setup|getting started|running")
    assert re.search(needle, setup, re.I), needle


def test_ac040_setup_mentions_postgresql_and_install_steps() -> None:
    setup = _section("setup|getting started|running")
    assert re.search(r"postgres", setup, re.I)
    assert "pip install" in setup and "npm install" in setup


@pytest.mark.parametrize(
    "needle",
    [
        r"regist|sign up",
        r"sign in|log ?in",
        r"creat",
        r"edit",
        r"delet",
        r"sign out|log ?out",
    ],
)
def test_ac041_usage_explains_each_action(needle: str) -> None:
    assert re.search(needle, _section("usage|how to use"), re.I), needle


@pytest.mark.parametrize(
    "limit",
    [r"email verification", r"password reset", r"social login", r"sharing", r"tags", r"search"],
)
def test_ac041_usage_lists_v1_limits(limit: str) -> None:
    section = _section("limit|usage|how to use")
    assert re.search(limit, section, re.I), limit
    assert re.search(r"v1|version 1", README, re.I)


def test_nfr016_documentation_is_short() -> None:
    assert len(README.splitlines()) < 300


# NFR-009 (hundreds of users) is a sizing target and cannot be meaningfully tested here.
