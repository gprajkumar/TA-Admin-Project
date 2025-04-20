from rest_framework import serializers
from .models import createAccount

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = createAccount
        fields = '__all__'