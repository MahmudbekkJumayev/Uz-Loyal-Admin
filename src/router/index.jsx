import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Categories from "../pages/Categories/Categories";
import Faqs from "../pages/Faqs/Faqs";
import News from "../pages/News/News";
import Blogs from "../pages/Blogs/Blogs";
import Services from "../pages/Services/Services";
import App from "../App";
import Error from "../pages/Error/Error";
import Soursec from "../pages/Soursec/Soursec";
import Login from "../pages/Auth/Login";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/faqs",
        element: <Faqs />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/sources",
        element: <Soursec />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default Router;
