import { CrosshairIcon, Sailboat, Waves } from "lucide-react";
import { HTMLAttributes, useCallback, useMemo, useRef } from "react";

const CELL_CLASS_MAP: Record<string, string> = {
    'a': '',
    's': '',
    'x': 'pointer-events-none',
    '0': 'pointer-events-none',
}

interface GameCellProps extends HTMLAttributes<HTMLDivElement> {
    value: string
}
export function GameCell({ value, className, ...rest }: GameCellProps) {
    return <div className={`${CELL_CLASS_MAP[value]} relative border border-cyan-200 flex items-center justify-center overflow-clip ${className}`} {...rest}>
        <Waves className="absolute -z-10 text-blue-300 w-full left-0 -bottom-7 right-0" size={'190%'} absoluteStrokeWidth />
        {value === 's' && <Sailboat size={'60%'} className="text-blue-500" />}
        {value === 'x' && (
            <>
                <Sailboat size={'70%'} className="text-blue-500" />
                <CrosshairIcon className="absolute text-red-500 z-10" absoluteStrokeWidth />
            </>
        )}
        {
            value === '0' && (
                <CrosshairIcon className="absolute text-red-400 z-10" absoluteStrokeWidth />
            )
        }
    </div>
}

export type CellMouseEvent = (tar: HTMLElement, pos: [number, number]) => void;

interface GameMapProps {
    map: string;
    renderCell: (cell: string, [x, y]: [number, number], index: number) => React.ReactNode
    onMouseInCell?: CellMouseEvent,
    onMouseOutCell?: CellMouseEvent,
    disabled?: boolean
}

function GameMap({ map, renderCell, onMouseInCell, onMouseOutCell, disabled }: GameMapProps) {
    const prevTargetRef = useRef<HTMLDivElement | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const cells = useMemo(() => {
        const result = [];
        let index = 0;
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                index = (y * 10) + x;
                result.push(renderCell(map[index], [x, y], index))
            }
        }
        return result;
    },
        [map, renderCell]
    );

    const mouseMoveHandler = useCallback((ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!(ev.target instanceof HTMLElement)) return;

        const positionString = ev.target.getAttribute('data-position');
        if (!positionString) return;
        const position = positionString.split(',').map(s => Number(s)) as [number, number];
        if (position.length !== 2) return;

        if (prevTargetRef.current !== null && prevTargetRef.current === ev.target) return;
        if (prevTargetRef.current === null) {
            onMouseInCell && onMouseInCell(ev.target, position);
        } else if (ev.target != prevTargetRef.current) {
            onMouseOutCell && onMouseOutCell(prevTargetRef.current, position);
            onMouseInCell && onMouseInCell(ev.target, position);
        }

        prevTargetRef.current = ev.target as HTMLDivElement;
    }, [onMouseInCell, onMouseOutCell])

    const mouseLeaveHandler = useCallback(() => {
        if (prevTargetRef.current) {
            onMouseOutCell && onMouseOutCell(prevTargetRef.current, [0, 0]);
        }
        prevTargetRef.current = null;
    }, [onMouseOutCell])

    return <div ref={mapContainerRef} onMouseLeave={mouseLeaveHandler} onMouseMove={(ev) => mouseMoveHandler(ev)} className={`grid grid-cols-10 grid-rows-10 border-2 border-blue-300 aspect-square ${disabled ? 'pointer-events-none' : ''}`}>{cells}</div>
}

export {
    GameMap,
}
