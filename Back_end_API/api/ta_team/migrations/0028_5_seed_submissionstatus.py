from django.db import migrations


SUBMISSION_STATUSES = [
    (1,  "Submitted to AM",           1,  "submission_date"),
    (2,  "Profile Rejected by AM",    2,  None),
    (3,  "AM Interview",              3,  "am_screen_date"),
    (4,  "AM Screen Reject",          4,  None),
    (5,  "Technical Interview",       5,  "tech_screen_date"),
    (6,  "Technical Screen Reject",   6,  None),
    (7,  "Submitted to Client",       7,  "client_sub_date"),
    (8,  "Profile Rejected by Client",8,  None),
    (9,  "Client Interview",          9,  "client_interview_date"),
    (10, "Client Interview Reject",   10, None),
    (11, "Offered",                   11, "offer_date"),
    (12, "Offer Declined",            12, None),
    (13, "Started",                   13, "start_date"),
    (14, "Withdrawn",                 14, None),
]


def seed_statuses(apps, schema_editor):
    SubmissionStatus = apps.get_model("ta_team", "SubmissionStatus")
    for status_id, status_name, order, main_table_field in SUBMISSION_STATUSES:
        SubmissionStatus.objects.get_or_create(
            status_id=status_id,
            defaults={
                "status_name": status_name,
                "order": order,
                "is_active": True,
                "main_table_field": main_table_field,
            },
        )


def unseed_statuses(apps, schema_editor):
    SubmissionStatus = apps.get_model("ta_team", "SubmissionStatus")
    SubmissionStatus.objects.filter(
        status_id__in=[s[0] for s in SUBMISSION_STATUSES]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("ta_team", "0028_submissionstatus_submissionstatuslog"),
    ]

    operations = [
        migrations.RunPython(seed_statuses, reverse_code=unseed_statuses),
    ]
