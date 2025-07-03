import React, { useState, useEffect } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { eventService } from '../../services/api'

export default function EventsApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    eventService.getAll()
      .then((data) => {
        const calendarEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start_date,
          end: event.end_date,
          allDay: event.all_day || false,
          description: event.description,
          location: event.location,
          type: event.type
        }))
        setEvents(calendarEvents)
      })
      .catch((error) => console.error('Error fetching events:', error))
  }

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      const newEvent = {
        title,
        start_date: selectInfo.startStr,
        end_date: selectInfo.endStr,
        all_day: selectInfo.allDay,
        description: '',
        location: '',
        type: 'general'
      }

      eventService.create(newEvent)
        .then(() => {
          loadEvents()
        })
        .catch((error) => console.error('Error creating event:', error))
    }
  }

  function handleEventClick(clickInfo) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      eventService.delete(clickInfo.event.id)
        .then(() => {
          loadEvents()
        })
        .catch((error) => console.error('Error deleting event:', error))
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events)
  }

  return (
    <div className="demo-app">
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={events}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
    </div>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className="demo-app-sidebar">
      <div className="demo-app-sidebar-section">
        <h2>Events Calendar</h2>
      </div>
      <div className="demo-app-sidebar-section">
        <label>
          <input type="checkbox" checked={weekendsVisible} onChange={handleWeekendsToggle}></input>
          toggle weekends
        </label>
      </div>
      <div className="demo-app-sidebar-section">
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </b>
      <i>{event.title}</i>
    </li>
  )
}
