from importlib import import_module

from sqlalchemy import create_engine, inspect

from app.db.models import Base


def test_migration_creates_booking_tables_without_national_id():
    engine = create_engine("sqlite:///:memory:")
    migration = import_module("app.db.migrations.001_init")

    migration.upgrade(engine)

    table_names = set(inspect(engine).get_table_names())
    assert {"slots", "bookings", "audit_logs"} <= table_names

    booking_columns = {
        column["name"] for column in inspect(engine).get_columns("bookings")
    }
    assert {"id", "hn", "slot_id", "booking_date", "queue_no", "status", "created_at"} <= booking_columns
    assert "national_id" not in booking_columns

    Base.metadata.drop_all(bind=engine)