import React from 'react';
import { Message, Sender, MessageType } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;
  const isSystem = message.sender === Sender.System;
  const isHint = message.type === MessageType.Hint;
  const isReport = message.type === MessageType.Report;
  const isImage = message.type === MessageType.Image;

  // Base classes
  let bubbleClass = "p-3 rounded-lg max-w-[90%] md:max-w-md shadow-sm break-words";
  let containerClass = "flex w-full mb-3";

  if (isUser) {
    bubbleClass += " bg-[#dcf8c6] text-gray-800 rounded-tr-none";
    containerClass += " justify-end";
  } else if (isSystem) {
    bubbleClass += " bg-white text-gray-800 border border-gray-200";
    containerClass += " justify-start";
  } else if (isHint) {
    bubbleClass += " bg-amber-50 text-amber-900 border-l-4 border-amber-500 rounded-tl-none";
    containerClass += " justify-start";
  } else {
    // Standard boss message
    bubbleClass += " bg-white text-gray-800 border border-gray-200 rounded-tl-none";
    containerClass += " justify-start";
  }

  // Handle special HTML content (like reports or work orders)
  const isHtml = typeof message.content === 'string' && (isReport || message.type === MessageType.WorkOrder || (typeof message.content === 'string' && message.content.includes('<')));

  return (
    <div className={containerClass}>
      <div className={bubbleClass}>
        {isImage ? (
          <div className="flex flex-col">
            <img 
              src={message.content as string} 
              alt="Evidencia enviada" 
              className="rounded-lg max-h-64 object-cover border border-gray-300"
            />
            <span className="text-xs text-gray-500 mt-1 self-end flex items-center gap-1">
              📷 Imagen enviada
            </span>
          </div>
        ) : isHtml ? (
           <div 
             className="text-sm md:text-base space-y-2"
             dangerouslySetInnerHTML={{ __html: message.content as string }} 
           />
        ) : (
           <div className="text-sm md:text-base whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
};