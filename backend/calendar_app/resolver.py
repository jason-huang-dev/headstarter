import re

def dynamic_host_resolver(host):
    """
    Resolver function for django-dynamic-host.
    Returns True if the host is allowed, False otherwise.
    """
    # Define your patterns here
    allowed_patterns = [
        r'^timemesh-backend-[a-z0-9]+-jason-huang-devs-projects\.vercel\.app$',
        r'^localhost$',
        r'^127\.0\.0\.1$',
        # Add more patterns as needed
    ]

    return any(re.match(pattern, host) for pattern in allowed_patterns)