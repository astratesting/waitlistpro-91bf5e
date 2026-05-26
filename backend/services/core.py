import uuid
import secrets
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select, func, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import (
    User, Waitlist, WaitlistEntry, Notification,
    WaitlistCreate, WaitlistUpdate, EntryCreate,
    NotificationCreate, NotificationUpdate,
    WaitlistWithStats, AnalyticsRead,
)


# ── Waitlist ─────────────────────────────────────────────────────────────────

async def create_waitlist(db: AsyncSession, owner_id: uuid.UUID, data: WaitlistCreate) -> Waitlist:
    wl = Waitlist(
        owner_id=owner_id,
        name=data.name,
        slug=data.slug,
        description=data.description,
        referral_enabled=data.referral_enabled,
        custom_fields=data.custom_fields or {},
        settings=data.settings or {},
    )
    db.add(wl)
    await db.commit()
    await db.refresh(wl)
    return wl


async def list_waitlists(db: AsyncSession, owner_id: uuid.UUID) -> List[WaitlistWithStats]:
    result = await db.execute(select(Waitlist).where(Waitlist.owner_id == owner_id))
    waitlists = result.scalars().all()
    out = []
    for wl in waitlists:
        stats = await _waitlist_stats(db, wl.id)
        out.append(WaitlistWithStats(**wl.__dict__, **stats))
    return out


async def get_waitlist(db: AsyncSession, waitlist_id: uuid.UUID, owner_id: uuid.UUID) -> Optional[Waitlist]:
    result = await db.execute(
        select(Waitlist).where(Waitlist.id == waitlist_id, Waitlist.owner_id == owner_id)
    )
    return result.scalar_one_or_none()


async def get_waitlist_by_slug(db: AsyncSession, slug: str) -> Optional[Waitlist]:
    result = await db.execute(select(Waitlist).where(Waitlist.slug == slug))
    return result.scalar_one_or_none()


async def update_waitlist(db: AsyncSession, wl: Waitlist, data: WaitlistUpdate) -> Waitlist:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(wl, field, value)
    wl.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(wl)
    return wl


async def delete_waitlist(db: AsyncSession, wl: Waitlist) -> None:
    await db.delete(wl)
    await db.commit()


# ── Waitlist entries ──────────────────────────────────────────────────────────

async def join_waitlist(db: AsyncSession, waitlist_id: uuid.UUID, data: EntryCreate) -> WaitlistEntry:
    count_result = await db.execute(
        select(func.count()).where(WaitlistEntry.waitlist_id == waitlist_id)
    )
    position = (count_result.scalar() or 0) + 1

    referrer = None
    if data.referral_code:
        ref_result = await db.execute(
            select(WaitlistEntry).where(WaitlistEntry.referral_code == data.referral_code)
        )
        referrer = ref_result.scalar_one_or_none()

    entry = WaitlistEntry(
        waitlist_id=waitlist_id,
        email=data.email,
        full_name=data.full_name,
        position=position,
        referral_code=secrets.token_urlsafe(8),
        referred_by=data.referral_code if referrer else None,
        metadata_=data.metadata or {},
    )
    db.add(entry)

    if referrer:
        referrer.referral_count += 1
        referrer.position = max(1, referrer.position - 2)

    await db.commit()
    await db.refresh(entry)
    return entry


async def list_entries(
    db: AsyncSession,
    waitlist_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
) -> List[WaitlistEntry]:
    result = await db.execute(
        select(WaitlistEntry)
        .where(WaitlistEntry.waitlist_id == waitlist_id)
        .order_by(WaitlistEntry.position)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def approve_entry(db: AsyncSession, entry_id: uuid.UUID, waitlist_id: uuid.UUID) -> Optional[WaitlistEntry]:
    result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.id == entry_id,
            WaitlistEntry.waitlist_id == waitlist_id,
        )
    )
    entry = result.scalar_one_or_none()
    if entry:
        entry.is_approved = True
        await db.commit()
        await db.refresh(entry)
    return entry


