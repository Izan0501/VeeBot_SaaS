import React from 'react';

import ClearModal      from '../components/dashboard/ClearModal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsGrid       from '../components/dashboard/StatsGrid';
import CandidatesTable from '../components/dashboard/CandidatesTable';
import AIChat          from '../components/dashboard/AIChat';

import {
    useDashboard,
    containerVariants,
    itemVariants,
} from '../hooks/useDashboard';

const Dashboard = ({ isModalOpen, setIsModalOpen }) => {
    const {
        // State
        candidates, selectedLetter, searchTerm, isFilterMenuOpen,
        showClearModal, clearing, messages, usageCount,
        chatQuery, isThinking,
        // Derived
        filteredCandidates, avgScore, lowMatchCount,
        isPremium, navigate,
        // Refs
        messagesEndRef, filterMenuRef, mainScrollRef, tableRef,
        // Dispatch helpers
        setSearchTerm, setIsFilterMenuOpen, setSelectedLetter,
        setMessages, setChatQuery, openClearModal, closeClearModal,
        // Handlers
        handleAskAI, handleDelete, handleClearAll, handleSendEmail,
    } = useDashboard(isModalOpen);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
            <ClearModal
                isOpen={showClearModal}
                onClose={closeClearModal}
                onConfirm={handleClearAll}
                isClearing={clearing}
                count={candidates.length}
            />

            <DashboardHeader
                candidatesCount={candidates.length}
                onOpenClearModal={openClearModal}
                isPremium={isPremium}
                onNavigate={navigate}
            />

            <div ref={mainScrollRef} className="flex-1 overflow-auto p-4 md:p-8 space-y-8 custom-scrollbar">
                <StatsGrid
                    variants={{ container: containerVariants, item: itemVariants }}
                    candidates={candidates}
                    avgScore={avgScore}
                    lowMatchCount={lowMatchCount}
                />

                <CandidatesTable
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterMenuRef={filterMenuRef}
                    isFilterMenuOpen={isFilterMenuOpen}
                    setIsFilterMenuOpen={setIsFilterMenuOpen}
                    selectedLetter={selectedLetter}
                    setSelectedLetter={setSelectedLetter}
                    filteredCandidates={filteredCandidates}
                    alphabet={"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")}
                    handleSendEmail={handleSendEmail}
                    handleDelete={handleDelete}
                    ref={tableRef}
                />
            </div>

            <AIChat
                isPremium={isPremium}
                messages={messages}
                setMessages={setMessages}
                usageCount={usageCount}
                isThinking={isThinking}
                chatQuery={chatQuery}
                setChatQuery={setChatQuery}
                handleAskAI={handleAskAI}
                messagesEndRef={messagesEndRef}
                onNavigate={navigate}
            />
        </div>
    );
};

export default Dashboard;