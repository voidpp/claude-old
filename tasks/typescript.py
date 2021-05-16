from invoke import task

from tasks.assets import Collection, apollo_query_typedefs

generate = Collection('generate')


@task
def build(c, mode = "development"):
    from .assets import Frontend
    all(c)
    Frontend.transpile(c, False, mode)


@generate.task()
def schema(c):
    """generate schema.graphql from the graphene schema"""
    from buck.api.schema import schema
    from graphql.utils import schema_printer
    from buck.components.folders import Folders
    file_path = Folders.frontend / 'schema.graphql'
    file_path.write_text(schema_printer.print_schema(schema))
    print('schema.graphql has been written')


@generate.task()
def query_type_definitions(c):
    """generate typescript definitions files for the inline graphql queries"""
    apollo_query_typedefs(c)


@generate.task()
def api_ts(c):
    """generate typescript definition file from the whole graphql.schema"""
    from buck.components.folders import Folders
    with c.cd(str(Folders.frontend)):
        c.run('npx graphql-codegen')
    print("api.ts has been generated")


@generate.task()
def all(c):
    """generate all typescript stuff"""
    from .top import clean
    clean(c)
    schema(c)
    api_ts(c)
    query_type_definitions(c)
