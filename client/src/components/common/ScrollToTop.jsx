import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Resetea el scroll de la ventana principal (Landing, Public Pages)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;