from contextlib import contextmanager

from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import create_engine


class Database():

    def __init__(self, url: str):
        self._url = url

        engine = create_engine(self._url)
        self.scoped_session = scoped_session(sessionmaker(autocommit = False, autoflush = False, bind = engine))

    @contextmanager
    def session_scope(self, autocommit = True):
        """Provide a transactional scope around a series of operations."""
        session = sessionmaker(bind=create_engine(self._url))()
        try:
            yield session
            if autocommit:
                session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
