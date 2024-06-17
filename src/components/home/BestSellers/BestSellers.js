import React, { useState, useEffect } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios";

const BestSellers = () => {
  const [events, setEvents] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/eventcards/getAll");
      if (response.data != null) {
        const event = response.data.map((e) => ({
          eventName: e.eventName,
          eventDate: e.eventDate,
          eventTime: e.eventTime,
          eventLocation: e.eventLocation,
          eventDescription: e.eventDescription,
          ticketDetails: e.ticketDetails,
          eventCategory: e.eventCategory,
          flyerLink: e.flyerLink,
          eventId: e.eventId,
          ticketType: e.ticketType,
          ticketPrice: e.ticketPrice
        }));
        setEvents(event);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full pb-20">
      <Heading heading="See More Events" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {events.map((event, index) => (
          <div className="px-2" key={index}>
            <Product
              _id={index}
              img={event.flyerLink}
              productName={event.eventName}
              location={event.eventLocation}
              color={event.eventCategory}
              des={event.eventDescription}
              time={event.eventTime}
              ticketDetails={event.ticketDetails}
              ticketType={event.ticketType}
              ticketPrice={event.ticketPrice}
              eventId={event.eventId}
              //badge={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
