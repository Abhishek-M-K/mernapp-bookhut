import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import Perks from "../Perks";
import { useEffect, useState } from "react";
import axios from "axios";
export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-lg mt-4">{text}</h2>;
  }

  function inputDesc(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function myInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDesc(description)}
      </>
    );
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    //console.log({ files });
    // data.set("photos", files[0]);
    //data.set("photos[]", files);
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        //console.log(data);
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  async function addNewPlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    //onChange([addedPhotos.filter((photo) => photo !== filename)]);
    const updatedPhotos = addedPhotos.filter((photo) => photo !== filename);

    setAddedPhotos(updatedPhotos);
  }

  function selectAsCover(ev, filename) {
    ev.preventDefault();
    //const deletedPhotos = addedPhotos.filter((photo) => photo !== filename);

    const updatedCover = [
      filename,
      ...addedPhotos.filter((photo) => photo !== filename),
    ];

    setAddedPhotos(updatedCover);
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={addNewPlace}>
        {myInput(
          "Title",
          "title for your house, should be short and attractive"
        )}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title : apartment"
        />

        {myInput("Address", "detailed address to this place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />

        {myInput("Photos", "more the merrier")}
        <div className="flex gap-2">
          <input
            value={photoLink}
            onChange={(ev) => setPhotoLink(ev.target.value)}
            type="text"
            placeholder="Link .png/.jpg/.jpeg"
          />
          <button
            onClick={addPhotoByLink}
            className="bg-primary text-white rounded-2xl px-4"
          >
            Add&nbsp;Photos
          </button>
        </div>

        <div className="grid gap-2 grid-cols-4 md:grid-cols-5 lg:grid-cols-8 mt-3">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link) => (
              //this is where the photos will be visible
              //h-32 or hav is used to maintain the symm size of photos
              //objet-cover is used to maintain the photo even if it's stretched
              <div className="h-32 flex relative" key={link}>
                <img
                  className="rounded-2xl w-full object-cover"
                  src={"https://backsample.onrender.com/uploads/" + link}
                  alt=""
                />
                <button
                  onClick={(ev) => removePhoto(ev, link)}
                  className=" cursor-pointer absolute top-1 right-1 text-white bg-black p-0.25 rounded-full bg-opacity-40"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <button
                  onClick={(ev) => selectAsCover(ev, link)}
                  className=" cursor-pointer absolute bottom-1 right-1 text-white bg-black p-0.25 rounded-full bg-opacity-40"
                >
                  {link === addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}

                  {link !== addedPhotos[0] && (
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
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          <label className=" h-32 flex cursor-pointer items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
          </label>
        </div>

        {myInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />

        {/* Perks could be used as a separate component as well
                and also to make the code maintainable */}
        {myInput("Perks", "select all the perks that your place offers")}
        <div className=" mt-4 gap-2 grid grid-cols-2 md:grid-cols-4 ">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {myInput(
          "Check In & Out",
          "add check in-out times (consider timings for room services)"
        )}
        <div className="mt-2 gap-2 grid sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3>Check-in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="11:00"
            />
          </div>
          <div>
            <h3>Check-out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="21:00"
            />
          </div>
          <div>
            <h3>Max Guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>

          <div>
            <h3>Price / night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>

        <button className="primary text-white mt-1 mb-2 rounded-xl px-20 py-2 ">
          Save
        </button>
      </form>
    </div>
  );
}
