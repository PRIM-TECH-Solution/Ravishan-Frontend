import React, { useState } from "react";
import axios from "axios";

const EmailPopup = ({ orderDetails, eventDetails, ticketTypes, onClose }) => {
  const [email, setEmail] = useState(orderDetails.email);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);

    const requestBody = ticketTypes.map((type) => ({
      orderId: orderDetails.order_id,
      ticketType: type,
      nic: orderDetails.nic,
      eventName: eventDetails.eventName,
      eventDate: eventDetails.eventDate,
      eventTime: eventDetails.eventTime,
      email: isEditing ? newEmail : email,
      amount: orderDetails.amount,
    }));

    try {
      await axios.post("http://localhost:8082/tickets/create", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTimeout(async () => {
        try {
          await axios.post(`http://localhost:8082/api/generateQRAndSendEmail/${orderDetails.order_id}`);
          onClose();
        } catch (error) {
          console.error("Error generating QR and sending email:", error);
          setIsLoading(false);
        }
      }, 2000);

    } catch (error) {
      console.error("Error sending email:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Send Ticket Details via Email</h2>
        {isEditing ? (
          <div>
            <label className="block mb-2">New Email:</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={() => {
                setEmail(newEmail);
                setIsEditing(false);
              }}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Email: {email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white p-2 rounded mb-4"
            >
              Edit Email
            </button>
          </div>
        )}
        <button
          onClick={handleSendEmail}
          className="bg-green-500 text-white p-2 rounded mr-2"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Email"}
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmailPopup;
