import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, ExternalLink } from 'lucide-react';
import { ChatMessage, Language } from '../types';

interface TanyaAIProps {
  language: Language;
}

const TanyaAI: React.FC<TanyaAIProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset or Set Greeting
    const greetingText = language === 'pt'
      ? 'Olá! Sou a Tanya 🌸, a assistente virtual do Puro Charme. Posso ajudar com horários, serviços ou marcações?'
      : 'Hello! I am Tanya 🌸, Puro Charme virtual assistant. Can I help you with hours, services, or bookings?';

    if (messages.length === 0 || messages[0].sender === 'tanya') {
      setMessages([{
        id: '1',
        text: greetingText,
        sender: 'tanya',
        timestamp: new Date()
      }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const generateResponse = async (text: string, lang: Language): Promise<string> => {
    const t = text.toLowerCase();

    // PT Local Logic
    if (lang === 'pt') {
      if (t.includes('corte') || t.includes('cortar')) return '⚠️ Nota importante: Na Puro Charme *não* realizamos cortes de cabelo. Somos especialistas em tratamentos, tranças, extensões e estética! 🌸';
      if (t.includes('preço') || t.includes('valor')) return 'Os preços variam por serviço. Recomendo pedir um orçamento personalizado pelo WhatsApp!';
      if (t.includes('onde') || t.includes('fica')) return 'Estamos em Cuamba, Niassa. Podes ver o mapa na secção de contactos!';
      if (t.includes('horario') || t.includes('hora')) return 'Segunda a Sábado, das 08:00 às 18:00 (Sáb até 15:00).';
      if (t.includes('agenda')) return 'Podes agendar aqui no site ou clicar no botão "Whatsapp Directo"!';
    }
    // EN Local Logic
    else {
      if (t.includes('cut') || t.includes('haircut')) return '⚠️ Important: We do *not* perform haircuts. We specialize in treatments, braids, extensions, and aesthetics! 🌸';
      if (t.includes('price') || t.includes('cost')) return 'Prices vary by service. I recommend asking for a quote via WhatsApp!';
      if (t.includes('where') || t.includes('location')) return 'We are in Cuamba, Niassa. Check the map in the contact section!';
      if (t.includes('open') || t.includes('hours')) return 'Mon-Sat, 08:00 to 18:00 (Sat until 15:00).';
      if (t.includes('book')) return 'You can book here or click the "Whatsapp Direct" button!';
    }

    // Fallback to Gemini
    try {
      const { sendMessageToGemini } = await import('../services/geminiService');
      const aiResponse = await sendMessageToGemini(text);
      return aiResponse;
    } catch (e) {
      console.error("AI Error", e);
      return lang === 'pt'
        ? 'Desculpe, estou com dificuldades de conexão. Pode tentar novamente?'
        : 'Sorry, I am having connection issues. Can you try again?';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate natural delay + API call time
    // We start typing immediately.

    // Call API (or local logic)
    generateResponse(userMsg.text, language).then((responseText) => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'tanya',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 bg-white rounded-3xl shadow-soft w-[300px] sm:w-[350px] overflow-hidden border border-gray-100 mb-2"
            >
              {/* Header */}
              <div className="bg-puro-black p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-puro-pastelPink rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <Bot size={20} />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-puro-black rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-sans">Tanya AI</h3>
                    <p className="text-[10px] text-gray-400 font-sans">Assistente Virtual</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 font-sans">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm shadow-sm ${msg.sender === 'user'
                      ? 'bg-puro-pastelPink text-white ml-auto rounded-tr-none'
                      : 'bg-white text-gray-600 mr-auto rounded-tl-none border border-gray-100'
                      }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="bg-white text-gray-400 p-3 rounded-2xl rounded-tl-none w-fit shadow-sm text-xs flex gap-1 items-center border border-gray-100">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-gray-100 font-sans">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={language === 'pt' ? 'Mensagem...' : 'Message...'}
                    className="flex-1 bg-puro-inputBg rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-puro-pastelPink text-gray-600"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="bg-puro-pink text-white p-2 rounded-full hover:bg-puro-pastelPink disabled:opacity-50 transition-colors shadow-md"
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
                <div className="mt-2 text-center">
                  <a href="https://wa.me/258848920837" target="_blank" className="text-[10px] text-gray-400 hover:text-puro-pastelPink flex items-center justify-center gap-1 transition-colors">
                    Falar no WhatsApp <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(255, 91, 160, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          className="bg-puro-pink text-white p-3 md:p-4 rounded-full shadow-[0_4px_14px_rgba(255,91,160,0.5)] flex items-center justify-center relative z-50 hover:bg-puro-pastelPink transition-colors"
        >
          {isOpen ? <X size={24} /> : <span className="font-bold font-brand text-2xl mt-1">T</span>}
        </motion.button>
      </div>
    </>
  );
};

export default TanyaAI;