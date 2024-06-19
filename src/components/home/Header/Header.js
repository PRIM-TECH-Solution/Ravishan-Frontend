import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdClose, MdArrowDropDown } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logoLight } from "../../../assets/images";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginSuccess, logoutSuccess } from "../../../redux/authSlice";

const Header = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [category, setCategory] = useState(false);
  const [username, setUsername] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // New state variable
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);

    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.user_id; // Adjust this to match the actual token structure
          if (userId) {
            const response = await axios.get(`http://localhost:8080/auth/getUsername/${userId}`);
            setUsername(response.data); // Adjust according to the actual response structure
            dispatch(loginSuccess(response.data)); // Pass user data to the state
            
            // Check if the user came from the sign-in page
            if (location.state && location.state.fromSignIn) {
              toast.success("Login successful");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching username", error);
      } finally {
        setIsFirstLoad(false); // Set to false after first check
      }
    };

    if (isFirstLoad) {
      fetchUsername();
    }
  }, [dispatch, isFirstLoad, location.state]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setDropdown(false);
    dispatch(logoutSuccess());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="w-full h-20 bg-[#1E1E1E] sticky top-0 z-50 border-b-[1px] border-b-gray-200">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/">
            <div>
              <h1 className="font-titleFont text-3xl font-medium text-white">
                EasyTicket.LK
              </h1>
            </div>
          </Link>
          <div>
            {showMenu && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center w-auto z-50 p-0 gap-2"
              >
                <>
                  {navBarList.map(({ _id, title, link }) => (
                    title === "Login" ? (
                      <div key={_id} className="relative">
                        {username ? (
                          <div>
                            <button
                              className="text-white px-4 py-2 flex items-center"
                              onClick={() => setDropdown(!dropdown)}
                            >
                              <FaUser className="mr-2" />
                              {username}
                              <MdArrowDropDown className="ml-1" />
                            </button>
                            {dropdown && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                  Profile
                                </Link>
                                <button
                                  onClick={handleSignOut}
                                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                >
                                  Sign Out
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <NavLink
                            className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-white hover:underline underline-offset-[4px] decoration-[1px] hover:text-gray-300 md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                            to={link}
                            state={{ data: location.pathname.split("/")[1] }}
                          >
                            <li>{title}</li>
                          </NavLink>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        key={_id}
                        className="flex font-normal hover:font-bold w-20 h-6 justify-center items-center px-12 text-base text-white hover:underline underline-offset-[4px] decoration-[1px] hover:text-gray-300 md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                        to={link}
                        state={{ data: location.pathname.split("/")[1] }}
                      >
                        <li>{title}</li>
                      </NavLink>
                    )
                  ))}
                </>
              </motion.ul>
            )}
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4 text-white"
            />
            {sidenav && (
              <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-full relative"
                >
                  <div className="w-full h-full bg-primeColor p-6">
                    <img className="w-28 mb-6" src={logoLight} alt="logoLight" />
                    <ul className="text-gray-200 flex flex-col gap-2">
                      {navBarList.map((item) => (
                        <li
                          className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:underline underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                          key={item._id}
                        >
                          <NavLink
                            to={item.link}
                            state={{ data: location.pathname.split("/")[1] }}
                            onClick={() => setSidenav(false)}
                          >
                            {item.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <h1
                        onClick={() => setCategory(!category)}
                        className="flex justify-between text-base cursor-pointer items-center font-titleFont mb-2 text-white"
                      >
                        Shop by Category{" "}
                        <span className="text-lg">{category ? "-" : "+"}</span>
                      </h1>
                      {category && (
                        <motion.ul
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-sm flex flex-col gap-1"
                        >
                          <li className="headerSedenavLi text-white">Music</li>
                          <li className="headerSedenavLi text-white">Concerts</li>
                          <li className="headerSedenavLi text-white">Drama</li>
                          <li className="headerSedenavLi text-white">Exhibition</li>
                          <li className="headerSedenavLi text-white">Sports</li>
                        </motion.ul>
                      )}
                    </div>
                  </div>
                  <span
                    onClick={() => setSidenav(false)}
                    className="w-8 h-8 border-[1px] border-gray-300 absolute top-2 -right-10 text-gray-300 text-2xl flex justify-center items-center cursor-pointer hover:border-red-500 hover:text-red-500 duration-300"
                  >
                    <MdClose />
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;