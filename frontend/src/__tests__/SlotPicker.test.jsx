import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SlotPicker from '../pages/SlotPicker.jsx'

test('แสดงช่วงเวลาพร้อมที่นั่งคงเหลือและโหลดใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  const calls = []
  const client = {
    getSlots: async (params) => {
      calls.push(params)
      return [
        {
          id: calls.length,
          slot_date: '2569-10-01',
          start_time: '09:00',
          remaining: calls.length === 1 ? 2 : 5,
        },
      ]
    },
  }

  render(<SlotPicker client={client} />)

  expect(await screen.findByText('ที่นั่งคงเหลือ: 2')).toBeTruthy()
  fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'EXECUTIVE' } })

  await waitFor(() => expect(calls).toHaveLength(2))
  expect(await screen.findByText('ที่นั่งคงเหลือ: 5')).toBeTruthy()
  expect(calls[1].packageCode).toBe('EXECUTIVE')
})