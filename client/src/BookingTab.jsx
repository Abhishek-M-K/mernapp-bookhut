import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingTab({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numOfNights = 0;
  if (checkIn && checkOut) {
    numOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      guests,
      name,
      phone,
      place: place._id,
      price: numOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect("/account/bookings/${bookingId}");
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="text-xl text-center mb-1 -mt-1">
        Price : $ {place.price} / night
      </div>
      <div className="border rounded-xl mt-2 mb-2">
        <div className="flex ">
          <div className="py-2 px-4">
            <label> Check In :</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>

          <div className="py-2 px-4 border-t">
            <label> Check Out :</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-2 px-4 border-t">
          <label> Guests :</label>
          <input
            type="number"
            value={guests}
            onChange={(ev) => setGuests(ev.target.value)}
          />
        </div>
        {numOfNights > 0 && (
          <div className="py-2 px-4 border-t">
            <label> Name :</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />

            <label> Phone Number :</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>

      <button onClick={bookPlace} className="primary">
        Book Now
        {numOfNights > 0 && <span> $ {numOfNights * place.price}</span>}
      </button>
    </div>
  );
}
