import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Image, FileText, Shield } from 'lucide-react';
import { Avatar, EmptyChat, Toast, ProposalCard, ContractPreviewModal } from '../components';
import { mockChats, getJobById, getHotelById, getCreatorById, mockApplications } from '../data/mock';
import { cn, formatRelativeTime, containsContactInfo, getContactBlockMessage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export function ChatScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's chats
  const userChats = mockChats.filter(
    chat => chat.creatorId === user?.id || chat.hotelId === user?.id
  );

  const selectedChat = selectedChatId
    ? userChats.find(c => c.id === selectedChatId)
    : null;

  const otherUser = selectedChat
    ? user?.role === 'creator'
      ? getHotelById(selectedChat.hotelId)
      : getCreatorById(selectedChat.creatorId)
    : null;

  const relatedJob = selectedChat
    ? getJobById(selectedChat.jobId)
    : null;

  const relatedApplication = selectedChat && relatedJob
    ? mockApplications.find(app => (app.jobId === relatedJob.id && app.creatorId === selectedChat.creatorId))
    : null;

  // Proposal Actions
  const handleAcceptProposal = () => {
    setShowContractModal(true);
  };

  const handleSignContract = () => {
    setShowContractModal(false);
    setToastMessage('Contrato gerado e assinado com sucesso!');
    setShowToast(true);
  };

  const handleRejectProposal = () => {
    setToastMessage('Proposta recusada.');
    setShowToast(true);
  };

  const handleNegotiate = () => {
    document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (containsContactInfo(messageInput)) {
      setToastMessage(getContactBlockMessage());
      setShowToast(true);
      return;
    }

    setMessageInput('');
    setToastMessage('Mensagem enviada!');
    setShowToast(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showChatList = !selectedChatId || window.innerWidth >= 1024;
  const showChatDetail = selectedChatId;

  return (
    <div className="min-h-screen bg-linen">
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {relatedApplication && relatedJob && (
        <ContractPreviewModal
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
          application={relatedApplication}
          job={relatedJob}
          onSign={handleSignContract}
        />
      )}

      <div className="flex h-[calc(100vh-80px)] lg:h-screen">
        {/* Chat List - Editorial Sidebar */}
        {(showChatList || window.innerWidth >= 1024) && (
          <div className={cn(
            'w-full lg:w-96 bg-white/60 backdrop-blur-md border-r border-stone/10 flex flex-col',
            selectedChatId && 'hidden lg:flex'
          )}>
            {/* Header */}
            <div className="p-5 border-b border-stone/10 bg-white/40">
              <h1 className="text-2xl font-serif text-ink mb-1">Conversas</h1>
              <p className="text-xs text-stone/50 uppercase tracking-widest font-medium">
                {userChats.length} {userChats.length === 1 ? 'conversa ativa' : 'conversas ativas'}
              </p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {userChats.length === 0 ? (
                <div className="p-8">
                  <EmptyChat onAction={() => navigate('/feed')} />
                </div>
              ) : (
                <div className="divide-y divide-stone/5">
                  {userChats.map((chat) => {
                    const other = user?.role === 'creator'
                      ? getHotelById(chat.hotelId)
                      : getCreatorById(chat.creatorId);
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    const job = getJobById(chat.jobId);
                    const isActive = selectedChatId === chat.id;

                    return (
                      <motion.button
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={cn(
                          'w-full p-5 flex items-start gap-4 hover:bg-white/60 transition-colors text-left group relative',
                          isActive && 'bg-white/80'
                        )}
                        whileTap={{ scale: 0.99 }}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-forest" />}
                        <Avatar
                          src={other?.avatar}
                          name={other?.name || 'User'}
                          size="md"
                          showStatus
                          status="online"
                        />
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={cn("font-medium text-ink truncate", isActive ? "font-semibold" : "")}>
                              {other?.name}
                            </h3>
                            <span className="text-[10px] text-stone/40 uppercase tracking-wide">
                              {formatRelativeTime(lastMessage?.createdAt || chat.updatedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-forest/70 font-medium truncate mb-1">
                            {job?.title}
                          </p>
                          <p className={cn(
                            'text-sm truncate leading-relaxed',
                            !lastMessage?.isRead && lastMessage?.senderId !== user?.id
                              ? 'text-ink font-medium'
                              : 'text-stone/60 font-light'
                          )}>
                            {lastMessage?.content}
                          </p>
                        </div>
                        {!lastMessage?.isRead && lastMessage?.senderId !== user?.id && (
                          <span className="w-2 h-2 bg-terracotta rounded-full flex-shrink-0 mt-2" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Detail - Editorial Window */}
        {(showChatDetail || window.innerWidth >= 1024) && (
          <div className={cn(
            'flex-1 flex flex-col bg-linen',
            !selectedChatId && 'hidden lg:flex items-center justify-center'
          )}>
            {selectedChat && otherUser && relatedJob ? (
              <>
                {/* Chat Header */}
                <div className="bg-white/60 backdrop-blur-md px-6 py-4 border-b border-stone/10 flex items-center gap-4 shadow-sm z-10">
                  <button
                    onClick={() => setSelectedChatId(null)}
                    className="lg:hidden p-2 -ml-2 text-stone/50 hover:text-ink hover:bg-stone/5 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
                  </button>

                  <Avatar
                    src={otherUser.avatar}
                    name={otherUser.name}
                    size="md"
                    showStatus
                    status="online"
                  />

                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-ink leading-tight">{otherUser.name}</h3>
                    <p className="text-xs text-stone/50 uppercase tracking-wider">{relatedJob.title}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/job/${relatedJob.id}`)}
                    className="px-4 py-2 bg-white border border-stone/10 text-stone/70 rounded-full text-xs font-medium hover:border-forest/20 hover:text-forest transition-colors shadow-sm"
                  >
                    Ver Vaga
                  </button>
                </div>

                {/* Job Context Banner */}
                <div className="bg-white/30 px-6 py-3 border-b border-stone/5">
                  <div className="flex items-center gap-2 text-xs font-medium text-stone/40 uppercase tracking-widest mb-1">
                    <FileText className="w-3 h-3" />
                    <span>Briefing</span>
                  </div>
                  <p className="text-sm text-ink/80 font-light italic leading-relaxed line-clamp-2">
                    "{relatedJob.description}"
                  </p>
                </div>

                {/* Proposal Card */}
                {relatedApplication && relatedApplication.proposedAmount && (
                  <div className="px-6 pt-6">
                    <ProposalCard
                      application={relatedApplication}
                      userRole={user?.role || 'creator'}
                      onAccept={handleAcceptProposal}
                      onReject={handleRejectProposal}
                      onNegotiate={handleNegotiate}
                    />
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-xl max-w-2xl mx-auto">
                    <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800/80 leading-relaxed">
                      Para sua segurança, a Loomi protege seus pagamentos. Não compartilhe telefone, email ou links externos antes de aceitar a proposta oficial na plataforma.
                    </p>
                  </div>

                  {selectedChat.messages.map((message, index) => {
                    const isMine = message.senderId === user?.id;
                    const showAvatar = index === 0 ||
                      selectedChat.messages[index - 1].senderId !== message.senderId;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'flex gap-3',
                          isMine ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        {!isMine && showAvatar && (
                          <Avatar
                            src={otherUser.avatar}
                            name={otherUser.name}
                            size="sm"
                          />
                        )}
                        {!isMine && !showAvatar && <div className="w-8" />}

                        <div className={cn(
                          'max-w-[70%] px-5 py-3.5 shadow-sm',
                          isMine
                            ? 'bg-forest text-white rounded-2xl rounded-tr-sm'
                            : 'bg-white text-ink rounded-2xl rounded-tl-sm border border-stone/5'
                        )}>
                          <p className="text-sm font-light leading-relaxed">{message.content}</p>
                          <span className={cn(
                            'text-[10px] mt-1.5 block text-right',
                            isMine ? 'text-white/60' : 'text-stone/40'
                          )}>
                            {formatRelativeTime(message.createdAt)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white/80 backdrop-blur-md p-4 border-t border-stone/10">
                  <div className="flex items-end gap-2 max-w-4xl mx-auto">
                    <button className="p-3 text-stone/40 hover:text-forest hover:bg-stone/5 rounded-full transition-colors">
                      <Paperclip className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button className="p-3 text-stone/40 hover:text-forest hover:bg-stone/5 rounded-full transition-colors">
                      <Image className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className="w-full px-5 py-3 bg-stone/5 hover:bg-stone/10 border-transparent focus:border-forest/20 focus:bg-white rounded-2xl text-ink placeholder:text-stone/40 focus:outline-none focus:ring-0 transition-all font-light"
                      />
                    </div>
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={cn(
                        'p-3 rounded-full transition-all shadow-md',
                        messageInput.trim()
                          ? 'bg-forest text-white hover:bg-forest/90'
                          : 'bg-stone/10 text-stone/30'
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-white rounded-full border border-stone/10 flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Send className="w-10 h-10 text-stone/20" strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-serif text-ink mb-2">
                  Suas Conversas
                </h3>
                <p className="text-stone/50 font-light max-w-xs mx-auto">
                  Selecione uma conversa ao lado para negociar detalhes e fechar contratos.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
