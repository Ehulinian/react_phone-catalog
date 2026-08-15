import { API_URL } from '../config';
import { Product } from '../types/Product';

export type AssistantRole = 'user' | 'assistant';

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
  // Products the assistant found for this turn, rendered as real product
  // cards instead of being described in the text.
  products?: Product[];
};

type AssistantApiReply = {
  message: string;
  products: Product[];
};

export async function askAssistant(
  history: AssistantMessage[],
): Promise<AssistantApiReply> {
  const response = await fetch(`${API_URL}/api/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: history.map(({ role, content }) => ({ role, content })),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(body?.error || 'Assistant request failed');
  }

  return response.json();
}
