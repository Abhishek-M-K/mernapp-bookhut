// import { Link } from "react-router-dom";
// import Header from "../Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id}>
            <div className="flex bg-gray-500 rounded-2xl mb-2">
              {place.photos?.[0] && (
                <Image
                  className="rounded-2xl object-cover aspect-square"
                  src={place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-semibold leading-4">{place.address}</h2>
            <h3 className="text-sm truncate leading-4 mt-1">{place.title}</h3>
            <div className="mt-1">
              <span className="font-semibold">${place.price} per night</span>
            </div>
          </Link>
        ))}
    </div>
  );
}
