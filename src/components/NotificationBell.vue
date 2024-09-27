<template>
    <div class="relative">
      <!-- Notification Bell Icon -->
      <button @click="toggleDropdown" class="relative text-gray-200 hover:text-white focus:outline-none">
        <span class="sr-only">Notifications</span>
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11c0-2.21-1.79-4-4-4S10 8.79 10 11v3c0 .828-.336 1.582-.895 2.105L8 17h5m1 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <!-- Unread Notification Badge -->
        <span v-if="unreadCount > 0"
          class="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1 -translate-y-1 bg-red-500 rounded-full animate-pulse"></span>
      </button>
  
      <!-- Notifications Dropdown -->
      <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg overflow-hidden z-10">
        <div v-if="notifications.length === 0" class="p-4 text-gray-500 text-center">No notifications</div>
        <div v-else class="max-h-64 overflow-y-auto divide-y divide-gray-100">
          <div v-for="notification in notifications" :key="notification.id" class="p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer" @click="markAsRead(notification.id)">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-800">{{ parseNotificationData(notification.data).message }}</p>
              <small class="text-xs text-gray-400">{{ formatDate(notification.created_at) }}</small>
            </div>
            <span v-if="notification.read === 0" class="block mt-1 text-xs text-blue-500 font-semibold">Unread</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '@/plugins/axios';
  
  export default {
    data() {
      return {
        notifications: [],
        unreadCount: 0,
        isDropdownOpen: false,
      };
    },
    methods: {
      async fetchNotifications() {
        try {
          const response = await axios.get("/notifications");
          this.notifications = response.data.notifications.reverse(); // Reverse notifications to show latest first
          this.unreadCount = this.notifications.filter(n => n.read === 0).length;
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      },
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      parseNotificationData(data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          return {};
        }
      },
      formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      async markAsRead(notificationId) {
        try {
          const response = await axios.put(`/notifications/${notificationId}/read`);
          if (response.status === 200) {
            // Update the notification as read
            const notificationIndex = this.notifications.findIndex(n => n.id === notificationId);
            if (notificationIndex !== -1) {
              this.notifications[notificationIndex].read = 1;
            }
            // Update unread count
            this.unreadCount = this.notifications.filter(n => n.read === 0).length;
          }
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      },
    },
    mounted() {
      this.fetchNotifications();
    },
  };
  </script>
  
  <style scoped>
  /* General styling for the notification dropdown */
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .z-10 {
    z-index: 10;
  }
  .shadow-lg {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  .bg-white {
    background-color: white;
  }
  .hover\:bg-gray-100:hover {
    background-color: #f7fafc;
  }
  .border {
    border: 1px solid #e2e8f0;
  }
  .rounded-lg {
    border-radius: 0.75rem;
  }
  .text-gray-500 {
    color: #a0aec0;
  }
  .text-gray-400 {
    color: #cbd5e0;
  }
  .text-blue-500 {
    color: #4299e1;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-semibold {
    font-weight: 600;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .transition-colors {
    transition: background-color 0.2s ease-in-out;
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .divide-y > :not(:first-child) {
    border-top-width: 1px;
  }
  .max-h-64 {
    max-height: 16rem;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  </style>
  