import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingTab from "../BookingTab";
import PlaceGallery from "../PlaceGallery";

export default function SinglePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  //const [show, setShow] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  //main

  return (
    <div className="mt-6 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="font-serif font-medium text-2xl">{place.title}</h1>
      <a
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
        className="flex mt-1 mb-3 gap-1 font-semibold underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        {place.address}
      </a>

      <PlaceGallery place={place} />

      <div className="mt-8  gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-xl">Description : </h2>
            {place.description}
          </div>
          Check-In Time : {place.checkIn} <br />
          Check-Out Time : {place.checkOut} <br />
          Guests : {place.maxGuests} <br />
        </div>
        <div>
          <BookingTab place={place} />
        </div>
      </div>
    </div>
  );
}
