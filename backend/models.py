import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, List

from sqlalchemy import String, Boolean, Integer, ForeignKey, DateTime, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel, EmailStr

from backend.database import Base


# ── SQLAlchemy ORM models ────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    clerk_user_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    waitlists: Mapped[List["Waitlist"]] = relationship("Waitlist", back_populates="owner", cascade="all, delete-orphan")


class Waitlist(Base):
    __tablename__ = "waitlists"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    referral_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    custom_fields: Mapped[Optional[dict]] = mapped_column(JSON, default=dict)
    settings: Mapped[Optional[dict]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner: Mapped["User"] = relationship("User", back_populates="waitlists")
    entries: Mapped[List["WaitlistEntry"]] = relationship("WaitlistEntry", back_populates="waitlist", cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="waitlist", cascade="all, delete-orphan")


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    waitlist_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("waitlists.id", ondelete="CASCADE"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    referral_code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    referred_by: Mapped[Optional[str]] = mapped_column(String(32), ForeignKey("waitlist_entries.referral_code"), nullable=True)
    referral_count: Mapped[int] = mapped_column(Integer, default=0)
    metadata_: Mapped[Optional[dict]] = mapped_column("metadata", JSON, default=dict)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    waitlist: Mapped["Waitlist"] = relationship("Waitlist", back_populates="entries")


class NotificationChannel(str, Enum):
    email = "email"
    sms = "sms"
    webhook = "webhook"


class NotificationTrigger(str, Enum):
    on_signup = "on_signup"
    on_approve = "on_approve"
    on_referral = "on_referral"
    manual = "manual"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    waitlist_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("waitlists.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    channel: Mapped[str] = mapped_column(String(50), nullable=False, default=NotificationChannel.email)
    trigger: Mapped[str] = mapped_column(String(50), nullable=False, default=NotificationTrigger.on_signup)
    subject: Mapped[Optional[str]] = mapped_column(String(500))
    body: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    delay_hours: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    waitlist: Mapped["Waitlist"] = relationship("Waitlist", back_populates="notifications")


# ── Pydantic schemas ─────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserRead(BaseModel):
    id: uuid.UUID
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class WaitlistCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    referral_enabled: bool = True
    custom_fields: Optional[dict] = None
    settings: Optional[dict] = None


class WaitlistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    referral_enabled: Optional[bool] = None
    custom_fields: Optional[dict] = None
    settings: Optional[dict] = None


class WaitlistRead(BaseModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    slug: str
    description: Optional[str]
    is_active: bool
    referral_enabled: bool
    custom_fields: Optional[dict]
    settings: Optional[dict]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WaitlistWithStats(WaitlistRead):
    total_signups: int = 0
    approved_count: int = 0
    referral_count: int = 0


class EntryCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    referral_code: Optional[str] = None
    metadata: Optional[dict] = None


class EntryRead(BaseModel):
    id: uuid.UUID
    waitlist_id: uuid.UUID
    email: str
    full_name: Optional[str]
    position: int
    referral_code: str
    referral_count: int
    is_approved: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationCreate(BaseModel):
    name: str
    channel: NotificationChannel = NotificationChannel.email
    trigger: NotificationTrigger = NotificationTrigger.on_signup
    subject: Optional[str] = None
    body: str
    is_active: bool = True
    delay_hours: int = 0


class NotificationUpdate(BaseModel):
    name: Optional[str] = None
    channel: Optional[NotificationChannel] = None
    trigger: Optional[NotificationTrigger] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    is_active: Optional[bool] = None
    delay_hours: Optional[int] = None


class NotificationRead(BaseModel):
    id: uuid.UUID
    waitlist_id: uuid.UUID
    name: str
    channel: str
    trigger: str
    subject: Optional[str]
    body: str
    is_active: bool
    delay_hours: int
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalyticsRead(BaseModel):
    waitlist_id: uuid.UUID
    total_signups: int
    approved_count: int
    pending_count: int
    total_referrals: int
    top_referrers: List[dict]
    signups_by_day: List[dict]
    conversion_rate: float
