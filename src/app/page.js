// // app/page.js
'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Search from './search/page';
import Login from './auth/login/page';

export default function AuthWrapper() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const jwt = Cookies.get('JWT'); // Token aus dem Cookie lesen
    const getIsLoggedIn = async (token) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/isLoggedIn`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (response.status === 200 && data.loggedIn) {
          setLoggedIn(true);
        } else {
          setError(data.message);
          setLoggedIn(false);
        }
      } catch (err) {
        setError('Failed to get whether user is logged in.');
        setLoggedIn(false);
      }
    };
    getIsLoggedIn(jwt);
  }, []);


  return (
    <div>
      {
        loggedIn ? <Search/> : <Login/>
      }
    </div>
  );
}
