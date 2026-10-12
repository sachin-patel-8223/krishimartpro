import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL

load_dotenv()

database_url = URL.create(
    drivername="postgresql+psycopg",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", "5432")),
    database=os.getenv("DB_NAME"),
)

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass



engine = create_engine(
    database_url,
    pool_pre_ping=True,
)


def test_database_connection():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT current_database()")
        )
        return result.scalar_one()


if __name__ == "__main__":
    try:
        database_name = test_database_connection()
        print("Database connection successful!")
        print(f"Connected database: {database_name}")
    except Exception:
        print("Database connection failed.")
        raise
    finally:
        engine.dispose()