import { createLazyFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/store';
import { selectIo } from '../store/selectors';
import { BASE_EVENTS, GAME_PROGRESS_STATE, GameSession } from '../../../shared/const/constants';
import { CellMouseEvent, GameCell, GameMap } from '../components/Game';
import { CircleCheckBig, CircleMinus, Ship } from 'lucide-react';
import { isAllShipsPlaced } from '../lib/game';
import groupBy from 'lodash.groupby';
import { isDefined, isPointAvailableInAxis } from '../lib/shared/utils/checks';
import { getBottom, getLeft, getLinearIndex, getRight, getTop, } from '../lib/shared/utils/getters';
import { getEmptyShipPlacement, getRandomMap } from "../../../shared/functions/map";

function randomId() {
  return `${Math.random()}-${Math.random()}-${Math.random()}`
}

export const Route = createLazyFileRoute('/game')({
  component: GamePage,
})

export function getShipCordsAtPoint(map: string, point: [number, number], isShip: (point: string) => boolean): Array<[number, number]> {
  const res: Array<[number, number]> = [];
  let top = getTop(point);
  let bottom = getBottom(point);
  let left = getLeft(point);
  let right = getRight(point);
  let align = '';

  if (isShip(map[getLinearIndex(left)]) || isShip(map[getLinearIndex(right)])) {
    align = 'horizontal';
  } else if (isShip(map[getLinearIndex(top)]) || isShip(map[getLinearIndex(bottom)])) {
    align = 'vertical';
  } else {
    return [point];
  }

  res.push(point)
  if (align === 'horizontal') {
    while (isShip(map[getLinearIndex(left)])) {
      res.push(left);
      left = getLeft(left);
    }
    while (isShip(map[getLinearIndex(right)])) {
      res.push(right);
      right = getRight(right);
    }
  } else {
    while (isShip(map[getLinearIndex(top)])) {
      res.push(top);
      top = getTop(top);
    }
    while (isShip(map[getLinearIndex(bottom)])) {
      res.push(bottom);
      res.push(bottom);
    }
  }

  return res;
}

function placeBoatOnMap(map: string, start: [number, number], end?: [number, number]) {
  if (!end) {
    let m = map.split('');
    let s = getLinearIndex(start);
    m[s] = 's';
    return m.join('')
  }

  let align = '';
  if (start[0] === end[0]) {
    align = 'vertical';
  } else if (start[1] === end[1]) {
    align = 'horizontal';
  }

  if (!align) {
    return map; // uhh goota throw or smth but we ingoring it for now
  }

  let m = map.split('');

  if (align === 'horizontal') {
    const distance = start[0] - end[0];
    const boatSize = Math.abs(distance);
    for (let i = 0; i != boatSize + 1; i++) {
      const toBeMarked = getLinearIndex([(distance < 0 ? start[0] : end[0]) + i, start[1]])
      m[toBeMarked] = 's';
    }
  } else {
    const distance = start[1] - end[1];
    const boatSize = Math.abs(distance);
    for (let i = 0; i != boatSize + 1; i++) {
      const toBeMarked = getLinearIndex([start[0], (distance < 0 ? start[1] : end[1]) + i])
      m[toBeMarked] = 's';
    }
  }
  return m.join('')
}

function makeShip(size: number): Boat {
  return {
    size,
    id: randomId(),
  }
}

function multiple(count: number, cb: () => unknown) {
  return Array(count).fill(0).map(cb)
}

function isPlacable(map: string, boatSize: number, start: [number, number], end?: [number, number]): boolean {
  if (!end) {
    return isPointAvailableInAxis(map, start, 'all');
  }

  if (boatSize === 1) {
    return end[0] == start[0] && end[1] == start[1];
  };

  let align = '';
  if (start[0] === end[0]) {
    align = 'vertical';
  } else if (start[1] === end[1]) {
    align = 'horizontal';
  }

  if (!align) return false;

  if (align === 'horizontal') {
    const distance = start[0] - end[0];
    if (boatSize - 1 !== (Math.abs(distance))) return false;
    let point = [0, 0] as [number, number];
    for (let i = 1; i != boatSize - 1; i++) {
      point = [(distance < 0 ? start[0] : end[0]) + i, start[1]]
      if (!isPointAvailableInAxis(map, point, align)) return false;
    }
    return true;
  }

  const distance = start[1] - end[1];
  if (boatSize - 1 !== (Math.abs(distance))) return false;
  let point = [0, 0] as [number, number];
  for (let i = 1; i != boatSize - 1; i++) {
    point = [start[0], (distance < 0 ? start[1] : end[1]) + i];
    if (!isPointAvailableInAxis(map, point, 'vertical')) return false;
  }
  return true;
}

const INITIAL_SHIPS = [
  ...multiple(1, () => makeShip(1)),
  ...multiple(2, () => makeShip(2)),
  ...multiple(3, () => makeShip(3)),
  ...multiple(4, () => makeShip(4))
] as Boat[];

function GamePage() {
  const user = useStore(s => s.user);
  const [game, setGame] = useState<GameSession>({
    state: GAME_PROGRESS_STATE.INITIALIZING,
  } as GameSession);

  const OPPONENT_MAP = useMemo(() => game.inviterId === user?.id ? 'shipPlacementPlayerB' : 'shipPlacementPlayerA', [game, user]);
  const PLAYER_MAP = useMemo(() => game.inviterId === user?.id ? 'shipPlacementPlayerA' : 'shipPlacementPlayerB', [game, user]);
  const OPPONENT_READY_INDENTIFIER = useMemo(() => game.inviterId === user?.id ? 'playerBReady' : 'playerAReady', [game, user])

  const [shipsToBePlaced, setShipsToBePlaced] = useState<Boat[]>(INITIAL_SHIPS);
  const [usingRandomMap, setUsingRandomMap] = useState(false);
  const [placedShips, setPlacedShips] = useState<Boat[]>([]);
  const [currentlyPlacingShip, setCurrentlyPlacingShip] = useState<Boat | undefined>()
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);
  const io = useStore(selectIo);

  const randomlyPopulatePlayerMap = useCallback(() => {
    let map = getRandomMap();
    setUsingRandomMap(true);
    setGame((game) => ({ ...game, [PLAYER_MAP]: map }));
  }, [PLAYER_MAP]);

  const newGameWith = useCallback((id: number) => {
    io.emit(BASE_EVENTS.NEW_GAME, id);
  }, [io]);

  const readyToStartGame = useCallback(() => {
    io.emit(BASE_EVENTS.PLAYER_READY, game.id, game[PLAYER_MAP]);
  }, [game[PLAYER_MAP], user, PLAYER_MAP, io]);

  const isUserDonePlacingShips = useMemo(() => isAllShipsPlaced(placedShips), [placedShips]);

  const shipClickController = useCallback((ship?: Boat) => {
    if (!currentlyPlacingShip) {
      setCurrentlyPlacingShip(ship);
      return;
    } else {
      alert("You haven't finshed placing previously selected ship, plase place it or start placing again by clicking \"reset\"")
    }
  }, [currentlyPlacingShip]);

  const cellClickHandler = useCallback(([x, y]: [number, number]) => {
    if (currentlyPlacingShip && !isDefined(currentlyPlacingShip?.start)) {
      setCurrentlyPlacingShip({ ...currentlyPlacingShip, start: [x, y] })
      return;
    } else if (currentlyPlacingShip && !isDefined(currentlyPlacingShip?.end)) {
      //setGame({ ...game, [PLAYER_MAP]:  });
      setShipsToBePlaced((ships) => ships.filter((s) => s.id !== currentlyPlacingShip.id));
      setPlacedShips((ships) => ([...ships, { ...currentlyPlacingShip, end: [x, y] }]));
      setCurrentlyPlacingShip(undefined);
    }
  }, [currentlyPlacingShip, game]);


  const attackToOpponentHandler = useCallback((cordinates: [number, number]) => {
    io.emit(BASE_EVENTS.PLAYER_ATTACK, game.id, cordinates);
  }, [io, game]);

  const restartShipPlacement = useCallback(() => {
    setGame((game) => ({ ...game, [PLAYER_MAP]: getEmptyShipPlacement() }));
    setPlacedShips([]);
    setShipsToBePlaced(INITIAL_SHIPS);
    setCurrentlyPlacingShip(undefined);
    setUsingRandomMap(false);
  }, []);

  const playAgain = useCallback(() => {
    setGame({ state: GAME_PROGRESS_STATE.INITIALIZING } as GameSession);
    setPlacedShips([]);
    setShipsToBePlaced(INITIAL_SHIPS);
    setCurrentlyPlacingShip(undefined);
    setUsingRandomMap(false);
  }, []);

  const giveUpGame = useCallback(() => {
    io.emit(BASE_EVENTS.PLAYER_GIVE_UP, game.id);
  }, [io, game]);

  const handleMouseInCell: CellMouseEvent = useCallback((tar, pos) => {
    if (!(tar instanceof HTMLElement)) return;
    if (!isDefined(currentlyPlacingShip?.start)) {
      if (isPlacable(game[PLAYER_MAP] as string, currentlyPlacingShip?.size as number, pos, currentlyPlacingShip?.end)) {
        tar.classList.add('ship-placeable');
      } else {
        tar.classList.add('ship-unplaceable');
      }
    } else if (!isDefined(currentlyPlacingShip?.end)) {
      if (isPlacable(game[PLAYER_MAP] as string, currentlyPlacingShip?.size as number, currentlyPlacingShip?.start!, pos)) {
        tar.classList.add('ship-placeable');
      } else {
        tar.classList.add('ship-unplaceable');
      }
    }
  }, [currentlyPlacingShip, game]);

  const handleMouseOutCell: CellMouseEvent = useCallback((tar) => {
    if (!(tar instanceof HTMLElement)) return;
    tar.classList.remove('ship-unplaceable', 'ship-placeable');
  }, []);

  useEffect(() => {
    io.on(BASE_EVENTS.ONLINE_PLAYERS, (ps) => {
      setAvailablePlayers(ps)
    })

    io.on(BASE_EVENTS.MY_GAME, (gameObj) => {
      setGame(gameObj);
    })

    return () => {
      io.off(BASE_EVENTS.ONLINE_PLAYERS);
      io.off(BASE_EVENTS.MY_GAME);
    }
  }, [io])

  const renderedAvailablePlayers = useMemo(() => availablePlayers.filter(p => p.id != user?.id).map(p =>
    <li key={p.id} className='border border-blue-400 rounded-xl text-center p-2 cursor-pointer'
      onClick={() => newGameWith(p.id)}
    >
      {p.username}
    </li>
  ), [availablePlayers]);

  const drawnPreGameMap = useMemo(() => {
    const mapWithReadyShips = placedShips.reduce((acc, ship) => placeBoatOnMap(acc, ship.start!, ship.end), game[PLAYER_MAP]);
    if (currentlyPlacingShip && currentlyPlacingShip.start) {
      return placeBoatOnMap(mapWithReadyShips, currentlyPlacingShip.start, currentlyPlacingShip.end);
    }
    return mapWithReadyShips;
  }, [game, PLAYER_MAP, placedShips, currentlyPlacingShip]);

  const shipControls = useMemo(() => Object.entries(groupBy(shipsToBePlaced, 'size'))
    .map(([k, v]) => <div
      key={k}
      className={`flex border border-blue-400 p-1 rounded-lg ${k === String(currentlyPlacingShip?.size) ? 'bg-blue-200' : ''}`}
      onClick={() => v[0] && shipClickController(v[0])}
    >
      <Ship /> ({k}x cage): x{v.length}
    </div>),
    [shipsToBePlaced, currentlyPlacingShip]);

  const isNowMyTurn = useMemo(() => game.turnOfUserId === user?.id, [game, user]);

  return (
    <div className='p-4 flex w-full h-full items-start justify-around gap-8'>
      {game.state === GAME_PROGRESS_STATE.INITIALIZING &&
        (
          <div className='mx-auto'>
            <p>Start new game against: </p>
            <ul className='flex flex-col gap-2'>
              {renderedAvailablePlayers}
            </ul>
          </div>
        )
      }

      {
        game.state === GAME_PROGRESS_STATE.SETUP && (
          <>
            <div className='flex flex-col gap-4 w-1/3'>
              <h1>Opponent is {!game[OPPONENT_READY_INDENTIFIER] && "not"} raedy to start the game</h1>
              <GameMap map={game[OPPONENT_MAP] as string} renderCell={(s, _, i) => <GameCell value={s} key={`${i}-${s}`} />} />
              <div id='ships-container' className='flex flex-row justify-around'>
              </div>
            </div>
            <h1 className='my-auto text-red-500 text-9xl'>x</h1>
            <div className='flex flex-col gap-4 w-1/3'>
              <h1>Player</h1>
              <GameMap onMouseInCell={currentlyPlacingShip && handleMouseInCell} onMouseOutCell={handleMouseOutCell} map={drawnPreGameMap} renderCell={(s, pos, i) => <GameCell onClick={() => cellClickHandler(pos)} value={s} key={`${i}-${s}`} data-position={`${pos}`} />} />
              <div id='ships-container' className='flex flex-row justify-around gap-2'>
                {!usingRandomMap && shipControls}
                <button onClick={randomlyPopulatePlayerMap} className='bg-blue-500 hover:bg-blue-700 text-white [&.active]:bg-blue-700 font-bold py-2 px-4 rounded disabled:bg-gray-400'>Random map</button>
              </div>
              <button onClick={readyToStartGame} disabled={usingRandomMap ? false : !isUserDonePlacingShips} className='bg-blue-500 hover:bg-blue-700 text-white [&.active]:bg-blue-700 font-bold py-2 px-4 rounded disabled:bg-gray-400'>Ready</button>
              <button onClick={restartShipPlacement} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Rest</button>
            </div>
          </>
        )
      }

      {
        game.state === GAME_PROGRESS_STATE.IN_PROGRESS && (
          <>
            <div className='flex flex-col gap-4 w-1/3'>
              <GameMap map={game[OPPONENT_MAP] as string} renderCell={(s, pos, i) => <GameCell onClick={() => attackToOpponentHandler(pos)} value={s} key={`${i}-${s}`} className={s === 'a' ? 'cursor-crosshair' : ''} />} />
              <div id='ships-container' className='flex flex-row justify-around'>
              </div>
            </div>
            <h1 className='my-auto text-red-500 text-9xl'>x</h1>
            <div className='flex flex-col gap-4 w-1/3'>
              <h1 className='flex gap-2'>It's {isNowMyTurn ? 'your' : 'opponent\'s'} turn now {isNowMyTurn ? <CircleCheckBig className='text-green-500' /> : <CircleMinus className='text-yellow-400' />}</h1>
              <GameMap disabled={!isNowMyTurn} map={game[PLAYER_MAP] as string} renderCell={(s, pos, i) => <GameCell value={s} key={`${i}-${s}`} data-position={`${pos}`} />} />
              <button onClick={giveUpGame} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Give up</button>
            </div>
          </>
        )
      }

      {game.state == GAME_PROGRESS_STATE.ENDED && (
        <>
          <div className='flex flex-col gap-4 w-1/3'>
            <h1>This is what opponents artilery placement looked like: </h1>
            <GameMap disabled map={game[OPPONENT_MAP] as string} renderCell={(s, _, i) => <GameCell value={s} key={`${i}-${s}`} />} />
            <div id='ships-container' className='flex flex-row justify-around'>
            </div>
          </div>
          <h1 className='my-auto text-red-500 text-9xl'>x</h1>
          <div className='flex flex-col gap-4 w-1/3'>
            {game.winnerId === user?.id ?
              <h1 className='text-3xl text-green-500'>You won !!!</h1>
              :
              <h1 className='text-3xl'>You lost this time :(</h1>
            }
            <GameMap disabled map={game[PLAYER_MAP] as string} renderCell={(s, pos, i) => <GameCell value={s} key={`${i}-${s}`} data-position={`${pos}`} />} />
            <button onClick={playAgain} className='bg-blue-500 hover:bg-blue-700 text-white [&.active]:bg-blue-700 font-bold py-2 px-4 rounded disabled:bg-gray-400'>Play again</button>
          </div>
        </>
      )}

    </div>
  )
}
