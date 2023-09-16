export default function PlaceImg({ place, index = 0 }) {
  if (!place.photos?.length) {
    return "";
  }

  return (
    <img
      className="object-cover rounded-2xl"
      src={"http://localhost:4000/uploads/" + place.photos[index]}
      alt=""
    />
  );
}
