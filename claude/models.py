import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, Enum, JSON, DateTime, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Dashboard(Base):
    __tablename__ = 'dashboards'

    id = Column(Integer, primary_key = True)
    name = Column(String)
    step_size = Column(Integer)

class Widget(Base):

    __tablename__ = 'widgets'

    id = Column(Integer, primary_key = True)
    dashboard_id = Column(Integer, ForeignKey('dashboards.id', ondelete = 'CASCADE'), nullable = False)
    x = Column(Integer)
    y = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    settings = Column(JSON)
    type = Column(String)

    dashboard = relationship("Dashboard", backref = "widgets")
