# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ต้องลบของเก่า

---

## 2569-09-23 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์: `specs/001-booking/spec.md`, `specs/001-booking/plan.md`
- ผลลัพธ์: สร้าง `specs/001-booking/tasks.md` จำนวน 22 tasks เรียงตามการพึ่งพา และตรวจครบ AC-BKG-01 ถึง AC-BKG-06 กับ Constraint ทุกตัว
- งานที่รอ Open Question: Q-02 เรื่องรูปแบบและวิธีออกหมายเลขคิว ทำให้ tasks ที่เกี่ยวกับการออกหรือแสดงหมายเลขคิวมีสถานะ `รอ Q-02`
- หมายเหตุ: ไม่เริ่มทำ task ใด ๆ ตามคำสั่ง

---

## 2569-09-23 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `backend/app/db/models.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/test_db_schema.py`
- ผล test: `cd backend && pytest tests/test_db_schema.py -q` ผ่าน `1 passed`
- ผลลัพธ์: สร้างตาราง `slots`, `bookings` และ `audit_logs`; ตาราง `bookings` เก็บ `hn` และไม่มี `national_id`; `queue_no` เป็น nullable ตาม Q-02
- สิ่งที่เกือบต้องเดา: ไม่พบข้อมูลที่ต้องเดา; ชื่อ migration `001_init.py` ขึ้นต้นด้วยตัวเลขจึงโหลดด้วย `importlib` ใน test โดยคงชื่อไฟล์ตาม plan.md

---

## 2569-09-23 คำสั่ง: /implement T-13 specs/001-booking/tasks.md

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ผล test: `cd frontend && npm test -- --run src/__tests__/SlotPicker.test.jsx` ผ่าน `1 passed`
- ผลลัพธ์: หน้าจอแสดงช่วงเวลาพร้อมที่นั่งคงเหลือ และเรียก API จำลองใหม่เมื่อเปลี่ยนแพ็กเกจหรือวันที่
- สิ่งที่เกือบต้องเดา: ไม่พบข้อมูลที่ต้องเดา; ใช้รูปแบบรายการช่วงเวลาตามสัญญา GET `/slots` ใน plan.md และรองรับทั้งรายการโดยตรงกับ `{ slots }` เพื่อให้ client ใช้งานได้ตามสัญญา