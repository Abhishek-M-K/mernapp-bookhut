import Image from "./Image";

export default function PlaceImg({ place, index = 0 }) {
  if (!place.photos?.length) {
    return "";
  }

  return (
    <Image
      className="object-cover rounded-2xl"
      src={place.photos[index]}
      alt=""
    />
  );
}
