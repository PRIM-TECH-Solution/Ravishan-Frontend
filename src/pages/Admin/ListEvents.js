import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [filters, setFilters] = useState({
    eventId: '',
    eventName: '',
    eventDate: '',
    eventLocation: '',
    organizerName: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/eventcards/getAll');
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    filterEvents({ ...filters, [name]: value });
  };

  const filterEvents = (filters) => {
    const filtered = events.filter(event =>
      event.eventId.toString().includes(filters.eventId) &&
      event.eventName.toLowerCase().includes(filters.eventName.toLowerCase()) &&
      event.eventDate.includes(filters.eventDate) &&
      event.eventLocation.toLowerCase().includes(filters.eventLocation.toLowerCase()) &&
      event.organizerName.toLowerCase().includes(filters.organizerName.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleViewClick = (event) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/eventcards/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditSubmit = async (updatedEvent) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/eventcards/${updatedEvent.eventId}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div>
      <h2>Event List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  label="Event ID"
                  name="eventId"
                  value={filters.eventId}
                  onChange={handleFilterChange}
                  variant="standard"
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Event Name"
                  name="eventName"
                  value={filters.eventName}
                  onChange={handleFilterChange}
                  variant="standard"
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Event Date"
                  name="eventDate"
                  value={filters.eventDate}
                  onChange={handleFilterChange}
                  variant="standard"
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Event Location"
                  name="eventLocation"
                  value={filters.eventLocation}
                  onChange={handleFilterChange}
                  variant="standard"
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Organizer Name"
                  name="organizerName"
                  value={filters.organizerName}
                  onChange={handleFilterChange}
                  variant="standard"
                />
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map(event => (
              <TableRow key={event.eventId}>
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{event.eventName}</TableCell>
                <TableCell>{event.eventDate}</TableCell>
                <TableCell>{event.eventLocation}</TableCell>
                <TableCell>{event.organizerName}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewClick(event)}>View</Button>
                  <Button onClick={() => handleEditClick(event)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(event.eventId)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedEvent && (
        <Dialog open={isViewOpen} onClose={() => setIsViewOpen(false)}>
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <img src={selectedEvent.flyerLink} alt="Event Flyer" />
              <p>ID: {selectedEvent.eventId}</p>
              <p>Name: {selectedEvent.eventName}</p>
              <p>Date: {selectedEvent.eventDate}</p>
              <p>Time: {selectedEvent.eventTime}</p>
              <p>Location: {selectedEvent.eventLocation}</p>
              <p>Description: {selectedEvent.eventDescription}</p>
              <p>Organizer: {selectedEvent.organizerName}</p>
              <p>Phone: {selectedEvent.organizerPhone}</p>
              <p>Email: {selectedEvent.organizerEmail}</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedEvent && (
        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Event ID"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.eventId}
              disabled
            />
            <TextField
              margin="dense"
              label="Event Name"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.eventName}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, eventName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Event Date"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.eventDate}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, eventDate: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Event Time"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.eventTime}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, eventTime: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Event Location"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.eventLocation}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, eventLocation: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Event Description"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.eventDescription}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, eventDescription: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Organizer Name"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.organizerName}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, organizerName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Organizer Phone"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.organizerPhone}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, organizerPhone: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Organizer Email"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.organizerEmail}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, organizerEmail: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Flyer Link"
              type="text"
              fullWidth
              variant="standard"
              value={selectedEvent.flyerLink}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, flyerLink: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={() => handleEditSubmit(selectedEvent)}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default EventList;
