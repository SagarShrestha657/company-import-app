import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import { ToastContainer } from "react-toastify";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import AllPokemon from "./pages/AllPokemon";
import SinglePokemon from "./pages/SinglePokemon";
import ThemeToggle from "./components/ThemeToggle";

NProgress.configure({ showSpinner: false });

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AllPokemon />,
    },
    {
      path: "/pokemon/:name",
      element: <SinglePokemon />,
    },
  ]);



  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
      <ThemeToggle />
    </>
  );
}

export default App;