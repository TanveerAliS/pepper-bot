import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
        />
      ) : (
        children
      )}
    </div>
  )
);
Avatar.displayName = "Avatar";

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-xs font-medium text-gray-600 dark:text-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback };
