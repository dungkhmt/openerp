export const DataAdministration = {
  id: "MENU_DATA_ADMIN",
  path: "",
  isPublic: false,
  icon: "LocalLibraryIcon",
  text: "Quản trị dữ liệu",
  child: [
    {
      id: "MENU_DATA_ADMIN_NOTIFICATIONS",
      path: "/admin/data/notifications/list",
      isPublic: false,
      icon: null,
      text: "Notifications",
      child: [],
    },
    {
      id: "MENU_DATA_ADMIN_DASHBOARD",
      path: "/admin/data/dashboard/main",
      isPublic: false,
      icon: null,
      text: "Main Dashboard",
      child: [],
    },

    {
      id: "MENU_DATA_ADMIN_VIEW_COURSE_VIDEO",
      path: "/admin/data/view-course-video/list",
      isPublic: false,
      icon: null,
      text: "View course video",
      child: [],
    },
    {
      id: "MENU_DATA_ADMIN_VIEW_LOG_USER_DO_PRATICE_QUIZ",
      path: "/admin/data/view-log-user-do-pratice-quiz/list",
      isPublic: false,
      icon: null,
      text: "View Users doing quiz",
      child: [],
    },
  ],
};
