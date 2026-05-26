import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import (
    User, WaitlistCreate, WaitlistUpdate, WaitlistRead, WaitlistWithStats,
    EntryCreate, EntryRead,
    NotificationCreate, NotificationUpdate, NotificationRead,
    AnalyticsRead,
)
from backend.routers.auth import get_current_user
from backend.services import core

router = APIRouter(prefix="/api", tags=["api"])


# ── Waitlists ─────────────────────────────────────────────────────────────────

@router.post("/waitlists", response_model=WaitlistRead, status_code=status.HTTP_201_CREATED)
async def create_waitlist(
    data: WaitlistCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await core.create_waitlist(db, current_user.id, data)


@router.get("/waitlists", response_model=List[WaitlistWithStats])
async def list_waitlists(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await core.list_waitlists(db, current_user.id)


@router.get("/waitlists/{waitlist_id}", response_model=WaitlistRead)
async def get_waitlist(
    waitlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return wl


@router.patch("/waitlists/{waitlist_id}", response_model=WaitlistRead)
async def update_waitlist(
    waitlist_id: uuid.UUID,
    data: WaitlistUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return await core.update_waitlist(db, wl, data)


@router.delete("/waitlists/{waitlist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_waitlist(
    waitlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    await core.delete_waitlist(db, wl)


# ── Public signup (no auth required) ─────────────────────────────────────────

@router.post("/waitlists/{slug}/join", response_model=EntryRead, status_code=status.HTTP_201_CREATED)
async def join_waitlist(slug: str, data: EntryCreate, db: AsyncSession = Depends(get_db)):
    wl = await core.get_waitlist_by_slug(db, slug)
    if not wl or not wl.is_active:
        raise HTTPException(status_code=404, detail="Waitlist not found or inactive")
    return await core.join_waitlist(db, wl.id, data)


# ── Waitlist entries (owner only) ─────────────────────────────────────────────

@router.get("/waitlists/{waitlist_id}/entries", response_model=List[EntryRead])
async def list_entries(
    waitlist_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return await core.list_entries(db, waitlist_id, skip=skip, limit=limit)


@router.post("/waitlists/{waitlist_id}/entries/{entry_id}/approve", response_model=EntryRead)
async def approve_entry(
    waitlist_id: uuid.UUID,
    entry_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    entry = await core.approve_entry(db, entry_id, waitlist_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.delete("/waitlists/{waitlist_id}/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    waitlist_id: uuid.UUID,
    entry_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    deleted = await core.delete_entry(db, entry_id, waitlist_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entry not found")


# ── Notifications ─────────────────────────────────────────────────────────────

@router.post(
    "/waitlists/{waitlist_id}/notifications",
    response_model=NotificationRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_notification(
    waitlist_id: uuid.UUID,
    data: NotificationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return await core.create_notification(db, waitlist_id, data)


@router.get("/waitlists/{waitlist_id}/notifications", response_model=List[NotificationRead])
async def list_notifications(
    waitlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return await core.list_notifications(db, waitlist_id)


@router.patch("/waitlists/{waitlist_id}/notifications/{notif_id}", response_model=NotificationRead)
async def update_notification(
    waitlist_id: uuid.UUID,
    notif_id: uuid.UUID,
    data: NotificationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    notif = await core.update_notification(db, notif_id, waitlist_id, data)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif


@router.delete(
    "/waitlists/{waitlist_id}/notifications/{notif_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_notification(
    waitlist_id: uuid.UUID,
    notif_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    deleted = await core.delete_notification(db, notif_id, waitlist_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")


# ── Analytics ─────────────────────────────────────────────────────────────────

@router.get("/waitlists/{waitlist_id}/analytics", response_model=AnalyticsRead)
async def get_analytics(
    waitlist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wl = await core.get_waitlist(db, waitlist_id, current_user.id)
    if not wl:
        raise HTTPException(status_code=404, detail="Waitlist not found")
    return await core.get_analytics(db, waitlist_id)
