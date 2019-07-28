
from graphene import ObjectType, List, Schema, Mutation, Boolean, Field, String, Int, JSONString, InputObjectType
from graphene_sqlalchemy import SQLAlchemyObjectType

from claude import models
from .db import Database

def create_schema(db: Database):

    class Dashboard(SQLAlchemyObjectType):
        class Meta:
            model = models.Dashboard

    class Widget(SQLAlchemyObjectType):
        class Meta:
            model = models.Widget

    class Query(ObjectType):

        dashboards = List(Dashboard)
        dashboard = Field(Dashboard, id = Int())
        widgets = List(Widget)

        def resolve_dashboard(self, info, id: int):
            return db.scoped_session.query(models.Dashboard).filter(models.Dashboard.id == id).first()

        def resolve_dashboards(self, info):
            return db.scoped_session.query(models.Dashboard).all()

        def resolve_widgets(self, info):
            return db.scoped_session.query(models.Widget).all()

    class CreateDashboard(Mutation):
        class Arguments:
            name = String()

        ok = Boolean()
        dashboard = Field(lambda: Dashboard)

        def mutate(self, info, name):
            model = models.Dashboard(name = name)
            db.scoped_session.add(model)
            db.scoped_session.commit()
            return CreateDashboard(dashboard = model, ok = True)

    class CreateWidgetData(InputObjectType):
        x = Int()
        y = Int()
        width = Int()
        height = Int()
        type = String()
        settings = JSONString()
        dashboard_id = Int()

    class CreateWidget(Mutation):
        class Arguments:
            data = CreateWidgetData(required = True)

        ok = Boolean()
        widget = Field(lambda: Widget)

        def mutate(self, info, data: CreateWidgetData):
            model = models.Widget(**data)
            db.scoped_session.add(model)
            db.scoped_session.commit()
            return CreateWidget(ok = True, widget = model)

    class DeleteDashboard(Mutation):
        class Arguments:
            id = Int()

        ok = Boolean()

        def mutate(self, info, id: int):
            r = db.scoped_session.query(models.Dashboard).filter(models.Dashboard.id == id).delete()
            db.scoped_session.commit()
            return DeleteDashboard(ok = bool(r))

    class DeleteWidget(Mutation):
        class Arguments:
            id = Int()

        ok = Boolean()

        def mutate(self, info, id: int):
            r = db.scoped_session.query(models.Widget).filter(models.Widget.id == id).delete()
            db.scoped_session.commit()
            return DeleteWidget(ok = bool(r))


    class Mutations(ObjectType):
        create_dashboard = CreateDashboard.Field()
        delete_dashboard = DeleteDashboard.Field()
        create_widget = CreateWidget.Field()
        delete_widget = DeleteWidget.Field()

    return Schema(query = Query, mutation = Mutations)
