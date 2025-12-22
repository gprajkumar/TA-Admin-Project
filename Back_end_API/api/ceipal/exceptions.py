class CeipalError(Exception):
    """Base exception for Ceipal API errors."""
    pass
class CeipalAuthenticationError(CeipalError):
    """Exception for Ceipal authentication failures."""
    pass
