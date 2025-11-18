import * as React from "react";

export function CustomBell({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g>
        <path
          d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2z"
          fill="currentColor"
          className="bell-clapper"
        />
        <path
          d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 1.5a1 1 0 0 0 .7 1.7h15.6a1 1 0 0 0 .7-1.7L18 16z"
          fill="none"
        />
        <path d="M6 16v-5a6 6 0 1 1 12 0v5" fill="none" />
      </g>
    </svg>
  );
}
