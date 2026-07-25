export interface ActionCard {
  id: string;
  title: string;
  description: string;
  actionType: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'rachel';
  timestamp: string;
  aiConfidence?: number;
  actionCards?: ActionCard[];
}
