// app/about/page.js
import Navbar from "../shared/navbar";
import ContactForm from "./components/contactForm";
import Footer from "../shared/footer";


export default function About() {
  return (
    <div>
      <Navbar />
      <div className="p-6 flex flex-col items-center bg-blue-50 min-h-screen">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>

          <p className="mb-6 text-gray-700 leading-relaxed">
            Welcome to our Weather App! This application provides accurate
            weather information using the OpenWeatherMap API. Our goal is to
            create a simple, fast, and accessible way for users to get real-time
            weather updates. Built with Next.js, Tailwind CSS, and React, we’re
            committed to delivering a reliable and efficient tool for everyone.
          </p>

          <p className="mb-8 text-gray-700 leading-relaxed">
            If you have any feedback or suggestions, we would love to hear from
            you. Your input helps us improve the app and provide a better
            experience for all users. Please feel free to reach out to us using
            the contact form below.
          </p>
        </div>
        <ContactForm />
      </div>
      <Footer/>

    </div>
  );
}
