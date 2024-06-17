import React, { useState, useEffect } from "react";
//import { ImCross } from "react-icons/im";
//import { useDispatch } from "react-redux";
//import { deleteItem } from "../../redux/orebiSlice";

const ItemCard = ({ item, ticketDetails, onQuantityChange }) => {
  //const dispatch = useDispatch();
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    const initialTickets = ticketDetails.map(detail => ({
      ticketType: detail.ticketType,
      quantity: item.ticketType === detail.ticketType ? item.quantity : 0,
    }));
    setSelectedTickets(initialTickets);
  }, [item.ticketType, item.quantity, ticketDetails]);

  const handleQuantityChange = (index, increment) => {
    const newSelectedTickets = [...selectedTickets];
    if (increment) {
      newSelectedTickets[index].quantity += 1;
    } else {
      if (newSelectedTickets[index].quantity > 0) {
        newSelectedTickets[index].quantity -= 1;
      }
    }
    setSelectedTickets(newSelectedTickets);
    onQuantityChange(newSelectedTickets);
  };

  const calculateSubtotal = (ticket) => {
    if (ticket && ticket.ticketType) {
      const ticketDetail = ticketDetails.find(detail => detail.ticketType === ticket.ticketType);
      return ticketDetail ? ticketDetail.ticketPrice * ticket.quantity : 0;
    }
    return 0;
  };

  const totalSubtotal = selectedTickets.reduce((acc, ticket) => acc + calculateSubtotal(ticket), 0);

  return (
    <div className="flex flex-col md:flex-row w-full border py-4 mb-4">
      <div className="flex flex-col items-center gap-4 p-4 md:border-r w-full md:w-1/4">
        
        <img className="w-full h-auto object-cover" src={item.image} alt="productImage" />
        
      </div>
      <div className="w-full md:w-3/4 px-6 py-2">
        <h2 className="font-titleFont font-semibold text-4xl mb-4 text-center ">{item.name}</h2>
        <div className="grid grid-cols-4 place-content-center py-2 border-b bg-sky-100">
          <div className="font-semibold text-2xl text-center text-blue-600">Ticket Type</div>
          <div className="font-semibold text-2xl text-center text-blue-600">Price</div>
          <div className="font-semibold text-2xl text-center text-blue-600">Quantity</div>
          <div className="font-semibold text-2xl text-center text-blue-600">Sub Total</div>
        </div>
        {ticketDetails.map((ticketDetail, index) => (
          <div key={index} className="grid grid-cols-4 place-content-center py-2 border-b">
            <div className="font-semibold text-gray-700 flex items-center justify-center text-xl">{ticketDetail.ticketType}</div>
            <div className="font-semibold text-gray-700 flex items-center justify-center text-xl">{ticketDetail.ticketPrice} LKR</div>
            <div className="flex items-center justify-center gap-2 text-xl">
              <span
                onClick={() => handleQuantityChange(index, false)}
                className="w-8 h-8 bg-gray-100 text-xl flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200"
              >
                -
              </span>
              <span>{selectedTickets[index] ? selectedTickets[index].quantity : 0}</span>
              <span
                onClick={() => handleQuantityChange(index, true)}
                className="w-8 h-8 bg-gray-100 text-xl flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200"
              >
                +
              </span>
            </div>
            <div className="font-semibold text-gray-700 flex items-center justify-center text-lg">{calculateSubtotal(selectedTickets[index])} LKR</div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-100">
          <p className="font-semibold text-2xl">Ticket Total:</p>
          <p className="font-semibold text-2xl">{totalSubtotal} LKR</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
