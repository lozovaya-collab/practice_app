import { React } from "react";
import { useLocation } from 'react-router-dom';

import { MainHeader, MainContent } from "./layouts";

import './assets/scss/main.scss'

const App = () => {
  const location = useLocation();
  return (
    <>
      {
        location.pathname === '/' && <MainHeader  />
      }
      <MainContent />
    </>
  );
}

export {App};
