import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="About" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">EasyTicket.LK</span>{" "}
          At EasyTicket.LK, we make booking event tickets easy and convenient. Our platform offers a wide range of events, including concerts, theater performances, sports games, and exhibitions. With our QR code-enabled E-tickets, you can enjoy a hassle-free experience—purchase tickets online, receive them instantly via email, and simply scan your QR code at the venue.

We are dedicated to providing exceptional customer service and ensuring your event experience is smooth and enjoyable. Thank you for choosing EasyTicket.LK, where every event is just a click away.
        </h1>
        <Link to="/shop">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
