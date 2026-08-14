import React from "react";
import "../../styles/navbar.css";
import { Link } from "react-router";
import logo from '../../assets/asti-india-logo.png';
function Navbar() {
  return (
    <>
      <nav className="asti-navbar navbar navbar-expand-lg bg-white border rounded">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img className="h-40px" src={logo} alt="" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <form className="d-flex">
              <div className="btn blue-text d-lg-flex d-none">
                <svg
                  width="30"
                  height="30"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className=" blue-text"
                >
                  <path
                    fill="currentColor"
                    d="M450.27,348.569,406.6,267.945V184c0-83.813-68.187-152-152-152s-152,68.187-152,152v83.945L58.928,348.568A24,24,0,0,0,80.031,384h86.935c-.238,2.636-.367,5.3-.367,8a88,88,0,0,0,176,0c0-2.7-.129-5.364-.367-8h86.935a24,24,0,0,0,21.1-35.431ZM310.6,392a56,56,0,1,1-111.419-8H310.018A56.14,56.14,0,0,1,310.6,392ZM93.462,352,134.6,276.055V184a120,120,0,0,1,240,0v92.055L415.736,352Z"
                  ></path>
                </svg>
              </div>
              <div className="profile rounded-circle gradient-bg text-white center-elements fw-bold"> A</div>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
