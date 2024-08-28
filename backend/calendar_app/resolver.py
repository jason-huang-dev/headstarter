import fnmatch
from django.core.cache import cache

# List of wildcard patterns to match
WILDCARD_PATTERNS = [
    "timemesh-backend-*-jason-huang-devs-projects.vercel.app",
    # Add more patterns if needed
]

def dynamic_host_resolver(host, request, **kwargs):
    """
    Check if the given host matches any of the predefined wildcard patterns.
    """
    # Check in cache first
    if cache.get(host):
        return True

    # Check if host matches any pattern
    for pattern in WILDCARD_PATTERNS:
        if fnmatch.fnmatch(host, pattern):
            cache.set(host, True, timeout=3600)  # Cache result for 1 hour
            return True

    return False
