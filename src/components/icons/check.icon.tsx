interface CheckIconProps {
  className?: string;
}

export default function CheckIcon({ className }: CheckIconProps) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.8327 25C45.8327 36.5058 36.5052 45.8333 24.9993 45.8333C13.4934 45.8333 4.16602 36.5058 4.16602 25C4.16602 13.4941 13.4934 4.16666 24.9993 4.16666C36.5052 4.16666 45.8327 13.4941 45.8327 25ZM33.3958 18.6868C34.006 19.297 34.006 20.2863 33.3958 20.8965L22.9791 31.3131C22.3689 31.9233 21.3798 31.9233 20.7695 31.3131L16.6028 27.1465C15.9926 26.5362 15.9926 25.5471 16.6028 24.9369C17.213 24.3267 18.2023 24.3267 18.8125 24.9369L21.8743 27.9985L26.5302 23.3427L31.1862 18.6868C31.7964 18.0766 32.7856 18.0766 33.3958 18.6868Z"
        fill="currentColor"
      />
    </svg>
  );
}
