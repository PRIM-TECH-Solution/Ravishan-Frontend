import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../redux/orebiSlice";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const highlightStyle = {
    color: "#d0121a", 
    fontWeight: "bold", 
  };

  const renderDescription = () => {
    if (!productInfo.des) {
      return null;
    }

    const description = productInfo.des.split(/:(.*?)-/).map((part, index) => {
      return (
        <span key={index} style={index % 2 === 1 ? highlightStyle : {}}>
          {part}
        </span>
      );
    });

    return <>{description}</>;
  };

  const handleBookTicket = () => {
    dispatch(
      addToCart({
        _id: productInfo._id,
        name: productInfo.productName,
        quantity: 1,
        image: productInfo.img,
        description: productInfo.des,
        badge: productInfo.badge,
        colors: productInfo.color,
        time: productInfo.time,
        location: productInfo.location,
        eventId: productInfo.eventId,
        ticketType: productInfo.ticketType,
        ticketPrice: productInfo.ticketPrice,
        date: productInfo.eventDate,
      })
    );
    navigate("/cart");
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-2xl font-semibold">
        {productInfo.ticketdetails}
        <span className="text-lg ml-2 inline-flex items-center">
          <FaMapMarkerAlt className="mr-1" /> Location: {productInfo.location}
        </span>
      </p>
      <p className="text-2xl font-semibold">
        <span className="text-lg ml-2 inline-flex items-center">
          <FaClock className="mr-1" /> Time: {productInfo.time}
        </span>
      </p>
      {productInfo.date && (
        <p className="text-2xl font-semibold">
          <span className="text-lg ml-2 inline-flex items-center">
            <FaCalendarAlt className="mr-1" /> Date: {productInfo.date}
          </span>
        </p>
      )}
      <hr />
      <p className="text-base text-gray-600">{renderDescription()}</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Category:</span> {productInfo.color}
      </p>
      
      <button
        onClick={handleBookTicket}
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 duration-300 text-white text-lg font-titleFont"
      >
        Book Your Ticket
      </button>
      
    </div>
  );
};

export default ProductInfo;
