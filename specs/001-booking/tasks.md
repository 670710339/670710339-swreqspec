# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ
- Spec ID: SPEC-BKG-001
- อ้างอิง: [plan.md](plan.md)
- วันที่: 2569-09-23
- สรุป: มีทั้งหมด 22 tasks เรียงตามการพึ่งพาของข้อมูล, API, หน้าจอ และการทดสอบ
- สรุป: มี 6 tasks ที่ต้องรอ Open Question Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว

## รายการงาน

### T-01 สร้างตารางข้อมูลการจอง
- รองรับ: CON-TECH-01, IF-HIS-01, FR-BKG-02, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06 และ T-07
- ไฟล์ที่แตะ: `backend/app/db/models.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/test_db_schema.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และ `bookings` ไม่มีคอลัมน์ `national_id`
- สถานะ: พร้อมทำ

### T-02 ตั้งค่าการเชื่อมต่อฐานข้อมูลและชุดทดสอบ
- รองรับ: CON-TECH-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01 และทุก API test
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/db/session.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: แอปอ่าน `DATABASE_URL` ได้ และ test ใช้ฐานข้อมูล SQLite ในหน่วยความจำตาม plan.md โดยไม่เปลี่ยนการใช้ PostgreSQL ในระบบจริง
- สถานะ: พร้อมทำ

### T-03 ตรวจผลยืนยันตัวตนก่อนเข้า endpoint
- รองรับ: IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-06 และ T-11
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/main.py`, `backend/tests/test_idp_guard.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: endpoint ที่เข้าถึงข้อมูลผู้รับบริการปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตน และยอมให้คำขอที่ยืนยันแล้วผ่าน
- สถานะ: พร้อมทำ

### T-04 สร้าง API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05 และ T-13
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/app/main.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-01, T-02, T-03
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาภายใน 30 วันพร้อม `remaining` และเปลี่ยนผลลัพธ์ตาม `package_code` กับเขตเวลา Asia/Bangkok
- สถานะ: พร้อมทำ

### T-05 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: การทดสอบคำขอพร้อมกัน 200 ครั้งรายงานค่า p95 และตรวจว่าไม่เกิน 2 วินาทีในสภาพแวดล้อมทดสอบที่กำหนด
- สถานะ: พร้อมทำ

### T-06 บันทึกการจองและตัดที่นั่งแบบอะตอมิก
- รองรับ: FR-BKG-04, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12 และ T-17
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_booking_create.py`
- ต้องทำหลัง: T-01, T-02, T-03, T-04
- เสร็จเมื่อ: การยืนยันที่นั่งว่างสร้าง booking ที่เก็บ `hn` ลด `remaining` ลงหนึ่ง และไม่ทำให้จำนวนที่นั่งติดลบเมื่อมีคำขอชนกัน
- สถานะ: พร้อมทำ

### T-07 ปฏิเสธการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_02.py`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: ผู้รับบริการที่มี booking ยังไม่ได้ใช้ในวันเดียวกันได้รับการปฏิเสธพร้อมหมายเลขอ้างอิงของ booking เดิม โดยไม่สร้างรายการใหม่
- สถานะ: รอ Q-02

### T-08 เสนอช่วงเวลาใกล้เคียงเมื่อช่วงเต็ม
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-04, T-06
- เสร็จเมื่อ: `POST /bookings` ตอบ `409` พร้อมช่วงว่าง 3 ช่วงที่ใกล้ที่สุดในวันเดียวกันหรือวันถัดไป และไม่มี booking ใหม่เกิดขึ้น
- สถานะ: พร้อมทำ

### T-09 วางงานแจ้งเตือนแบบ asynchronous
- รองรับ: IF-NOT-01, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-10 และ T-12
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_notify_queue.py`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: การสร้าง booking วางงานแจ้งเตือนลงคิวจำลองและคืนผลโดยไม่รอผลการส่งข้อความ
- สถานะ: พร้อมทำ

### T-10 ส่งข้อความซ้ำและบันทึกรายการค้างส่ง
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01, ASM-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-19
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/tests/test_notify_retry.py`
- ต้องทำหลัง: T-09
- เสร็จเมื่อ: งานที่ส่งไม่สำเร็จถูกกำหนดส่งซ้ำภายใน 5 นาทีไม่เกิน 3 ครั้ง และถูกบันทึกเป็นรายการค้างส่งเมื่อยังไม่สำเร็จ
- สถานะ: พร้อมทำ

### T-11 ค้น HN จาก HIS โดยไม่เก็บเลขบัตรประชาชน
- รองรับ: IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06 และ T-20
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/booking/router.py`, `backend/tests/test_his_lookup.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: `GET /patients/lookup` ส่งเลขบัตรไป HIS เพื่อคืน `hn` และข้อมูลการจองที่สร้างไม่มีเลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-12 ออกหมายเลขคิวและคืนผลการจอง
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-01, AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_queue_number.py`
- ต้องทำหลัง: T-06, T-09, T-10
- เสร็จเมื่อ: หลัง Q-02 ได้คำตอบ ระบบออก `queue_no` ตามรูปแบบที่กำหนด และคืนหมายเลขเดียวกันสำหรับผลสำเร็จกับกรณีส่งข้อความไม่สำเร็จ
- สถานะ: รอ Q-02

### T-13 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14 และ T-22
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอเรียก API จำลอง แสดงช่วงเวลาพร้อมที่นั่งคงเหลือ และโหลดรายการใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: พร้อมทำ

### T-14 สร้างหน้ายืนยันและแสดงตัวเลือกทดแทน
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03 (ส่วนหน้าจอ)
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/AC-BKG-03.test.jsx`
- ต้องทำหลัง: T-13
- เสร็จเมื่อ: API จำลองตอบ `409` แล้วหน้าจอแสดงข้อความช่วงเวลาเต็มและตัวเลือกใกล้เคียง 3 รายการโดยไม่แสดงว่าสร้าง booking แล้ว
- สถานะ: พร้อมทำ

