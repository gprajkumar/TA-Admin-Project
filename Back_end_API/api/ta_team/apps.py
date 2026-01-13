from django.apps import AppConfig


class TaTeamConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ta_team'
    verbose_name = "Talent Acquisition Team"
    
    def ready(self):
        import ta_team.signals
