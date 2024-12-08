export default async function getIsLoggedIn(){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/isLoggedIn`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (response.status === 200 && data.loggedIn) {
          return {error: '', loggedIn: true};
        } else {
          return {error: data.message, loggedIn: false};
        }
      } catch (err) {
        return {error: 'Failed to get whether user is logged in.', loggedIn: false};
      }
}