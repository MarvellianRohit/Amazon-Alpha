from fastapi import Depends, HTTPException, status
from typing import Annotated
from app.api.deps import get_current_user
# Assuming 'app.schemas.user' has User model, using Any for now to avoid circular deps in this snippet
from typing import Any

def get_current_vendor(
    current_user: Any = Depends(get_current_user)
) -> Any:
    """
    Dependency to ensure the current user has the 'vendor' role.
    Returns the user object if authorized.
    """
    # Check role from App Metadata or Profile
    # Adapt based on whether attributes are on the user object or metadata
    role = getattr(current_user, "user_role", None) or current_user.app_metadata.get("role")
    
    if role != "vendor" and role != "admin": # Admins can generally access vendor data too
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: setup a Vendor account to access this resource."
        )
    return current_user

VendorDep = Annotated[Any, Depends(get_current_vendor)]
