import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './Assistant.module.scss';
import icons from '../../assets/icons/icons.svg';
import { AssistantProductCard } from './AssistantProductCard';
import { askAssistant } from '../../api/assistant';
import type { AssistantMessage } from '../../api/assistant';

const SUGGESTIONS = [
  'Phones under $500',
  'Cheapest tablet you have',
  'Show me the newest iPhones',
];

const GREETING: AssistantMessage = {
  role: 'assistant',
  content:
    'Hi! Ask me about anything in the store — I can search by price, ' +
    'capacity, colour or model.',
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const Assistant: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const send = async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextHistory: AssistantMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];

    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // The greeting is local-only UI copy, so it is not sent to the model.
      const reply = await askAssistant(nextHistory.slice(1));

      setMessages([
        ...nextHistory,
        {
          role: 'assistant',
          content: reply.message,
          products: reply.products,
        },
      ]);
    } catch {
      setError('The assistant is unavailable right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send(input);
  };

  // Deliberately always mounted: unmounting on close kills the slide-out
  // transition (and would throw away the conversation). Visibility is driven
  // by the `active` class instead, matching how MobileMenu works.
  return (
    <>
      <div
        className={cn(styles.backdrop, { [styles.active]: isOpen })}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(styles.panel, { [styles.active]: isOpen })}
        role="dialog"
        aria-label="Shopping assistant"
        aria-hidden={!isOpen}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Shopping assistant</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close assistant"
          >
            <svg className={styles.closeIcon}>
              <use href={`${icons}#icon-close-menu`} />
            </svg>
          </button>
        </header>

        <div className={styles.messages} ref={scrollRef}>
          {messages.map((message, index) => (
            <div key={index} className={styles.turn}>
              <div
                className={cn(styles.bubble, {
                  [styles.bubbleUser]: message.role === 'user',
                })}
              >
                {message.content}
              </div>

              {message.products && message.products.length > 0 && (
                <div className={styles.results}>
                  {message.products.map(product => (
                    <AssistantProductCard
                      key={product.id}
                      product={product}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className={cn(styles.bubble, styles.typing)}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {messages.length === 1 && (
          <div className={styles.suggestions}>
            {SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className={styles.suggestion}
                onClick={() => send(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder="Ask about products..."
            maxLength={500}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </aside>
    </>
  );
};
