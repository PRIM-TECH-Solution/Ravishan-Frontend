import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import paymentCard from "../../assets/images/payment.png";

const GuestBooking = ({ item, ticketDetails, onQuantityChange }) => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setPrevLocation(location.state?.data || "Home");
  }, [location]);

  useEffect(() => {
    if (ticketDetails) {
      const initialTickets = ticketDetails.map((detail) => ({
        ticketType: detail.ticketType,
        quantity: item && item.ticketType === detail.ticketType ? item.quantity : 0,
      }));
      setSelectedTickets(initialTickets);
    }
  }, [item, ticketDetails]);

  const calculateSubtotal = (ticket) => {
    if (ticket && ticket.ticketType) {
      const ticketDetail = ticketDetails.find(
        (detail) => detail.ticketType === ticket.ticketType
      );
      return ticketDetail ? ticketDetail.ticketPrice * ticket.quantity : 0;
    }
    return 0;
  };

  const totalSubtotal = selectedTickets.reduce(
    (acc, ticket) => acc + calculateSubtotal(ticket),
    0
  );

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Checkout" prevLocation={prevLocation} />
      <div className="flex flex-col md:flex-row w-full py-4">
        {/* Billing Details Section */}
        <div className="w-full md:w-1/2 p-4 border-r">
          <h2 className="font-bold text-2xl mb-4">Billing Details</h2>
          <form className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="First Name"
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Last Name"
            />
            <input
              className="w-full p-2 border rounded"
              type="email"
              placeholder="Email Address"
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Phone No"
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="NIC / Passport / Driving License"
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Country"
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="City"
            />
          </form>
        </div>

        {/* Booking Summary Section */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="font-bold text-2xl mb-4">Booking Summary</h2>
          <div className="flex justify-between py-2 border-b">
            <div className="text-lg">1x General Ticket(s)</div>
            <div className="text-lg">{totalSubtotal} LKR</div>
          </div>
          <div className="flex justify-between py-2 border-b">
            <div className="text-lg">Sub Total</div>
            <div className="text-lg">{totalSubtotal} LKR</div>
          </div>
          <div className="flex justify-between py-2 border-b">
            <div className="font-bold text-xl">Total</div>
            <div className="font-bold text-xl">{totalSubtotal} LKR</div>
          </div>
          <div className="flex justify-center my-4">
            <img src={paymentCard} alt="Payment Methods" className="h-8" />
          </div>
        </div>
      </div>

      {/* Terms and Conditions and Buttons Section */}
      <div className="flex flex-col items-center p-4">
        <div className="flex items-center my-4">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={agreedToTerms} 
            onChange={() => setAgreedToTerms(!agreedToTerms)} 
          />
          <p className="text-sm">
            I accept and agree to{" "}
            <button
              onClick={(e) => e.preventDefault()}
              className="text-blue-600 underline"
            >
              Terms and Conditions
            </button>
          </p>
        </div>
        {!agreedToTerms && (
          <p className="text-red-600 text-sm mt-4">
            In order to proceed, you should agree to T & C by clicking the above box
          </p>
        )}
        <div className="flex justify-center mt-6 space-x-4">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Back
          </button>
          <button 
            className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded ${!agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={!agreedToTerms}
          >
            Proceed to pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestBooking;
