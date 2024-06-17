import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios"; // Import axios for making API requests

const Contact = () => {
  const [userType, setUserType] = useState(""); // State to manage user type selection
  const [contact, setContact] = useState({
    contactName: "",
    contactEmail: "",
    contactMessages: "",
    nic: "",
    mobile: "",
    eventDetails: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    if (location.state && location.state.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setContact({
      contactName: "",
      contactEmail: "",
      contactMessages: "",
      nic: "",
      mobile: "",
      eventDetails: "",
    });
    setErrors({});
    setSuccessMsg("");
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!contact.contactName) {
      newErrors.contactName = "Enter your Name";
    }
    if (!contact.contactEmail) {
      newErrors.contactEmail = "Enter your Email";
    } else if (!EmailValidation(contact.contactEmail)) {
      newErrors.contactEmail = "Enter a Valid Email";
    }

    if (userType === "customer") {
      if (!contact.contactMessages) {
        newErrors.contactMessages = "Enter your Messages";
      }
    } else if (userType === "eventOrganizer") {
      if (!contact.nic) {
        newErrors.nic = "Enter your NIC";
      }
      if (!contact.mobile) {
        newErrors.mobile = "Enter your Mobile";
      }
      if (!contact.eventDetails) {
        newErrors.eventDetails = "Enter Event Details";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8080/contact/add", contact);
        if (response.status === 200) {
          setSuccessMsg(
            `Thank you dear ${contact.contactName}, Your message has been received successfully. Further details will be sent to you by email at ${contact.contactEmail}.`
          );
          setContact({
            contactName: "",
            contactEmail: "",
            contactMessages: "",
            nic: "",
            mobile: "",
            eventDetails: "",
          });
        }
      } catch (error) {
        console.error("There was an error saving the contact data!", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const customerFields = [
    { name: "contactName", type: "text", placeholder: "Enter your name here", label: "Name" },
    { name: "contactEmail", type: "email", placeholder: "Enter your email here", label: "Email" },
    { name: "contactMessages", type: "textarea", placeholder: "Enter your message here", label: "Messages" },
  ];

  const eventOrganizerFields = [
    { name: "contactName", type: "text", placeholder: "Enter your name here", label: "Name" },
    { name: "contactEmail", type: "email", placeholder: "Enter your email here", label: "Email" },
    { name: "nic", type: "text", placeholder: "Enter your NIC here", label: "NIC" },
    { name: "mobile", type: "text", placeholder: "Enter your mobile number here", label: "Mobile" },
    { name: "eventDetails", type: "textarea", placeholder: "Enter event details here", label: "Event Details" },
  ];

  const formFields = userType === "customer" ? customerFields : eventOrganizerFields;

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Contact" prevLocation={prevLocation} />
      <div className="pb-20">
        <h1 className="font-titleFont font-semibold text-3xl">Fill up a Form</h1>
        <div className="py-6">
          <select
            value={userType}
            onChange={handleUserTypeChange}
            className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
          >
            <option value="" disabled>Select User Type</option>
            <option value="customer">Customer</option>
            <option value="eventOrganizer">Event Organizer</option>
          </select>
        </div>
        {userType && (
          <>
            {successMsg ? (
              <p className="pb-20 w-96 font-medium text-green-500">{successMsg}</p>
            ) : (
              <form onSubmit={handlePost}>
                <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
                  {formFields.map((field) => (
                    <div key={field.name}>
                      <p className="text-base font-titleFont font-semibold px-2">
                        {field.label}
                      </p>
                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          value={contact[field.name]}
                          onChange={handleChange}
                          cols="30"
                          rows="3"
                          className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
                          placeholder={field.placeholder}
                        ></textarea>
                      ) : (
                        <input
                          name={field.name}
                          value={contact[field.name]}
                          onChange={handleChange}
                          className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                          type={field.type}
                          placeholder={field.placeholder}
                        />
                      )}
                      {errors[field.name] && (
                        <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                          <span className="text-sm italic font-bold">!</span>
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    onClick={handlePost}
                    className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-44 text-base font-medium h-10 rounded-md duration-300"
                  >
                    Post
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contact;
