"use client"

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";

const buttonVariants = cva(
  "rounded-md cursor-pointer tracking-widest min-w-[12rem] text-button uppercase",
  {
    variants: {
      size: {
        small: "px-3 py-2 text-sm",
        base: "px-4 py-2 text-base",
        large: "px-5 py-3 text-base",
      },
      variant: {
        filled: "bg-primary",
        secondary: "bg-[black] text-white",
        outline: "border border-gray-500 text-gray-900 bg-transparent",
      },
      disabled: {
        true: "opacity-40 cursor-not-allowed bg-gray-300 text-gray-500",
        false: "",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "filled",
      disabled: false,
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ElementType;
  isLink?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children?: React.ReactNode;
}

type ButtonOrLinkProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { isLink?: false })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { isLink: true });

const ButtonContent: React.FC<{
  icon?: React.ElementType;
  isLoading?: boolean;
  children?: React.ReactNode;
}> = ({ icon: Icon, isLoading, children }) => (
  <span className="flex items-center justify-center">
    {Icon && (
      <span className="mr-2">
        <Icon className="text-inherit w-5 h-5" />
      </span>
    )}
    <span className="text-inherit">{children}</span>
    {isLoading && <span className="ml-2 animate-spin">⏳</span>}
  </span>
);

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps & ButtonOrLinkProps
>(
  (
    {
      className,
      children,
      isLoading = false,
      icon,
      isLink,
      href,
      target,
      rel,
      disabled,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    const buttonClasses = clsx(
      buttonVariants({ size, variant, disabled: isLoading || disabled }),
      className
    );

    if (isLink) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href ?? "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : rel}
          className={buttonClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          <ButtonContent icon={icon} isLoading={isLoading}>
            {children}
          </ButtonContent>
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClasses}
        disabled={isLoading || disabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <ButtonContent icon={icon} isLoading={isLoading}>
          {children}
        </ButtonContent>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
