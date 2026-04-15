from django.db import migrations


class Migration(migrations.Migration):
    """
    Adds PostgreSQL trigram (pg_trgm) GIN indexes on Requirements.job_title
    and Requirements.job_code to speed up the icontains search used in the
    requirement-search autocomplete API.

    Without these indexes every keystroke in the job search box does a full
    table scan.  With GIN+trgm, Postgres can satisfy icontains/ilike queries
    using the index instead.
    """

    dependencies = [
        ('ta_team', '0031_req_submissions_matview_indexes'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE EXTENSION IF NOT EXISTS pg_trgm;

                CREATE INDEX IF NOT EXISTS idx_req_job_title_trgm
                    ON ta_team_requirements USING GIN (job_title gin_trgm_ops);

                CREATE INDEX IF NOT EXISTS idx_req_job_code_trgm
                    ON ta_team_requirements USING GIN (job_code gin_trgm_ops);
            """,
            reverse_sql="""
                DROP INDEX IF EXISTS idx_req_job_title_trgm;
                DROP INDEX IF EXISTS idx_req_job_code_trgm;
            """,
        ),
    ]
