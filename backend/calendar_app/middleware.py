import re
from django.http import HttpResponseForbidden

class HostPatternMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.allowed_patterns = [
            re.compile(r'^timemesh-backend-[a-z0-9]+-jason-huang-devs-projects\.vercel\.app$'),
        ]

    def __call__(self, request):
        host = request.get_host()
        if not any(pattern.match(host) for pattern in self.allowed_patterns):
            return HttpResponseForbidden("Invalid Host Header")
        return self.get_response(request)
