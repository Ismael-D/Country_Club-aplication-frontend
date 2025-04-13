import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


const Events = () => {
  const [events, setEvents] = useState([
    { title: 'Event 1', date: '2025-04-15' },
    { title: 'Event 2', date: '2025-04-20' },
  ])

  const handleDateClick = (info) => {
    alert(`Date clicked: ${info.dateStr}`)
  }

  const handleEventClick = (info) => {
    alert(`Event clicked: ${info.event.title}`)
  }

  return (
    <div>
      <h1>Events</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        selectable={true}
      />
    </div>
  )
}

export default Events