import Image from "next/image";
import Link from "next/link";
import React from "react";
import TextLogo from "../public/anon-pay-logo-with-text.png"

export const Logo = () => {
  return (
    <Link href="/" passHref>
      <Image
        src={TextLogo}
        alt="AnonPay logo"
        className="min-w-[50px] w-28 sm:w-48 md:w-56 lg:w-60 cursor-pointer"
      />
    </Link>
  );
};
