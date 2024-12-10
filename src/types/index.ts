export interface Vote {
  userId: string;
  username?: string;
  value: number | null;
  individuallyRevealed?: boolean;
}

export interface Session {
  id: string;
  votes: Vote[];
  revealed: boolean;
  average: number | null;
  highestVote: number | null;
}

export interface User {
  id: string;
  name: string;
}