import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { H1 } from '@/components/ui/typography/h1';
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookmarkMinus, Ellipsis, ExternalLink, Laugh } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { repeatAndCollect } from '@/lib/utils/index';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getPokemonSpriteUrlPokemonId, searchPokemon } from '@/lib/services/pokemon';
import { useCallback, useDeferredValue, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from '@/components/ui/command';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavouritePokemons, unBookmarkPokemon } from '@/store/slices/favourite-pokemons';
import { AppDispatch } from '@/store';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

const emptyPokemonList: Pokemon[] = [];
const columnHelper = createColumnHelper<Pokemon>();

function RouteComponent() {

  const favouritePokemons = useSelector(selectFavouritePokemons)
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState('');
  const deferredSearchQuery = useDeferredValue(search);
  const { data: searchResults, isLoading: isLoadingSearch, error } = useQuery({
    queryKey: ['pokemon-search', deferredSearchQuery],
    queryFn: () => searchPokemon(search),
  })
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const navigate = useNavigate();

  const table = useReactTable({
    data: favouritePokemons || emptyPokemonList,
    columns: [
      columnHelper.accessor('id', {
        cell: info => <TableCell><img width={50} height={50} src={getPokemonSpriteUrlPokemonId(info.getValue())} /></TableCell>,
        header: () => <TableHead >Sprite</TableHead>,
      }),
      columnHelper.accessor('name', {
        cell: info => <TableCell>{info.getValue()}</TableCell>,
        header: () => <TableHead >Name</TableHead>,
      }),
      columnHelper.accessor('base_experience', {
        cell: info => <TableCell >{info.getValue()}</TableCell>,
        header: () => <TableHead >Base XP</TableHead>,
      }),
      columnHelper.accessor('forms', {
        cell: info => <TableCell className='max-w-[300px]'><ScrollArea className='flex whitespace-nowrap gap-1 pb-2'>{info.getValue()?.map((form: PokemonForm) => <Badge variant="outline" key={form.name}>{form.name}</Badge>)} <ScrollBar orientation='horizontal' /></ScrollArea></TableCell>,
        header: () => <TableHead >Forms</TableHead>,
      }),
      columnHelper.accessor('weight', {
        cell: info => <TableCell >{info.getValue()}</TableCell>,
        header: () => <TableHead >Weight</TableHead>,
      }),
      columnHelper.accessor('height', {
        cell: info => <TableCell >{info.getValue()}</TableCell>,
        header: () => <TableHead >Height</TableHead>,
      }),
      columnHelper.accessor('order', {
        cell: info => <TableCell >{info.getValue()}</TableCell>,
        header: () => <TableHead >Order</TableHead>,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <TableHead className='text-right'>Actions</TableHead>,
        cell: (info) => {
          return (<TableCell className='text-right' >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline"><Ellipsis /></Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-56'>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => dispatch(unBookmarkPokemon(info.row.getValue('id')))}>
                    Remove <BookmarkMinus className='ml-auto' />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>)
        },
      })
    ],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const openSearchResults = useCallback(() => {
    setIsSearchResultsOpen(true);
  }, [])

  return <div className='p-8 flex flex-col grow h-full gap-8'>
    <H1 className='flex gap-2'>Pokemons are fun <Laugh absoluteStrokeWidth size={30} /> </H1>
    <p>It's more fun when you have your own personal collection of them</p>

    <CommandDialog open={isSearchResultsOpen} onOpenChange={setIsSearchResultsOpen} >
      <CommandInput placeholder='Did you find pickachu yet ???' onValueChange={(v) => setSearch(v)} value={search} />
      <CommandList className='h-56'>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <DialogTitle>Results {searchResults?.count} {error && "Something went wrong :("}</DialogTitle>
          {isLoadingSearch && repeatAndCollect(5, (i) => <Skeleton key={i} className="w-full h-8" />)}
          {searchResults && searchResults.results.map(res => <CommandItem value={res.name} onSelect={() => navigate({ to: `/${res.name}` })} key={res.name}><ExternalLink /> {res.name}</CommandItem>)}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
    <div>

    </div>
    <div className='border rounded-lg p-2 flex flex-col grow'>
      <Button className='ml-auto' onClick={openSearchResults}>Open Search</Button>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {
                headerGroup.headers.map(header => <Fragment key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</Fragment>)
              }
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className='h-full'>
          {table.getRowModel().rows.length === 0 && <TableRow><TableCell colSpan={7}><p className='text-xl text-center'>Your collection is empty. Use the Search bar above to find your favourite pokemon now</p></TableCell></TableRow>}
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => <Fragment key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Fragment>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className='mt-auto ml-auto justify-end'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>

}
