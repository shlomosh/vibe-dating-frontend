import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SendIcon, PaperclipIcon, ArrowLeftIcon } from 'lucide-react';
import { useSignal, viewportSafeAreaInsets } from '@telegram-apps/sdk-react';

import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { LastSeenBadge } from '@/components/LastSeenBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateRandomProfileNickNameSimple } from '@/utils/generator';
import { cn } from '@/lib/utils';

import anonUserImage from '@/assets/anon-user-back.png';

interface Message {
    id: number;
    text: string;
    isMe: boolean;
    timestamp: Date;
}

interface ChatHeaderProps {
    username: string;
    lastSeen: number;
    avatarUrl?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ username, lastSeen, avatarUrl }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="flex items-center gap-3 p-3 border-b border-border/50 bg-background">
            <div
                className={cn(
                    "flex flex-col items-center gap-1",
                    "cursor-pointer group"
                )}
                onClick={handleBackClick}
            >
                <div className="rounded-full transition-all duration-200 group-hover:text-primary text-foreground">
                    <ArrowLeftIcon size={24} />
                </div>
                <div className="text-xs transition-all duration-200 group-hover:text-primary text-foreground">
                    Back
                </div>
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-10 h-12 rounded-lg overflow-hidden bg-muted">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={anonUserImage}
                            alt={username}
                            className="w-full h-full object-cover opacity-60"
                        />
                    )}
                </div>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <div className="font-semibold text-foreground truncate">
                        {username}
                    </div>
                    <LastSeenBadge lastSeen={lastSeen} hideIfNotOnline={true} />
                </div>
            </div>
        </div>
    );
};

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${message.isMe
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
            >
                <div className="text-sm">{message.text}</div>
                <div className={`text-xs mt-1 ${message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                    {formatTime(message.timestamp)}
                </div>
            </div>
        </div>
    );
};

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onAttachment: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onAttachment }) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const safeInsets = useSignal(viewportSafeAreaInsets) ?? { top: 0, bottom: 0, left: 0, right: 0 };

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 flex px-2 gap-2 border-t bg-background z-50 justify-start"
            style={{
                paddingTop: "0.75rem",
                paddingBottom: `max(0.75rem,${safeInsets.bottom}px)`,
            }}>
            <Button
                variant="ghost"
                size="icon"
                onClick={onAttachment}
                className="flex-shrink-0"
            >
                <PaperclipIcon className="w-5 h-5" />
            </Button>
            <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={handleSend}
                disabled={!message.trim()}
                className="flex-shrink-0"
            >
                <SendIcon className="w-5 h-5" />
            </Button>
        </div>
    );
};

export const ChatPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Mock user data
    const user = {
        id: userId || '1',
        username: generateRandomProfileNickNameSimple(parseInt(userId || '1')),
        lastSeen: 0,
        avatarUrl: `https://picsum.photos/100/100?random=${userId || '1'}`
    };

    // Mock initial messages
    useEffect(() => {
        const mockMessages: Message[] = [
            {
                id: 1,
                text: "Hey! How are you doing? 😊",
                isMe: false,
                timestamp: new Date(Date.now() - 300000) // 5 minutes ago
            },
            {
                id: 2,
                text: "Hi! I'm doing great, thanks for asking! How about you?",
                isMe: true,
                timestamp: new Date(Date.now() - 240000) // 4 minutes ago
            },
            {
                id: 3,
                text: "Pretty good! Are you free this weekend?",
                isMe: false,
                timestamp: new Date(Date.now() - 180000) // 3 minutes ago
            },
            {
                id: 4,
                text: "Yes, I should be free! What did you have in mind?",
                isMe: true,
                timestamp: new Date(Date.now() - 120000) // 2 minutes ago
            },
            {
                id: 5,
                text: "I was thinking we could grab coffee or something?",
                isMe: false,
                timestamp: new Date(Date.now() - 60000) // 1 minute ago
            }
        ];
        setMessages(mockMessages);
    }, [userId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now(),
            text,
            isMe: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);

        // Simulate reply after 1-3 seconds
        setTimeout(() => {
            const replies = [
                "That sounds great!",
                "Thanks for the message!",
                "I'll get back to you soon!",
                "Interesting! Tell me more.",
                "👍",
                "Sure thing!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMessage: Message = {
                id: Date.now() + 1,
                text: randomReply,
                isMe: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1000 + Math.random() * 2000);
    };

    const handleAttachment = () => {
        // TODO: Implement attachment functionality
        console.log('Attachment button clicked');
    };

    return (
        <Page back={true}>
            <Content className="flex flex-col h-full p-0">
                {/* Chat Header */}
                <ChatHeader
                    username={user.username}
                    lastSeen={user.lastSeen}
                    avatarUrl={user.avatarUrl}
                />

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-lg mx-auto px-4 py-4">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <ChatInput
                    onSendMessage={handleSendMessage}
                    onAttachment={handleAttachment}
                />
            </Content>
        </Page>
    );
}; 