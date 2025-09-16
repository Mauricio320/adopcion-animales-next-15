import Image from "next/image";

export const BannerPrincipal = () => {
  return (
    <div className="bg-emerald-600 w-full px-4 flex ">
      <div>
        <Image
          src="/img/direccion-comunitario-blanco.png"
          alt="Gobierno de Colombia"
          width={140}
          height={57}
          unoptimized
        />
      </div>
      <Image
        src="/img/bienestar-animal.png"
        alt="Gobierno de Colombia"
        width={140}
        height={57}
        unoptimized
      />
    </div>
  );
};
