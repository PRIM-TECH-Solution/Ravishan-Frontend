import React, { useState, useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import EventService from "../../services/EventService";
import axios from "axios";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    eventId: "",
    organizerName: "",
    organizerPhone: "",
    organizerNic: "",
    organizerEmail: "",
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
    eventCategory: "",
    flyerLink: ""
  });

  const [tickets, setTickets] = useState([{ ticketType: "", ticketPrice: "" }]);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Function to generate event ID
  const generateEventCardId = () => {
    const now = new Date();
    const eventCardId = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}`;
    return eventCardId;
  };

  useEffect(() => {
    const eventCardId = generateEventCardId();
    setEvent((prevEvent) => ({ ...prevEvent, eventId: eventCardId }));
  }, []);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const newTickets = [...tickets];
    newTickets[index][name] = value;
    setTickets(newTickets);
  };

  const addTicketField = () => {
    setTickets([...tickets, { ticketType: "", ticketPrice: "" }]);
  };

  const EmailValidation = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!event.eventName) newErrors.eventName = "Enter the event name";
    if (!event.eventCategory) newErrors.eventCategory = "Enter the event category";
    if (!event.eventDate) newErrors.eventDate = "Enter the event date";
    if (!event.eventTime) newErrors.eventTime = "Enter the event time";
    if (!event.eventLocation) newErrors.eventLocation = "Enter the event location";
    if (!event.organizerEmail) newErrors.organizerEmail = "Enter the organizer's email";
    else if (!EmailValidation(event.organizerEmail)) newErrors.organizerEmail = "Enter a valid email";
    if (!event.eventDescription) newErrors.eventDescription = "Enter the event description";
    if (!event.organizerName) newErrors.organizerName = "Enter the organizer's name";
    if (!event.organizerNic) newErrors.organizerNic = "Enter the organizer's NIC";
    if (!event.organizerPhone) newErrors.organizerPhone = "Enter the organizer's phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEvent = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await EventService.addEvent(event);
        console.log('Event saved:', response);
        setSuccessMsg('Event successfully created!');

        const ticketDetailsList = tickets.map((ticket) => ({
          eventId: event.eventId,
          ticketType: ticket.ticketType,
          ticketPrice: parseFloat(ticket.ticketPrice),
        }));

        try {
          const token = localStorage.getItem('token');
          const ticketResponse = await axios.post('http://localhost:8080/ticketDetails/add', ticketDetailsList, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Tickets added successfully:', ticketResponse.data);
          navigate('/eventlist');
        } catch (ticketError) {
          console.error('Error adding tickets:', ticketError);
          alert('An error occurred while saving the tickets. Please try again later.');
        }
      } catch (eventError) {
        console.error('Error saving event:', eventError);
        alert('An error occurred while saving the event. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <h1 className="font-titleFont text-3xl font-medium">EasyTicket.LK</h1>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Get started for free</h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Get Started Browsing Events with EasyTicket.LK</span>
              <br />
              Unlock a world of entertainment and stay updated with the latest events. Sign in and start your adventure!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Enjoy Seamless Event Booking with EasyTicket.LK</span>
              <br />
              Access exclusive events and enjoy a hassle-free booking experience. Sign in and never miss out!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Stay Connected with EasyTicket.LK</span>
              <br />
              Join our community and get the best deals on event tickets. Sign in and elevate your experience!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">©️ EasyTicket.LK</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terms</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacy</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Security</p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">{successMsg}</p>
            <Link to="/eventlist">
              <button className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300">
                Create the Event
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
                        <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                Create an Event
              </h1>
              <div className="flex flex-col gap-3">
                {["eventId", "organizerName", "organizerEmail", "organizerNic", "organizerPhone", "eventName", "eventCategory", "eventDate", "eventTime", "eventLocation", "eventDescription", "flyerLink"].map((field) => (
                  <div key={field} className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <input
                      name={field}
                      value={event[field]}
                      onChange={handleEventChange}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    />
                    {errors[field] && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <p className="font-titleFont decoration-[1px]  text-2xl mdl:text-3xl ">
                  Ticket Details
                </p>
                {tickets.map((ticket, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-.5">
                      <p className="font-titleFont text-base font-semibold text-gray-600">
                        Ticket Type
                      </p>
                      <input
                        name="ticketType"
                        value={ticket.ticketType}
                        onChange={(e) => handleTicketChange(index, e)}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        type="text"
                        placeholder="Ticket Type"
                      />
                    </div>
                    <div className="flex flex-col gap-.5">
                      <p className="font-titleFont text-base font-semibold text-gray-600">
                        Ticket Price
                      </p>
                      <input
                        name="ticketPrice"
                        value={ticket.ticketPrice}
                        onChange={(e) => handleTicketChange(index, e)}
                        className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                        type="text"
                        placeholder="Ticket Price"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTicketField}
                  className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300"
                >
                  Add Another Ticket
                </button>

                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={saveEvent}
                  className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300"
                >
                  Create an Event
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;

