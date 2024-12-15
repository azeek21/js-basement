import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { H1 } from '@/components/ui/typography/h1';
import { addPokemonToFovourites, getPokemonById, getPokemonByName, getPokemonSpriteUrlPokemonId, isPokemonInFavourites, removePokemonFromFovourites } from '@/lib/services/pokemon';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router'
import { BookmarkMinus, BookmarkPlus } from 'lucide-react';
import { useMemo } from 'react';

export const Route = createLazyFileRoute('/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id: name } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => getPokemonByName(name),
  })
  const { mutate, submittedAt } = useMutation({
    mutationFn: async (pokemon: Pokemon) => {
      if (isPokemonInFavourites(pokemon)) {
        removePokemonFromFovourites(pokemon)
        return;
      }
      if (pokemon) {
        addPokemonToFovourites(pokemon);
      }
    },
    mutationKey: ['toggle-pokemon-fovourite'],
  });

  const isInFavourites = useMemo(() => data && isPokemonInFavourites(data.id), [data, submittedAt]);

  return <div className='p-8 flex flex-col grow h-full gap-8'>
    {error && <p className='text-red-500'>Something went wrong: {JSON.stringify(error)}</p>}
    {isLoading && <Skeleton className='mx-auto w-72 h-96' />}
    {data && (
      <div className='border max-w-screen-sm mx-auto px-8 rounded-lg flex flex-col gap-4'>
        <img className='object-contain self-center' src={getPokemonSpriteUrlPokemonId(data.id)} alt={`pokemon sprite for ${data.name}`} fetchPriority='high' width={150} height={150} />
        <H1>{data?.name.toUpperCase()}</H1>
        <p>Height: {data?.height}</p>
        <p>Weight: {data?.weight}</p>
        <p>Order: {data?.order}</p>
        <p>Base experience: {data?.base_experience}</p>
        <p className='flex gap-1 flex-wrap'>Forms ({data.forms.length}): {data.forms.map(form => <Badge variant="outline" key={form.url}>{form.name}</Badge>)}</p>
        <div className='border-t w-full p-2 text-right'>
          <Button onClick={() => mutate(data)} variant={isInFavourites ? "default" : "outline"}>{isInFavourites ? <BookmarkMinus /> : <BookmarkPlus />}</Button>
        </div>
      </div>
    )}

  </div>

}
