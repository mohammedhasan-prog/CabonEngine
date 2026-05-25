from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CurrentUserSerializer, LoginSerializer


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(CurrentUserSerializer(request.user).data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)
