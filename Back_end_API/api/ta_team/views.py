from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .models import createAccount
from .serializers import AccountSerializer
# Create your views here.
class AccountView(generics.CreateAPIView):
    queryset = createAccount.objects.all()
    serializer_class = AccountSerializer