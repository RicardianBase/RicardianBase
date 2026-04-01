const images = [
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/1.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/2.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/3.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/4.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/5.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/6.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/7.gif",
  "https://motionsites.ai/cdn-cgi/image/width=600,quality=80/https://motionsites.ai/storage/v1/object/public/sites/vortex/8.gif",
];

const ImageMarquee = () => {
  const allImages = [...images, ...images];

  return (
    <section className="w-full overflow-hidden mt-16 md:mt-20 mb-16">
      <div className="flex animate-marquee" style={{ width: "max-content" }}>
        {allImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Project ${(i % images.length) + 1}`}
            className="h-[280px] md:h-[500px] object-cover mx-3 rounded-2xl shadow-lg flex-shrink-0"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
};

export default ImageMarquee;
