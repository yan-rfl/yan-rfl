import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function MacMaximizeIcon({ size, width, height, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      width={size ?? width ?? "1em"}
      height={size ?? height ?? "1em"}
      {...props}
    >
      {/* Top-left: right angle at corner, hypotenuse near center */}
      <path d="M4 4 L11 4 L4 11 Z" />
      {/* Bottom-right: right angle at corner, hypotenuse near center */}
      <path d="M12 12 L5 12 L12 5 Z" />
    </svg>
  );
}
