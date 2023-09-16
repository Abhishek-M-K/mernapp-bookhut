import { Link } from "react-router-dom";
// import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="text-center mt-6">
        <Link
          className="bg-primary text-white py-2 px-4 rounded-full flex gap-2"
          to={"/account/places/new"}
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
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Add new
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              className="flex bg-primary bg-opacity-20 gap-4 p-4 rounded-2xl cursor-pointer mb-2"
            >
              <div className=" flex w-32 h-32 grow shrink-0">
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl font-semibold">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

//   const { action } = useParams();
//   function linkClasses(type = null) {
//     let classes = "py-2 px-6 flex inline-flex gap-1";
//     if (type === false) {
//       classes += " bg-primary text-white rounded-full";
//     }
//     return classes;
//   }

//adding states for the form

//   const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);

//   if (redirectToPlacesList && !action) {
//     return <Navigate to={"/account/places"} />;
//   }
