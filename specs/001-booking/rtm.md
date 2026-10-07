# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 19:45 | test: 6 ผ่าน 1 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | ไม่มี AC | T-02 | backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) แต่ตรวจความเร็วและการคืนข้อมูลไม่ครบตาม 30 วันใน spec | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 (พร้อมทำ) | backend/app/booking/service.py: create_booking | ไม่มี test ในโค้ด | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 (พร้อมทำ) | ไม่มีโค้ดที่ให้ 3 ตัวเลือกหรือแจ้งเต็มในหน้าจอ | ไม่มี test ในโค้ด | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking, next_queue_no | backend/tests/test_AC_BKG_01.py::test_AC_BKG_01_success_booking (ผ่าน); backend/tests/test_AC_BKG_01.py::test_TC_BKG_01_2_last_slot_booking (ไม่ผ่าน) | รอ Q-xx |
| FR-BKG-05 | AC-BKG-04 | T-07 (พร้อมทำ) | ไม่มีโค้ดคิวส่งซ้ำหรือ queue retry | ไม่มี test ในโค้ด | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-10 | backend/app/slots/service.py: list_available_slots, backend/app/slots/router.py: get_slots | ไม่มี test ในโค้ด | ยังไม่ถึง |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มีการบังคับ TLS ในโค้ด | ไม่มี test ในโค้ด | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 (พร้อมทำ) | ไม่มีคิวส่งซ้ำ/การ retry ภายใน 5 นาที | ไม่มี test ในโค้ด | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มีโค้ดหรือ test สำหรับเวลาใช้งาน 3 นาที | ไม่มี test ในโค้ด | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL; backend/app/db/session.py: engine | backend/tests/test_T01_schema.py (ผ่านด้วย SQLite ในหน่วยความจำ) | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 (พร้อมทำ) | backend/app/db/models.py: AuditLog เพียงแค่ model ไม่มี middleware หรือ API ที่บันทึก audit log จริง | ไม่มี test ในโค้ด | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC | T-03 | backend/app/auth/idp.py: get_verified_hn | ไม่มี test สำหรับกรณียังไม่ยืนยันตัวตน/ผิด token | ยังไม่ถึง |
| IF-HIS-01 | ไม่มี AC | T-09 (พร้อมทำ) | backend/app/db/models.py: Booking เก็บ hn เท่านั้น แต่ไม่มี client/lookup HIS; backend/tests/test_T01_schema.py ตรวจว่าไม่มี national_id เท่านั้น | ไม่มี test ในโค้ด | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 (พร้อมทำ) | ไม่มีระบบ async queue หรือ retry | ไม่มี test ในโค้ด | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/slots/service.py: list_available_slots | FR-BKG-01, FR-BKG-06 | ไม่ครบ | กำหนด DAYS_AHEAD = 14 แต่ spec บอกภายใน 30 วัน; จึงไม่ได้ตรงกับคำสั่ง 30 วัน |
| backend/app/slots/router.py: GET /slots | FR-BKG-01 | ไม่ครบ | คืนเฉพาะช่วงที่ remaining > 0 และไม่แสดงช่วงว่างครบ 30 วัน ตาม spec |
| backend/app/booking/service.py: create_booking | FR-BKG-04 | ส่วนหนึ่งตรง | ตัดที่นั่งและบันทึกการจองทำได้ แต่ไม่มีตรวจกรณี remaining == 0 ชัดเจน และไม่มีคิวส่งข้อความ |
| backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | ไม่ตรง | ใช้รูปแบบ A001 อย่างไม่ยั่งยืน เพราะ Q-02 ยังไม่ได้คำตอบจากเจ้าหน้าที่เวชระเบียน |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | เป็นไปตามแค่ส่วนพื้นฐาน | ตรวจ header only เท่านั้น ไม่ใช่ระบบยืนยันตัวตนจริง |
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ไม่ตรง | default เป็น sqlite:///./dev.db แม้ code comments ระบุ PostgreSQL ในระบบจริง |
| backend/app/db/models.py: Booking, AuditLog | DOM-PDPA-01, IF-HIS-01 | ไม่ครบ | model มี AuditLog แต่ไม่มี middleware บันทึก log จริง; ไม่มี client HIS สำหรับ lookup จากเลขบัตร |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | backend/app/slots/service.py: DAYS_AHEAD = 14 | FR-BKG-01 | spec ระบุภายใน 30 วันข้างหน้า แต่โค้ดแสดงเฉพาะ 14 วัน ทำให้ข้อมูลไม่ครบตาม user story |  |
| F-002 | FR ไม่มี AC | backend/app/slots/router.py: get_slots | FR-BKG-06 | มีโค้ดกรองตาม package_code แต่ไม่มี AC สำหรับการเปลี่ยนแพ็กเกจ จึงไม่มี evidence ว่ารองรับได้จริงตาม spec |  |
| F-003 | เดา Q-xx | backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | โค้ดคาดรูปแบบ A001 โดยไม่รอคำตอบจากเจ้าหน้าที่เวชระเบียน จึงเป็นการเดาแทนทีม |  |
| F-004 | ละเมิด Constraint | backend/app/config.py: DATABASE_URL | CON-TECH-01 | default เป็น SQLite และไม่บังคับ PostgreSQL ใน code จริง แม้ comments ระบุว่าระบบจริงใช้ PostgreSQL |  |
| F-005 | AC ไม่มี test | backend/tests/test_AC_BKG_01.py | AC-BKG-01 | ตัวอย่าง test เดิมภายใน repo ตรวจแค่ status_code == 201 แต่ไม่ตรวจว่า slot.remaining กลายเป็น 0 หรือแสดงหมายเลขคิวตาม spec |  |
| F-006 | โค้ดไม่มี FR | backend/app/booking/service.py, backend/app/booking/router.py | FR-BKG-05, IF-NOT-01 | ไม่มีคิวส่งซ้ำหรือการ retry เมื่อส่งข้อความไม่สำเร็จ และไม่มีระบบ asynchronous queue ตาม ASM-03 |  |
| F-007 | test อ่อน | backend/tests/test_AC_BKG_01.py::test_AC_BKG_01_success_booking | AC-BKG-01 | ยังไม่มี assertion สำหรับหมายเลขคิวและการตัดที่นั่งจาก 1 เป็น 0 แม้ status 201 ผ่านแล้ว |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| ไม่มี | ไม่มีข้อค้นพบเดิมที่ถูกแก้แล้วในรอบนี้ | ไม่มีการแก้ code / spec / test ในขั้นตอนนี้ |
