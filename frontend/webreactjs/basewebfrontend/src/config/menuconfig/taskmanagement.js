export const taskmanagement = {
  id: "MENU_BACKLOG",
  path: "",
  isPublic: false,
  icon: "AssignmentOutlinedIcon",
  text: "Theo dõi dự án",
  child: [
    {
      id: "MENU_BACKLOG_VIEW_LIST_PROJECT",
      path: "/taskmanagement/project/list",
      isPublic: false,
      icon: "StarBorder",
      text: "DS dự án",
      child: [],
    },
    {
      id: "MENU_BACKLOG_CREATE_PROJECT",
      path: "/taskmanagement/project/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới dự án",
      child: [],
    },
  ],
};
