import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage, Monument } from '../types';

interface ChatInterfaceProps {
  monument: Monument;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ monument }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Welcome to ${monument.name}. ${monument.shortDescription} What would you like to know?`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (audioBlob?: Blob) => {
    if (!inputText.trim() && !selectedImage && !audioBlob) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
      audio: !!audioBlob,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text || (m.audio ? '[Audio Input]' : '[Image Input]') }]
      }));

      const responseText = await geminiService.sendMessage(
        history,
        newUserMsg.text || null,
        selectedImage || null,
        audioBlob || null,
        monument
      );

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        handleSendMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // cleanup
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-museum-900/90 text-white rounded-lg overflow-hidden border border-white/10 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/40">
        <h3 className="font-serif text-xl text-gold-400">Guide Chat</h3>
        <p className="text-xs text-gray-400">Ask about history, art, or architecture</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gold-500 text-black rounded-tr-none'
                  : 'bg-white/10 text-gray-100 rounded-tl-none'
              }`}
            >
              {msg.image && (
                <img src={msg.image} alt="Upload" className="w-full h-32 object-cover rounded-md mb-2" />
              )}
              {msg.audio && (
                <div className="flex items-center gap-2 mb-2 text-xs italic opacity-70">
                  <Mic size={12} /> Audio Sent
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4 text-gold-400" />
              <span className="text-xs text-gray-400">Consulting archives...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/40">
        {selectedImage && (
          <div className="flex items-center gap-2 mb-2 bg-white/10 p-2 rounded max-w-max">
            <span className="text-xs truncate max-w-[150px]">{selectedImage.name}</span>
            <button onClick={() => setSelectedImage(null)} className="text-red-400 hover:text-red-300">
              <X size={14} />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-gold-400 transition"
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <div className="flex-1 bg-white/5 rounded-2xl flex items-center border border-white/10 focus-within:border-gold-400/50 transition">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-transparent border-none focus:ring-0 p-3 text-sm resize-none h-[46px] max-h-[100px] scrollbar-hide text-white placeholder-gray-500"
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>

          {inputText || selectedImage ? (
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              className="p-3 bg-gold-500 hover:bg-gold-400 text-black rounded-full font-bold shadow-lg transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-3 rounded-full transition shadow-lg ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 hover:bg-white/10 text-gold-400'
              }`}
              title="Hold to Speak"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
        <p className="text-[10px] text-center text-gray-500 mt-2">
          {isRecording ? "Listening..." : "Hold mic to speak or type."}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
