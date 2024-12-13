import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return <div className="flex flex-col gap-8 flex-grow justify-center items-center">
    Index page
  </div>
}
