// app/about/page.js
'use client';

import Navbar from "../shared/navbar";
import ContactForm from "./components/contactForm";
import Footer from "../shared/footer";
import { useEffect } from "react";
import getIsLoggedIn from "../utils/getIsLoggedIn";
export default function About() {
  useEffect(() => {
    const fetchData = async () => {
      getIsLoggedIn().then((data) => {
        const error = data.error;
        error
          ? console.log(error)
          : console.log("Successfully fetched user login status");
        if (!data.loggedIn) {
          window.location.href = "/";
        }
      });
    };
    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="p-6 flex flex-col items-center bg-blue-50 min-h-screen">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4">About</h2>

          <p className="mb-6 text-gray-700 leading-relaxed">
            Welcome to my Ordinary Weather App! This app was created as part of
            a project for the course "Web Development" at the Cooporate State 
            University Stuttgart.
          </p>

          <p className="mb-8 text-gray-700 leading-relaxed">
            If you have any feedback, suggestions, or find any bugs (or easter
             eggs ;)), please let me know by using the contact form below - it's definetly not only 
            there to justify implementing the Google Recaptcha element.
          </p>
        </div>
        <ContactForm />
      </div>
      <Footer/>

    </div>
  );
}
