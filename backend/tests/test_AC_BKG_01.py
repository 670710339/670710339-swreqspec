# AC-BKG-01 (FR-BKG-04)
# row 1: ปกติ / row 2: ขอบ / row 3: ทางผิด (รอ Q-xx)
from app.db.models import Booking
from tests.conftest import AUTH


def test_AC_BKG_01_success_booking(client, db, make_slot):
    """TC-BKG-01-1: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่ จองแล้วต้องสำเร็จ"""
    # Given
    slot = make_slot(start="09:00", remaining=1)

    # When
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then
    assert res.status_code == 201
    booking = db.query(Booking).filter_by(slot_id=slot.id).one()
    assert booking.hn == "0001234"
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_last_slot_booking(client, db, make_slot):
    """TC-BKG-01-2: ช่วง 09.00 น. เหลือ 1 ที่ จองครั้งแรกต้องสำเร็จและไม่ให้จองซ้ำได้อีก"""
    # Given
    slot = make_slot(start="09:00", remaining=1)

    # When
    first = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)
    second = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then
    assert first.status_code == 201
    assert second.status_code == 409
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_3_invalid_precondition(client, make_slot):
    """TC-BKG-01-3: precondition ผิด ไม่ได้กำหนดผลชัดเจนใน spec จึงรอคำตอบ Q-xx"""
    # Given: การยืนยันตัวตนไม่สำเร็จ หรือช่วงที่เหลือไม่ตรงเงื่อนไข
    slot = make_slot(start="09:00", remaining=1)

    # When
    client.post("/bookings", json={"slot_id": slot.id})

    # Then: spec ไม่ได้บอกว่าควรปฏิเสธแบบใดเมื่อ precondition ผิด จึงรอ Q-xx ก่อนตรวจ
    # ยังไม่ตรวจเพราะรอ Q-xx
