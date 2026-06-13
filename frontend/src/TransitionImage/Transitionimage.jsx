export default function TransitionImage({ src, alt, imageRef }) {
  return (
    <div className="transition-image-container">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="object-contain"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "visible",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}