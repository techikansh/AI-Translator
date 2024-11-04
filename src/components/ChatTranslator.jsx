import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Send, Volume2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatTranslator = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  // Initialize at the top of your component
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "hi", name: "Hindi" },
  ];

  const handleSend = async () => {
    if (inputText.trim()) {
      try {
        // Create translation prompt
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${inputText}. 
        Only return the translated text no other text text header or footers like <Here is your translated text>. 
        Only return the translated text or i will get fired"`;

        // Get translation from Gemini
        const result = await model.generateContent(prompt);
        const translatedText = result.response.text();

        const newMessage = {
          id: Date.now(),
          original: inputText,
          translated: translatedText,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages([...messages, newMessage]);
        setInputText("");
      } catch (error) {
        console.error("Translation error:", error);
        // Handle error appropriately
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b bg-white">
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h1 className="text-xl font-bold">Chat Translator</h1>

          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message Areas */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 bg-gray-100">
        <div className="flex-1 max-w-6xl mx-auto w-full flex gap-4">
          {/* Original Messages Panel */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-2 border-b bg-gray-50 font-medium">Original</div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col items-end">
                    <div className="bg-blue-50 rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="mb-1">{message.original}</p>
                      <p className="text-xs text-gray-500">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Translated Messages Panel */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-2 border-b bg-gray-50 font-medium">
              Translated
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col items-start">
                    <div className="bg-green-50 rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="mb-1">{message.translated}</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500">
                          {message.timestamp}
                        </p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none border-t bg-white p-4">
        <div className="max-w-6xl mx-auto flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTranslator;
