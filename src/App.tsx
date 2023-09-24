import React, { useContext } from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchBookPage } from "./layouts/SearchBookPage/SearchBookPage";
import { Redirect, Route, Switch } from "react-router-dom";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { LoginPage } from "./layouts/AuthPage/LoginPage";
import { SignupPage } from "./layouts/AuthPage/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./layouts/Utils/PrivateRoute";
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";

export const App = () => {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ justifyContent: "space-between" }}
    >
      <AuthProvider>
        <Navbar />
        <div className="flex-1">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/search">
              <SearchBookPage />
            </Route>
            <Route path="/reviewlist/:bookId">
              <ReviewListPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/signup">
              <SignupPage />
            </Route>
            <PrivateRoute
              path="/checkout/:bookId"
              component={BookCheckoutPage}
            />
          </Switch>
        </div>
        <Footer />
      </AuthProvider>
    </div>
  );
};

export default App;
