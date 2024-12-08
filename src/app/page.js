// // app/page.js
"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Search from "./search/page";
import Login from "./auth/login/page";
import getIsLoggedIn from "@/app/utils/getIsLoggedIn";

export default function AuthWrapper() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      getIsLoggedIn().then((data) => {
        const error = data.error;
        error
          ? console.log(error)
          : console.log("Successfully fetched user login status");
        setLoggedIn(data.loggedIn);
      });
    };
    fetchData();
  }, []);

  return <div>{loggedIn ? <Search /> : <Login />}</div>;
}
