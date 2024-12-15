import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export function H1({ children, className, ...rest }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return <h1 {...rest} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>{children}</h1>;
}
