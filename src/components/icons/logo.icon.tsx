interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      className={className}
      width="58"
      height="58"
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_172_595)">
        <path
          d="M28.9727 41.472C35.6001 41.472 40.9727 36.0994 40.9727 29.472C40.9727 22.8446 35.6001 17.472 28.9727 17.472C22.3452 17.472 16.9727 22.8446 16.9727 29.472C16.9727 36.0994 22.3452 41.472 28.9727 41.472Z"
          fill="#3083C9"
        />
        <path
          d="M36 29.472C36 33.338 32.866 36.472 29 36.472C25.134 36.472 22 33.338 22 29.472C22 25.606 25.134 22.472 29 22.472"
          stroke="#C6E2F7"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          className="animate-pulse"
        />
        <path
          d="M1 29.309L1.23 29.077C16.579 13.604 41.596 13.604 56.945 29.077"
          stroke="#556080"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_172_595">
          <rect width="57.945" height="57.945" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
