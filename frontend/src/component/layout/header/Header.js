import React, { useState } from "react";
import "./Header.css";
import logo from "../../../images/1.png";
import UserOptions from "./UserOptions.js";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import {
  MdProductionQuantityLimits,
  MdOutlineContactMail,
} from "react-icons/md";
import { FcAbout } from "react-icons/fc";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() ) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <>
      <nav>
        <img src={logo} alt="shopay logo " className="image "></img>

        <div>
          <div className="header_search ">
            <input
              className="header_searchInput"
              type="text"
              placeholder="Search here..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="search-btn" onClick={searchSubmitHandler}>
              <FaSearch />
            </button>
          </div>
          <ul id="navbar">
            <li>
              <Link to={"/"}>
               
                <AiOutlineHome  />
              </Link>
            </li>
            <li>
              <Link to="/products" >
              
                <MdProductionQuantityLimits  />
              </Link>
            </li>
            <li>
              <Link to="/contact" >
           
                <MdOutlineContactMail  />
              </Link>
            </li>
            <li>
              <Link to="/about" >
              
                <FcAbout  />
              </Link>
            </li>

            <li>
              <Link to="/cart">
                <FaShoppingCart />
              </Link>
            </li>
            <li>
              <Link to="/login">
                <FaUser />
              </Link>
            </li>
            <li>{isAuthenticated && <UserOptions user={user} />}</li>
          </ul>
          <div id="mobile">
            <i className="fas fa-bars"></i>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