async def delete_entry(db: AsyncSession, entry_id: uuid.UUID, waitlist_id: uuid.UUID) -> bool:
    result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.id == entry_id,
            WaitlistEntry.waitlist_id == waitlist_id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        return False
    await db.delete(entry)
    await db.commit()
    return True


# ── Notifications ─────────────────────────────────────────────────────────────

async def create_notification(
    db: AsyncSession, waitlist_id: uuid.UUID, data: NotificationCreate
) -> Notification:
    notif = Notification(
        waitlist_id=waitlist_id,
        name=data.name,
        channel=data.channel,
        trigger=data.trigger,
        subject=data.subject,
        body=data.body,
        is_active=data.is_active,
        delay_hours=data.delay_hours,
    )
    db.add(notif)
    await db.commit()
    await db.refresh(notif)
    return notif


async def list_notifications(db: AsyncSession, waitlist_id: uuid.UUID) -> List[Notification]:
    result = await db.execute(
        select(Notification).where(Notification.waitlist_id == waitlist_id)
    )
    return result.scalars().all()


async def update_notification(
    db: AsyncSession, notif_id: uuid.UUID, waitlist_id: uuid.UUID, data: NotificationUpdate
) -> Optional[Notification]:
    result = await db.execute(
        select(Notification).where(
            Notification.id == notif_id,
            Notification.waitlist_id == waitlist_id,
        )
    )
    notif = result.scalar_one_or_none()
    if notif:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(notif, field, value)
        notif.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(notif)
    return notif


async def delete_notification(db: AsyncSession, notif_id: uuid.UUID, waitlist_id: uuid.UUID) -> bool:
    result = await db.execute(
        select(Notification).where(
            Notification.id == notif_id,
            Notification.waitlist_id == waitlist_id,
        )
    )
    notif = result.scalar_one_or_none()
    if not notif:
        return False
    await db.delete(notif)
    await db.commit()
    return True


# ── Analytics ─────────────────────────────────────────────────────────────────

async def get_analytics(db: AsyncSession, waitlist_id: uuid.UUID) -> AnalyticsRead:
    stats = await _waitlist_stats(db, waitlist_id)

    top_ref_result = await db.execute(
        select(WaitlistEntry.email, WaitlistEntry.referral_count)
        .where(WaitlistEntry.waitlist_id == waitlist_id, WaitlistEntry.referral_count > 0)
        .order_by(WaitlistEntry.referral_count.desc())
        .limit(10)
    )
    top_referrers = [{"email": r[0], "referral_count": r[1]} for r in top_ref_result.all()]

    daily_result = await db.execute(
        select(
            cast(WaitlistEntry.created_at, Date).label("day"),
            func.count().label("count"),
        )
        .where(WaitlistEntry.waitlist_id == waitlist_id)
        .group_by(cast(WaitlistEntry.created_at, Date))
        .order_by(cast(WaitlistEntry.created_at, Date))
    )
    signups_by_day = [{"date": str(r[0]), "count": r[1]} for r in daily_result.all()]

    total = stats["total_signups"]
    approved = stats["approved_count"]
    conversion_rate = round((approved / total * 100), 2) if total > 0 else 0.0

    return AnalyticsRead(
        waitlist_id=waitlist_id,
        total_signups=total,
        approved_count=approved,
        pending_count=total - approved,
        total_referrals=stats["referral_count"],
        top_referrers=top_referrers,
        signups_by_day=signups_by_day,
        conversion_rate=conversion_rate,
    )


async def _waitlist_stats(db: AsyncSession, waitlist_id: uuid.UUID) -> dict:
    total_result = await db.execute(
        select(func.count()).where(WaitlistEntry.waitlist_id == waitlist_id)
    )
    total = total_result.scalar() or 0

    approved_result = await db.execute(
        select(func.count()).where(
            WaitlistEntry.waitlist_id == waitlist_id,
            WaitlistEntry.is_approved == True,
        )
    )
    approved = approved_result.scalar() or 0

    referral_result = await db.execute(
        select(func.sum(WaitlistEntry.referral_count)).where(
            WaitlistEntry.waitlist_id == waitlist_id
        )
    )
    referrals = referral_result.scalar() or 0

    return {"total_signups": total, "approved_count": approved, "referral_count": referrals}
