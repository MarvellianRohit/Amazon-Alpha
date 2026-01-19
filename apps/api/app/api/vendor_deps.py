from fastapi import Depends, HTTPException, status
from app.api.deps import get_current_user
from supabase.gotrue.types import User

def require_vendor_role(user: User = Depends(get_current_user)) -> User:
    """
    Dependency that ensures the authenticated user has the 'ROLE_VENDOR' role.
    Role is expected to be in user.app_metadata['role'].
    """
    role = user.app_metadata.get("role")
    
    if role != "ROLE_VENDOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Vendor role required."
        )
    return user
