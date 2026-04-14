from django.db import migrations


class Migration(migrations.Migration):
    """
    Manually creates indexes on the `req_submissions` materialized view.
    Django cannot manage these automatically (managed=False on DashboardJobData),
    so they are tracked here via RunSQL.

    Indexes cover the three columns used in every dashboard filter:
      - req_opened_date  (date range: gte / lte)
      - account_id       (__in filter)
      - end_client_id    (__in filter)
    """

    dependencies = [
        ('ta_team', '0030_requirements_ta_team_req_account_4d888d_idx_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE INDEX IF NOT EXISTS idx_req_submissions_opened_date
                    ON req_submissions (req_opened_date);

                CREATE INDEX IF NOT EXISTS idx_req_submissions_account_id
                    ON req_submissions (account_id);

                CREATE INDEX IF NOT EXISTS idx_req_submissions_end_client_id
                    ON req_submissions (end_client_id);
            """,
            reverse_sql="""
                DROP INDEX IF EXISTS idx_req_submissions_opened_date;
                DROP INDEX IF EXISTS idx_req_submissions_account_id;
                DROP INDEX IF EXISTS idx_req_submissions_end_client_id;
            """,
        ),
    ]
