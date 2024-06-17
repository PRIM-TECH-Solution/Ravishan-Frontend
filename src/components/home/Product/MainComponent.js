// src/components/home/Products/MainComponent.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import ProductInfo from "../../pageProps/productDetails/ProductInfo";
import ProductBanner from "../../Banner/Banner"; // Adjust path as needed
//import { addToCart } from "../../../redux/orebiSlice";

const MainComponent = () => {
  const [products, setProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Default items per page
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("http://localhost:8080/eventcards/getAll") // Replace with your backend endpoint
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  return (
    <div>
      <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
      <div className="products-container">
        {products.slice(0, itemsPerPage).map((product) => (
          <ProductInfo key={product._id} productInfo={product} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
};

export default MainComponent;
