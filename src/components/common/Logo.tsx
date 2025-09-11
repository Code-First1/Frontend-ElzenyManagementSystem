function Logo({ size }: { size: "lg" | "md" | "sm" }) {
  return (
    <img
      src="/logo.jpeg"
      alt="logo"
      className={`${size === "lg" ? "w-[8rem]" : size === "md" ? "w-[6rem]" : "w-[4rem]"} rounded-2xl object-cover`}
    />
  );
}

export default Logo;
