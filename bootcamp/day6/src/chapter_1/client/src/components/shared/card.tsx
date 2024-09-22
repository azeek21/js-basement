import { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> { }

export default function Card({ children, className, ...rest }: CardProps) {



  return <div className={twMerge("border  border-orange-400 rounded-lg", className)} {...rest}>
    {children}
  </div>
}
