import Image from "next/image";

export const BannerPage = () => {
  return (
    <Image
      src="img/banner4.png"
      alt={`Banner title`}
      width={800}
      height={400}
      className="max-w-[100%] w-full"
      unoptimized
    />
  );
};
