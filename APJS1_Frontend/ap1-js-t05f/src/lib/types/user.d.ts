type UserId = string // UUID;

interface User {
  id: UserId
  name: string
  email: string
  profilePicture: string
  cGames: number
  cWins: number
}
