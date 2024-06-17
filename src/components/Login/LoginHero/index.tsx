import Image from "next/image";

const LoginHero = () => {
  return (
    <div className="relative w-full h-full hidden sm:block">
      <Image
        src="/assets/Lou_F&B_51.jpg"
        alt="login hero image"
        layout="fill"
        objectFit="cover"
        objectPosition="right"
      />
    </div>
  );
};

export default LoginHero;
