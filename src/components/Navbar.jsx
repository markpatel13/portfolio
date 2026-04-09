// import React from 'react'

// const Navbar = () => {
//   return (
//     <div>Navbar</div>
//   )
// }

// export default Navbar
import { useState, useEffect } from "react";

import { navLinks } from "../constants";

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Resume button click
  const handleResumeClick = (e) => {
    e.preventDefault();
    // Open resume in new window
    window.open('/resume.pdf', '_blank');
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Mark Patel
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                {name === "Resume" ? (
                  <a href={link} onClick={handleResumeClick}>
                    <span>{name}</span>
                    <span className="underline" />
                  </a>
                ) : (
                  <a href={link}>
                    <span>{name}</span>
                    <span className="underline" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="contact-btn group">
          <div className="inner">
            <span>Contact me</span>
          </div>
        </a>
      </div>
    </header>
  );
}

export default NavBar;