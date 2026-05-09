import { Bell, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { productionApi } from "../api/productionApi";
import type { Alert } from "../api/types";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { currentUser, logout } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await productionApi.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts", err);
    }
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleMarkRead = async (id: number) => {
    try {
      await productionApi.markAlertRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
      );
    } catch (err) {
      console.error("Failed to mark alert as read", err);
    }
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      await productionApi.deleteAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete alert", err);
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      case "error":
        return "border-l-red-500 bg-red-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const initials =
    currentUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header className="bg-white border-b border-highlight px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden p-2 hover:bg-secondary rounded-lg"
          onClick={onMobileMenuToggle}>
          <Menu size={24} />
        </button>
        <img src="/logo.svg" alt="Crust & Cloud" className="h-10 md:hidden" />
        <div className="hidden md:block">
          <h1 className="font-heading text-xl font-semibold text-primary">
            Crust & Cloud
          </h1>
          <p className="text-xs text-muted">Soft Breads · Made with Care</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Alerts */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 hover:bg-secondary rounded-full transition-colors">
            <Bell size={20} className="text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-highlight overflow-hidden z-50">
              <div className="p-3 border-b border-highlight bg-secondary/30">
                <h3 className="font-semibold text-primary">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="p-4 text-center text-muted text-sm">
                    No notifications
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 border-l-4 ${getAlertColor(alert.type)} ${!alert.isRead ? "bg-opacity-100" : "bg-opacity-50"}`}>
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-primary">{alert.message}</p>
                        <button
                          type="button"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-muted hover:text-primary ml-2">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted">{alert.time}</span>
                        {!alert.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(alert.id)}
                            className="text-xs text-accent hover:underline">
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <span className="hidden md:block text-sm font-medium text-primary">
            {currentUser?.name}
          </span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-1.5">
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
