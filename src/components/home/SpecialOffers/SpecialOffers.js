import React, { useEffect, useState } from "react";
import axios from "axios";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { useParams } from "react-router-dom";

const SpecialOffers = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/eventcards/category/${category}`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [category]);
  

  useEffect(() => {
    setFilteredEvents(events.filter(event => event.eventCategory.toLowerCase() === category.toLowerCase()));
  }, [events, category]);

  return (
    <div className="w-full pb-20">
      <Heading heading="Browse Your Events" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-3 gap-10">
        {filteredEvents.map(event => (
          <Product
            key={event.id}
            _id={event.id}
            img={event.flyerLink}
            productName={event.eventName}
            price={event.ticketDetails}
            color={event.eventCategory}
            location={event.eventLocation}
            //badge={true}
            des={event.eventDescription}
            ticketType={event.ticketType}
            ticketPrice={event.ticketPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;
