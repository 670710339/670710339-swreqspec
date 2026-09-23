import { useEffect, useState } from 'react'

const defaultDate = new Date().toISOString().slice(0, 10)

// รองรับ FR-BKG-01 และ FR-BKG-06 ด้วยหน้าจอเลือกแพ็กเกจและช่วงเวลา
export default function SlotPicker({ client }) {
  const [dateFrom, setDateFrom] = useState(defaultDate)
  const [packageCode, setPackageCode] = useState('GENERAL')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // รองรับ FR-BKG-01 และ FR-BKG-06 ด้วยการโหลดช่วงเวลาใหม่ตามตัวกรอง
  async function loadSlots(nextDateFrom = dateFrom, nextPackageCode = packageCode) {
    setLoading(true)
    setError('')
    try {
      const result = await client.getSlots({
        dateFrom: nextDateFrom,
        packageCode: nextPackageCode,
      })
      setSlots(Array.isArray(result) ? result : result.slots ?? [])
    } catch {
      setSlots([])
      setError('ไม่สามารถโหลดช่วงเวลาที่ว่างได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSlots()
  }, [dateFrom, packageCode])

  return (
    <section aria-labelledby="slot-picker-title" className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Booking</p>
        <h1 id="slot-picker-title" className="mt-1 text-3xl font-bold text-slate-900">
          จองคิวตรวจสุขภาพ
        </h1>
        <p className="mt-2 text-slate-600">เลือกแพ็กเกจและช่วงเวลาที่ต้องการตรวจ</p>
      </header>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          วันที่เริ่มค้นหา
          <input
            aria-label="วันที่เริ่มค้นหา"
            className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          แพ็กเกจ
          <select
            aria-label="แพ็กเกจ"
            className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            value={packageCode}
            onChange={(event) => setPackageCode(event.target.value)}
          >
            <option value="GENERAL">ตรวจสุขภาพทั่วไป</option>
            <option value="EXECUTIVE">ตรวจสุขภาพผู้บริหาร</option>
          </select>
        </label>
      </div>

      <div aria-live="polite">
        {loading && <p className="text-slate-600">กำลังโหลดช่วงเวลาที่ว่าง...</p>}
        {!loading && error && <p className="text-red-700">{error}</p>}
        {!loading && !error && slots.length === 0 && (
          <p className="text-slate-600">ไม่พบช่วงเวลาที่ว่าง</p>
        )}
        {!loading && !error && slots.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <li key={slot.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-900">
                  {slot.slot_date} เวลา {slot.start_time}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  ที่นั่งคงเหลือ: {slot.remaining}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}