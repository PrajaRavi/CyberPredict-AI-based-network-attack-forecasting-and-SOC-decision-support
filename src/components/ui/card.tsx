import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: "none" | "cyan" | "blue" | "pink" | "purple" | "surface";
    reactive?: boolean;
  }
>(({ className, gradient = "none", reactive = true, ...props }, ref) => {
  const gradientStyles = {
    none: "bg-white border-slate-100/80 shadow-[0_4px_20px_-2px_rgba(23,40,70,0.04)]",
    surface: "bg-gradient-to-b from-white via-white to-slate-50/60 border-slate-100 shadow-[0_4px_24px_-2px_rgba(112,144,176,0.08)]",
    cyan: "bg-linear-to-br from-[#10e5be] via-[#0ccda9] to-[#05b293] text-white border-transparent shadow-[0_12px_28px_-6px_rgba(16,229,190,0.38)]",
    blue: "bg-linear-to-br from-[#68a5fd] via-[#5493f7] to-[#3b7bf6] text-white border-transparent shadow-[0_12px_28px_-6px_rgba(67,121,238,0.38)]",
    pink: "bg-linear-to-br from-[#ff7e95] via-[#fb6380] to-[#e84666] text-white border-transparent shadow-[0_12px_28px_-6px_rgba(251,99,128,0.38)]",
    purple: "bg-linear-to-br from-[#b388ff] via-[#9d68fe] to-[#8042f8] text-white border-transparent shadow-[0_12px_28px_-6px_rgba(157,104,254,0.38)]",
  };

  const reactiveStyles = reactive
    ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_-8px_rgba(23,40,70,0.12)] active:translate-y-0"
    : "";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border",
        gradientStyles[gradient],
        reactiveStyles,
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-slate-800",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
