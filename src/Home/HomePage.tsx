import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    window.location.href = 'https://github.com/junhoyeo/ondiscord.io';
  }, []);
  return null;
};

export default HomePage;
