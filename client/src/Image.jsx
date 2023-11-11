export default function Image({ src, ...rest }) {
  src =
    src && src.includes("http://")
      ? src
      : "https://backsample.onrender.com/uploads" + src;
  return <img {...rest} src={src} alt={""} />;
}
