"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useClickOutside } from "../hooks/useClickOutside";
import NavbarNotificationList from "./NavbarNotificationList";

export default function NavbarNotificationBell() {
  const {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    notifications,
    appUnread,
    unreadChatCount,
    totalUnread,
    loading,
    deletingId,
    chatNotifications,
    handleReadOne,
    handleDeleteOne,
    handleReadAll,
    handleDeleteAll,
    handleChatClick,
  } = useNotifications();

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const hasNotifications = notifications.length > 0;
  const hasChatNotifications = chatNotifications.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {totalUnread > 0 && (
          <>
            <span className="absolute top-1 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
            <span className="absolute top-1 right-1 h-[18px] min-w-[18px] animate-ping rounded-full bg-red-500 opacity-75" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-[32rem] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:w-96">
          {/* Header */}
          <div className="shrink-0 border-b border-gray-200 bg-gray-50/50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {hasNotifications && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleReadAll}
                    title="Mark all as read"
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-blue-600"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    title="Clear all"
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {totalUnread > 0 ? `${totalUnread} unread` : "You're all caught up!"}
            </p>
          </div>

          {/* List */}
          <NavbarNotificationList
            activeTab={activeTab}
            onTabChange={setActiveTab}
            appUnread={appUnread}
            unreadChatCount={unreadChatCount}
            loading={loading}
            notifications={notifications}
            chatNotifications={chatNotifications}
            deletingId={deletingId}
            hasNotifications={hasNotifications}
            hasChatNotifications={hasChatNotifications}
            onReadOne={handleReadOne}
            onDeleteOne={(e, id) => { e.stopPropagation(); handleDeleteOne(id); }}
            onReadAll={handleReadAll}
            onDeleteAll={handleDeleteAll}
            onChatClick={handleChatClick}
          />
        </div>
      )}
    </div>
  );
}
