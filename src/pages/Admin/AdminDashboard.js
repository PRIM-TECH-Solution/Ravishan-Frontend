import React from "react";
import Header from "../../components/home/Header/Header";
import Footer from "../../components/home/Footer/Footer";
import { Link } from "react-router-dom";
import FooterBottom from "../../components/home/Footer/FooterBottom";

const AdminDashboard = () => {
  return (
    <div>
      {/* Render Header */}
      <Header />

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 p-2 ">Admin View</h2>
        <div className="grid grid-flow-col justify-stretch px-8 m-10 space-x-5 h-50">
          <Link to="/adminpanel">
            <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md flex items-center justify-center h-24">
              Admin Panel
            </div>
          </Link>
          <Link to="/eventcreation">
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center justify-center h-24">
              Create an event
            </div>
          </Link>
          <Link to="/eventlist">
            <div className="bg-black text-white p-6 rounded-lg shadow-md flex items-center justify-center h-24">
              Event List
            </div>
          </Link>
          <Link to="/services">
            <div className="bg-orange-500 text-white p-6 rounded-lg shadow-md flex items-center justify-center h-24">
              Services
            </div>
          </Link>
        </div>
      </div>
      <div className="h-10">
        <p>
        {/* EasyTicket.LK At EasyTicket.LK, we make booking event tickets easy and convenient. 
        Our platform offers a wide range of events, including concerts, theater performances, 
        sports games, and exhibitions. 
        With our QR code-enabled E-tickets, you can enjoy a hassle-free experience—purchase 
        tickets online, receive them instantly via email, and simply scan your QR code at the venue. 
        We are dedicated to providing exceptional customer service and ensuring your event 
        experience is smooth and enjoyable.  */}
        
        </p>
        
      </div>

      <Footer />
      <FooterBottom />
    </div>
  );
};

export default AdminDashboard;
