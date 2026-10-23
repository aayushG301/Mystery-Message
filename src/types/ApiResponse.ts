// What the browser receives (plain JSON), not a Mongoose document.
export interface MessageItem {
  id: string;
  content: string;
  createdAt: string; // ISO string
}

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: MessageItem[];
}
