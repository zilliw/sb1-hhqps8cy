import { io } from 'socket.io-client';
import { useSessionStore } from '../stores/session';
import { useUserStore } from '../stores/user';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket;
  
  constructor() {
    this.socket = io(SOCKET_URL);
    this.setupListeners();
  }

  private setupListeners() {
    const sessionStore = useSessionStore();
    const userStore = useUserStore();

    this.socket.on('userJoined', (data) => {
      sessionStore.addParticipant(data.userId, data.username);
    });

    this.socket.on('userLeft', (userId) => {
      sessionStore.removeParticipant(userId);
    });

    this.socket.on('vote', (data) => {
      sessionStore.updateVote(data.userId, data.username, data.value);
    });

    this.socket.on('revealVotes', () => {
      sessionStore.revealVotes();
    });

    this.socket.on('resetVotes', () => {
      sessionStore.resetVotes();
    });

    this.socket.on('sessionState', (state) => {
      sessionStore.updateSessionState(state);
    });
  }

  joinRoom(roomId: string) {
    const userStore = useUserStore();
    this.socket.emit('joinRoom', {
      roomId,
      userId: userStore.userId,
      username: userStore.username
    });
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leaveRoom', {
      roomId,
      userId: useUserStore().userId
    });
  }

  vote(value: number | null) {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    
    this.socket.emit('vote', {
      roomId: sessionStore.currentSession?.id,
      userId: userStore.userId,
      username: userStore.username,
      value
    });
  }

  revealVotes() {
    const sessionStore = useSessionStore();
    this.socket.emit('revealVotes', {
      roomId: sessionStore.currentSession?.id
    });
  }

  resetVotes() {
    const sessionStore = useSessionStore();
    this.socket.emit('resetVotes', {
      roomId: sessionStore.currentSession?.id
    });
  }
}

export const socketService = new SocketService();