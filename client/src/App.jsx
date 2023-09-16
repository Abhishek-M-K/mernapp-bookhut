import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/indexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import SinglePage from "./pages/SinglePage";
import BookingPage from "./pages/BookingPage";
import BookedPage from "./pages/BookedPage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    // <div className='bg-red-500'>testing</div>
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<SinglePage />} />
          <Route path="/account/bookings" element={<BookingPage />} />
          <Route path="/account/bookings/:id" element={<BookedPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
