from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine) -> None:
    """Create the booking feature tables for CON-TECH-01."""
    Base.metadata.create_all(bind=engine)