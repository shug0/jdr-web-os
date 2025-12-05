import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/shield_13.png"
        alt="JDR Coffee Shield"
        width={size}
        height={size}
        className="image-rendering-pixelated"
        priority
      />
    </div>
  );
}
