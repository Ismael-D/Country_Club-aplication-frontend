import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form } from 'react-bootstrap';
import { eventService } from '../../../services/api.js';

const CALENDAR_COLORS = {
  Danger: 'danger',
  Success: 'success',
  Primary: 'primary',
  Warning: 'warning',
};

const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLevel, setEventLevel] = useState('');
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    eventService.getAll()
      .then((response) => {
        // El backend puede devolver response.data o response.data.data
        const data = response.data?.data?.events || response.data?.data || response.data || [];
        // Mapear eventos del backend al formato FullCalendar
        const mapped = data.map(event => ({
          id: event.id,
          title: event.title || event.name,
          start: event.start_date || event.start || event.date,
          end: event.end_date || event.end,
          allDay: event.all_day || event.allDay || false,
          extendedProps: {
            calendar: event.category || event.type || 'Primary',
            description: event.description,
            location: event.location,
          },
        }));
        setEvents(mapped);
      })
      .catch((error) => {
        setEvents([]);
        console.error('Error fetching events:', error);
      });
  };

  const handleDateSelect = (selectInfo) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split('T')[0] || '');
    setEventEndDate(event.end?.toISOString().split('T')[0] || '');
    setEventLevel(event.extendedProps.calendar);
    setShowModal(true);
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      eventService.update(selectedEvent.id, {
        title: eventTitle,
        start_date: eventStartDate,
        end_date: eventEndDate,
        category: eventLevel,
      })
        .then(() => {
          loadEvents();
          setShowModal(false);
          resetModalFields();
        })
        .catch((error) => {
          alert('Error actualizando evento');
          console.error(error);
        });
    } else {
      // Add new event
      eventService.create({
        title: eventTitle,
        start_date: eventStartDate,
        end_date: eventEndDate,
        category: eventLevel,
      })
        .then(() => {
          loadEvents();
          setShowModal(false);
          resetModalFields();
        })
        .catch((error) => {
          alert('Error creando evento');
          console.error(error);
        });
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      eventService.delete(selectedEvent.id)
        .then(() => {
          loadEvents();
          setShowModal(false);
          resetModalFields();
        })
        .catch((error) => {
          alert('Error eliminando evento');
          console.error(error);
        });
    }
  };

  const resetModalFields = () => {
    setEventTitle('');
    setEventStartDate('');
    setEventEndDate('');
    setEventLevel('');
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo) => {
    const colorClass = `bg-${CALENDAR_COLORS[eventInfo.event.extendedProps.calendar] || 'primary'}`;
    return (
      <div className={`d-flex align-items-center ${colorClass} text-white rounded px-2 py-1`}>
        <span className="me-2">{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Calendario de Eventos</h2>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today addEventButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        customButtons={{
          addEventButton: {
            text: 'Agregar Evento +',
            click: () => {
              resetModalFields();
              setShowModal(true);
            },
          },
        }}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Editar Evento' : 'Agregar Evento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título del Evento</Form.Label>
              <Form.Control
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color/Categoría</Form.Label>
              <div className="d-flex gap-3">
                {Object.entries(CALENDAR_COLORS).map(([key, value]) => (
                  <Form.Check
                    key={key}
                    type="radio"
                    label={key}
                    name="eventLevel"
                    id={`eventLevel-${key}`}
                    checked={eventLevel === key}
                    onChange={() => setEventLevel(key)}
                    style={{ accentColor: value }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              Eliminar
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateEvent}>
            {selectedEvent ? 'Guardar Cambios' : 'Agregar Evento'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar; 