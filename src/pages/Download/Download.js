import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import EmailPopup from "./EmailPopup"; // Import the EmailPopup component

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null); // State to store orderId
  const [showMessage, setShowMessage] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); // State to store order details
  const [eventDetails, setEventDetails] = useState(null); // State to store event details
  const [ticketTypes, setTicketTypes] = useState([]); // State to store ticket types
  const [showEmailPopup, setShowEmailPopup] = useState(false); // State to handle popup visibility

  useEffect(() => {
    // Function to fetch orderId from URL query params
    const fetchOrderId = () => {
      const params = new URLSearchParams(window.location.search);
      const orderIdParam = params.get("order_id");
      if (orderIdParam) {
        setOrderId(orderIdParam);
      } else {
        console.error("No orderId found in URL");
      }
    };

    fetchOrderId(); // Call the function to fetch orderId
  }, []);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/order-summary/success/${orderId}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setOrderDetails(response.data); // Set the fetched order details
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    if (orderDetails && orderDetails.event_id) {
      const fetchEventDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/eventcards/${orderDetails.event_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });

          setEventDetails(response.data); // Set the fetched event details
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      };

      const fetchTicketTypes = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/order-summary/ticket-types/${orderDetails.order_id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setTicketTypes(response.data); // Set the fetched ticket types
        } catch (error) {
          console.error("Error fetching ticket types:", error);
        }
      };

      fetchEventDetails();
      fetchTicketTypes();
    }
  }, [orderDetails]);

  const downloadETicket = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/downloadQR/${orderId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `e-ticket-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Show the success message after downloading the ticket
      setShowMessage(true);
    } catch (error) {
      console.error("Error downloading e-ticket:", error);
    }
  };

  const handleBookAnotherEvent = () => {
    navigate("/");
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <div className="max-w-container mx-auto px-4 py-6">
      <Breadcrumbs title="Booking Successful" prevLocation="Home" />
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-6 bg-white rounded-lg shadow-lg w-full md:w-1/2 flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h2 className="text-3xl font-bold mb-4">Booking Successful!</h2>
          <p className="text-lg">Thank you for your purchase. Your booking has been confirmed.</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-4">
          <button
            onClick={downloadETicket}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Download Ticket
          </button>
          <button
            onClick={() => setShowEmailPopup(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Email
          </button>
          <button
            onClick={handleBookAnotherEvent}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Book Another Event
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showMessage && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg flex items-center space-x-4">
          <p>Your E-ticket has been sent to your email successfully.</p>
          <button
            onClick={handleCloseMessage}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
          >
            Close
          </button>
        </div>
      )}

      {/* Display order details */}
      {orderDetails && (
        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Order Details</h3>
          <p><span className="font-bold">Order ID:</span> {orderDetails.order_id}</p>
          <p><span className="font-bold">Amount:</span> LKR {orderDetails.amount}</p>
          <p><span className="font-bold">Status:</span> {orderDetails.status}</p>
          <p><span className="font-bold">Event ID:</span> {orderDetails.event_id}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      {/* Display event details */}
      {eventDetails && (
        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Event Details</h3>
          <p><span className="font-bold">Event Name:</span> {eventDetails.eventName}</p>
          <p><span className="font-bold">Location:</span> {eventDetails.eventLocation}</p>
          <p><span className="font-bold">Date:</span> {eventDetails.eventDate}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      {/* Email Popup */}
      {showEmailPopup && (
        <EmailPopup
          orderDetails={orderDetails}
          eventDetails={eventDetails}
          ticketTypes={ticketTypes}
          onClose={() => setShowEmailPopup(false)}
        />
      )}
    </div>
  );
};

export default BookingSuccess;
