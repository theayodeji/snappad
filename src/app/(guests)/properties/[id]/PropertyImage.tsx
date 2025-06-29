interface PropertyImageProps {
  src: string;
  alt: string;
}

export default function PropertyImage({ src, alt }: PropertyImageProps) {
  return (
    <div className="w-full mt-5 md:mt-8">
      <img
        src={src}
        alt={alt}
        className="w-full h-[240px] md:h-[300px] lg:h-[400px] object-cover rounded-xl md:rounded-lg"
      />
    </div>
  );
}
