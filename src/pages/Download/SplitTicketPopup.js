import React, { useState } from "react";
import axios from "axios";

const SplitTicketsPopup = ({ orderDetails, ticketTypes, onClose }) => {
  const [emailTickets, setEmailTickets] = useState(
    ticketTypes.map((ticket) => ({ ticketId: ticket.ticketId, ticketType: ticket.ticketType, email: "" }))
  );
  const [sendingStatus, setSendingStatus] = useState({});

  const handleChange = (ticketId, value) => {
    setEmailTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.ticketId === ticketId ? { ...ticket, email: value } : ticket))
    );
  };

  const handleSend = async (ticketId, email) => {
    setSendingStatus((prevStatus) => ({ ...prevStatus, [ticketId]: "sending" }));

    try {
      await axios.post("http://localhost:8082/api/splitTickets", {
        orderId: orderDetails.order_id,
        emailTickets: [{ ticketId, email }],
      });

      setSendingStatus((prevStatus) => ({ ...prevStatus, [ticketId]: "sent" }));
    } catch (error) {
      setSendingStatus((prevStatus) => ({ ...prevStatus, [ticketId]: "failed" }));
    }
  };

  const getTicketTypeById = async (ticketId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/tickets/${ticketId}`);
      const ticket = response.data;

      alert(`Ticket Type: ${ticket.ticketType}\nTicket ID: ${ticket.ticketId}\nEvent: ${ticket.eventName}\nDate: ${ticket.eventDate}\nTime: ${ticket.eventTime}`);
    } catch (error) {
      console.error("Error fetching ticket type:", error);
      alert("Failed to fetch ticket type. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Split Tickets</h2>
        <p className="mb-4">You have ordered {ticketTypes.length} tickets. Split them here:</p>
        {emailTickets.map((ticket) => (
          <div key={ticket.ticketId} className="mb-4">
            <p className="mb-2">
              {ticket.ticketType} - Ticket ID: {ticket.ticketId}
              <button
                onClick={() => getTicketTypeById(ticket.ticketId)}
                className="ml-4 text-blue-500 underline"
              >
                View Details
              </button>
            </p>
            <input
              type="email"
              placeholder="Enter email"
              value={ticket.email}
              onChange={(e) => handleChange(ticket.ticketId, e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => handleSend(ticket.ticketId, ticket.email)}
              disabled={!ticket.email || sendingStatus[ticket.ticketId] === "sending" || sendingStatus[ticket.ticketId] === "sent"}
              className={`w-full mt-2 py-2 px-4 rounded ${ticket.email ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"} text-white font-bold`}
            >
              {sendingStatus[ticket.ticketId] === "sending" ? "Sending..." : sendingStatus[ticket.ticketId] === "sent" ? "Sent" : "Send"}
            </button>
          </div>
        ))}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SplitTicketsPopup;