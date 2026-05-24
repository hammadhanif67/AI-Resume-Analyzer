from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.contact_message_model import ContactMessage
from app.schemas.contact_schema import ContactMessageCreate, ContactMessageResponse
from app.utils.response_handler import success_response

router = APIRouter(tags=["Contact Messages"])


@router.post("/contact/messages", status_code=status.HTTP_201_CREATED)
def create_contact_message(payload: ContactMessageCreate, db: Session = Depends(get_db)):
    message = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.lower(),
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        status="new",
    )
    if not message.name or not message.subject or not message.message:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name, email, subject, and message are required.")
    db.add(message)
    db.commit()
    db.refresh(message)
    return success_response("Contact message sent successfully", ContactMessageResponse.model_validate(message))
