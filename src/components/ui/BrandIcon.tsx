import type { SVGProps } from "react";
import { FaWhatsapp } from "react-icons/fa6";

type BrandIconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon({ className, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className, ...props }: BrandIconProps) {
  return <FaWhatsapp className={className} aria-hidden="true" {...props} />;
}
