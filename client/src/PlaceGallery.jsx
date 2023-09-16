import { useState } from "react";

export default function PlaceGallery({ place }) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-2xl mb-2 font-mono">More of "{place.title}"</h2>
            <button
              onClick={() => setShow(false)}
              className="text-black flex absolute right-10 top-24 gap-1 bg-white text-md px-2 py-1 rounded-xl border border-black "
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
          </div>

          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div>
                <img src={"http://localhost:4000/uploads/" + photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {place.photos?.[0] && (
            <div>
              <img
                src={"http://localhost:4000/uploads/" + place.photos[0]}
                alt=""
                className="cursor-pointer aspect-square object-cover"
                onClick={() => setShow(true)}
              />
            </div>
          )}
        </div>

        <div className="grid">
          {place.photos?.[1] && (
            <img
              src={"http://localhost:4000/uploads/" + place.photos[1]}
              alt=""
              className="aspect-square object-cover cursor-pointer"
              onClick={() => setShow(true)}
            />
          )}
          <div className="overflow-hidden">
            {place.photos?.[2] && (
              <img
                src={"http://localhost:4000/uploads/" + place.photos[2]}
                alt=""
                className="cursor-pointer aspect-square object-cover relative top-2"
                onClick={() => setShow(true)}
              />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShow(true)}
        className="flex  gap-1 bg-white absolute bottom-2 right-2 py-1 px-2 rounded-lg border border-black"
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
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        More photos
      </button>
    </div>
  );
}
