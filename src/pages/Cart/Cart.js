import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import LoginPopup from "./LoginPopup";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState(0);
  // const [shippingCharge, setShippingCharge] = useState(0);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const eventIds = products.map((item) => item.eventId);
        const responses = await Promise.all(
          eventIds.map((eventId) =>
            axios.get(`http://localhost:8080/eventcards/customTicketDetails/${eventId}`)
          )
        );

        const fetchedDetails = responses.flatMap((response) => response.data);
        setTicketDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [products]);

  const handleQuantityChange = (newSelectedTickets) => {
    const nonZeroTickets = newSelectedTickets.filter((ticket) => ticket.quantity > 0);
    setSelectedTickets(nonZeroTickets);

    let newTotalAmt = 0;
    nonZeroTickets.forEach((ticket) => {
      const ticketDetail = ticketDetails.find((detail) => detail.ticketType === ticket.ticketType);
      if (ticketDetail) {
        newTotalAmt += ticketDetail.ticketPrice * ticket.quantity;
      }
    });
    setTotalAmt(newTotalAmt);
  };

  // useEffect(() => {
  //   if (totalAmt <= 200) {
  //     setShippingCharge(30);
  //   } else if (totalAmt <= 400) {
  //     setShippingCharge(25);
  //   } else if (totalAmt > 401) {
  //     setShippingCharge(20);
  //   }
  // }, [totalAmt]);

  const handleCheckout = async () => {
    if (selectedTickets.length === 0) {
      setShowWarningPopup(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        const response = await axios.get(`http://localhost:8080/auth/getUsername/${userId}`);
        
        if (response.data && response.status === 200) {
          navigate("/checkout", { state: { selectedTickets, totalAmt, ticketDetails, eventId: products[0]?.eventId } });
          return;
        }

      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("User not found. Please log in again.");
        } else {
          console.error("Invalid token or other error", error);
        }
      }
    }
    
    setShowPopup(true);
  };

  // Cleanup effect to clear the cart when the component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetCart());
    };
  }, [dispatch]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Select Your Tickets" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} ticketDetails={ticketDetails} onQuantityChange={handleQuantityChange} />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => dispatch(resetCart())}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase hover:bg-red-700 duration-300"
            >
              Reset Order
            </button>

            <button
              onClick={handleCheckout}
              className="w-full max-w-sm py-3 text-white text-lg bg-primeColor hover:bg-black duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-full flex flex-col items-center justify-center gap-4 pb-20">
            <img
              className="w-1/3 object-cover"
              src={emptyCart}
              alt="emptyCartImg"
            />
            <p className="text-lg text-primeColor font-titleFont font-semibold">
              Your Event Ticket is empty!
            </p>
            <Link className="w-full md:w-96" to="/">
              <button className="w-full text-center py-3 text-white text-lg bg-primeColor hover:bg-black duration-300">
                Go Back
              </button>
            </Link>
          </div>
        </motion.div>
      )}
      <LoginPopup show={showPopup} onClose={() => setShowPopup(false)} />
      {showWarningPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <p className="text-2xl font-bold">Please select your ticket</p>
            <button
              onClick={() => setShowWarningPopup(false)}
              className="mt-4 px-8 py-2 font-bold bg-primeColor text-orange-400 rounded mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;