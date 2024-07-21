from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth import get_user_model

class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta(UserDetailsSerializer.Meta):
        model = get_user_model()
        fields = ('id', 'email', 'is_staff', 'is_active', 'date_joined')