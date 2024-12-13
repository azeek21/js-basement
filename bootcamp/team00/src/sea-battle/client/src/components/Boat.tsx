import { HTMLAttributes } from "react";

interface BoatProps extends HTMLAttributes<HTMLDivElement> {
    boat: Boat
}

export function Boat({
    boat: Boat,
    ...divProps
}: BoatProps) {


    return <div {...divProps}>
        B
    </div>
}
