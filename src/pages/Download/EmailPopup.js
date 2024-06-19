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
      <div className="bg-white p-8 sm:p-16 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="font-semibold text-2xl mb-6 text-center">Send Ticket(s) via Email</h2>
        {isEditing ? (
          <div className="flex flex-col items-center text-xl">
            <label className="block mb-2 text-center">Add New Email:</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEmail(newEmail);
                  setIsEditing(false);
                }}
                className="bg-blue-500 text-white p-2 rounded"
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
          </div>
        ) : (
          <div className="text-center text-xl">
            <p className="mb-6">Email: {email}</p>
            <div className="flex justify-center space-x-2 mb-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Edit Email
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-green-500 text-white p-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default EmailPopup;