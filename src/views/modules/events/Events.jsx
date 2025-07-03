import React, { useState, useEffect } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { eventService, eventTypeService } from '../../../services/api'
import { Modal, Button, Form } from 'react-bootstrap'

export default function EventsApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [eventTypes, setEventTypes] = useState([])
  const [form, setForm] = useState({
    name: '',
    date: '',
    end_date: '',
    location: '',
    event_type_id: '',
    description: '',
  })

  useEffect(() => {
    loadEvents()
    eventTypeService.getAll().then(res => {
      const data = res.data?.data?.eventTypes || res.data?.data || res.data || []
      setEventTypes(Array.isArray(data) ? data : [])
    })
  }, [])

  const loadEvents = () => {
    eventService.getAll()
      .then((response) => {
        // Log para depuración
        console.log('Respuesta eventos:', response)
        const data = response.data?.data?.events || response.data?.data || response.data || [];
        const eventsArray = Array.isArray(data) ? data : [];
        const calendarEvents = eventsArray.map(event => ({
          id: event.id,
          title: event.name || event.title,
          start: event.date || event.start_date || event.start || event.date,
          end: event.end_date || event.end,
          allDay: event.all_day || event.allDay || false,
          description: event.description,
          location: event.location,
          type: event.type || event.category || 'general',
        }))
        setEvents(calendarEvents)
      })
      .catch((error) => {
        setEvents([])
        console.error('Error fetching events:', error)
      })
  }

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo) {
    setForm({
      name: '',
      date: selectInfo.startStr,
      end_date: selectInfo.endStr || selectInfo.startStr,
      location: '',
      event_type_id: eventTypes[0]?.id || '',
      description: '',
    })
    setShowModal(true)
  }

  function handleCreateEvent(e) {
    e.preventDefault()
    // Obtener organizer_id del usuario actual (localStorage)
    let organizer_id = null
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      organizer_id = user?.id
    } catch (err) {}
    if (!organizer_id) {
      alert('No se pudo obtener el usuario actual. Inicia sesión de nuevo.')
      return
    }
    if (!form.name || !form.date || !form.location || !form.event_type_id) {
      alert('Completa todos los campos requeridos.')
      return
    }
    const newEvent = {
      name: form.name,
      date: form.date,
      end_date: form.end_date,
      location: form.location,
      event_type_id: Number(form.event_type_id),
      organizer_id,
      description: form.description,
      status: 'scheduled',
    }
    eventService.create(newEvent)
      .then(() => {
        setShowModal(false)
        loadEvents()
      })
      .catch((error) => {
        console.error('Error creando evento:', error)
        if (error.response) {
          alert('Error creando evento: ' + (error.response.data?.msg || 'Ver consola'))
        }
      })
  }

  function handleEventClick(clickInfo) {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
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

  // --- Lista de próximos eventos ---
  const upcomingEvents = [...events]
    .filter(e => e.start && new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5)

  return (
    <div>
      <div className="mb-4">
        <h3>Próximos eventos</h3>
        <ul>
          {upcomingEvents.length === 0 && <li>No hay eventos próximos</li>}
          {upcomingEvents.map(ev => (
            <li key={ev.id}>
              <b>{ev.title}</b> - {ev.start ? new Date(ev.start).toLocaleDateString() : ''}
            </li>
          ))}
        </ul>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Evento</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateEvent}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del evento</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de fin</Form.Label>
              <Form.Control
                type="date"
                value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de evento</Form.Label>
              <Form.Select
                value={form.event_type_id}
                onChange={e => setForm(f => ({ ...f, event_type_id: e.target.value }))}
                required
              >
                <option value="">Selecciona un tipo</option>
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
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