### T-15 สร้างหน้าจอผลการจอง
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-17 และ T-19
- ไฟล์ที่แตะ: `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/BookingResult.test.jsx`
- ต้องทำหลัง: T-14
- เสร็จเมื่อ: หน้าจอแสดงผลการจองและ `queue_no` จาก API จำลอง รวมถึงกรณีแจ้งเตือนไม่สำเร็จ
- สถานะ: รอ Q-02

### T-16 บันทึก audit log ทุกการเข้าถึงข้อมูล
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-03, T-06
- เสร็จเมื่อ: การเปิดดูข้อมูลการจองสร้าง audit log ที่มี `actor_id`, `accessed_at` และ `hn` และตรวจอายุการเก็บไม่น้อยกว่า 1 ปีได้
- สถานะ: พร้อมทำ

### T-17 ทดสอบการจองสำเร็จครบตาม AC
- รองรับ: FR-BKG-04
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_01.py`
- ต้องทำหลัง: T-06, T-12, T-15
- เสร็จเมื่อ: `test_AC_BKG_01` ผ่าน โดยตรวจว่าบันทึกสำเร็จ แสดงหมายเลขคิว และ `remaining` เป็น 0
- สถานะ: รอ Q-02

### T-18 ทดสอบการส่งข้อความล้มเหลวแล้วจองยังอยู่
- รองรับ: FR-BKG-05, NFR-REL-02
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_04.py`, `frontend/src/__tests__/AC-BKG-04.test.jsx`
- ต้องทำหลัง: T-10, T-12, T-15
- เสร็จเมื่อ: `test_AC_BKG_04` ผ่าน โดยตรวจ booking และหมายเลขคิวยังแสดง และงานส่งซ้ำมีกำหนดภายใน 5 นาที
- สถานะ: รอ Q-02

### T-19 ตรวจการส่งข้อมูลผ่าน TLS
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานตรวจคุณภาพตาม NFR-SEC-01
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/main.py`, `backend/tests/test_tls_config.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: การตั้งค่าการรับส่งข้อมูลของระบบระบุ TLS 1.2 ขึ้นไป และ test ตรวจไม่ยอมรับเวอร์ชันที่ต่ำกว่า
- สถานะ: พร้อมทำ

### T-20 ต่อ endpoint ค้น HN และ endpoint booking กับระบบจริง
- รองรับ: IF-HIS-01, IF-IDP-01, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานเชื่อมต่อของ T-11 และ T-12
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/booking/router.py`, `frontend/src/api/client.js`
- ต้องทำหลัง: T-03, T-11, T-12
- เสร็จเมื่อ: endpoint ใช้ `hn` ที่ได้จาก HIS และ frontend เรียก API จริงผ่าน `/api` โดยไม่ส่งเลขบัตรประชาชนไปเก็บใน booking
- สถานะ: พร้อมทำ

### T-21 ทดสอบความสำเร็จของผู้ใช้ใหม่ภายใน 3 นาที
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานทดสอบคุณภาพตาม NFR-USE-01
- ไฟล์ที่แตะ: `frontend/src/__tests__/NFR-USE-01.test.jsx`, `docs/srs/README.md`
- ต้องทำหลัง: T-13, T-14, T-15, T-20
- เสร็จเมื่อ: การทดสอบกับอาสาสมัครใหม่ 10 คนบันทึกเวลาการจองและยืนยันว่ามีอย่างน้อย 8 คนทำสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

### T-22 ต่อหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-03 (ส่วนหน้าจอ), AC-BKG-01 และ AC-BKG-04 (เมื่อ Q-02 ตอบแล้ว)
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/__tests__/integration-booking.test.jsx`
- ต้องทำหลัง: T-05, T-08, T-12, T-14, T-15, T-20
- เสร็จเมื่อ: หน้าจอเรียก backend จริงผ่าน `/api` และแสดงผลสำเร็จ, `409` พร้อม 3 ตัวเลือก, และผลส่งข้อความล้มเหลวตามสัญญา API
- สถานะ: รอ Q-02

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-17 |
| AC-BKG-02 | T-07 |
| AC-BKG-03 | T-08, T-14, T-22 |
| AC-BKG-04 | T-18 |
| AC-BKG-05 | T-05 |
| AC-BKG-06 | T-16 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01, T-02 |
| DOM-PDPA-01 | T-01, T-16 |
| IF-IDP-01 | T-03, T-20 |
| IF-HIS-01 | T-01, T-11, T-20 |
| IF-NOT-01 | T-09, T-10 |

## สิ่งที่ยังไม่ทำ

- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น `A001`) -> ถามเจ้าหน้าที่เวชระเบียน
  - tasks ที่รอ: T-07, T-12, T-15, T-17, T-18, T-22
  - ส่วนที่เกี่ยวข้อง: วิธีออกเลขคิว การแสดงเลขคิว และการทดสอบ AC ที่ตรวจหมายเลขคิว จะยังไม่เริ่มจนกว่าจะได้คำตอบ