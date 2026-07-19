import { Send } from 'lucide-react';

export default function TelegramFAB() {
  return (
    <a
      href="https://t.me/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-float"
      style={{ backgroundColor: '#0088CC' }}
    >
      <Send size={20} color="white" />
    </a>
  );
}
