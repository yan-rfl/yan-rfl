import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function MacRestoreIcon({ size, width, height, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      width={size ?? width ?? "1em"}
      height={size ?? height ?? "1em"}
      {...props}
    >
      {/* Top-left area: right angle rotated to face center, flat hypotenuse at outer edge */}
      <path d="M7 7 L3 7 L7 3 Z" />
      {/* Bottom-right area: right angle rotated to face center, flat hypotenuse at outer edge */}
      <path d="M9 9 L13 9 L9 13 Z" />
    </svg>
  );
}
