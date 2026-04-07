import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import {CitiesProvider } from "./customContexts/CitiesContext";
import { AuthProvider } from "./customContexts/FakeAuthContext";
import Prodectedroute from "./pages/Prodectedroute";

import CityList from "./components/CityList";
import CountriesList from "./components/CountriesList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import HomePage from "./pages/HomePage";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";

const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const HomePage = lazy(() => import("./pages/HomePage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));





function App() {
  


  return (
  <AuthProvider>
  <CitiesProvider>
  <BrowserRouter>

  <Suspense fallback={<SpinnerFullPage />}>
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="*" element={<PageNotFound />} />
    <Route path="product" element={<Product />} />
    <Route path="pricing" element={<Pricing />} />
    <Route path="login" element={<Login />} />

     {/* Nested Routes for AppLayout */}
    <Route path="app" element={
      <Prodectedroute>
        <AppLayout />
      </Prodectedroute>
      }>
    <Route index element={<Navigate replace to='cities' />} />
    <Route path="cities" element={<CityList/>} />
    <Route path="cities/:id" element={<City />} />
    <Route path="countries" element={<CountriesList />} />
    <Route path="form" element={<Form />} />
    </Route>

  </Routes>

  </Suspense>

  </BrowserRouter>
  </CitiesProvider>
  </AuthProvider>
  );
}

export default App;
