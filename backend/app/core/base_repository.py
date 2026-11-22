from typing import Generic, TypeVar
from sqlmodel import SQLModel, Session, select

T = TypeVar('T', bound=SQLModel)
class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: type[T]):
        self.session = session
        self.model = model
    def get_by_id(self, id: int):
        return self.session.get(self.model, id)
    def get_all(self):
        return self.session.exec(select(self.model)).all()
    def add(self, item: T):
        self.session.add(item)
        self.session.flush()
        return item
    def delete(self, item: T):
        self.session.delete(item)
        self.session.flush()
