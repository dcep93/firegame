export default function Main() {
  const src = `${window.location.origin}/public_catann`;
  return (
    <div>
      <iframe
        title={src}
        src={src}
        style={{ width: "100vW", height: "100vH" }}
      />
    </div>
  );
}
