import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { useSelector } from "react-redux";
import axios from "axios";

const Pagination = ({ itemsPerPage }) => {
  const [response, setResponses] = useState([]);
  const [events, setEvents] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/eventcards/getAll");
      setResponses(response.data);
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

  const items = events;

  function Items({ currentItems, selectedBrands, selectedCategories }) {
    // Filter items based on selected brands and categories
    const filteredItems = currentItems.filter((item) => {
      const isBrandSelected =
        selectedBrands.length === 0 ||
        selectedBrands.some((brand) => brand.title === item.brand);

      const isCategorySelected =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => category.title === item.cat);

      return isBrandSelected && isCategorySelected;
    });

    return (
      <>
        {filteredItems.map((event, index) => (
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
      </>
    );
  }

  const selectedBrands = useSelector(
    (state) => state.orebiReducer.checkedBrands
  );
  const selectedCategories = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    const newStart = newOffset + 1; // Adjust the start index

    setItemOffset(newOffset);
    setItemStart(newStart);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 mdl:gap-4 lg:gap-10">
        <Items
          currentItems={currentItems}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
        />{" "}
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Events from {itemStart} to {Math.min(endOffset, items.length)} of{" "}
          {items.length}
        </p>
        <button onClick={() => console.log(selectedBrands)}> test</button>
      </div>
    </div>
  );
};

export default Pagination;
