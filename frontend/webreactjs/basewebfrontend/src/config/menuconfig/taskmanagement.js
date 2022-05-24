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
    {
      id: "MENU_BACKLOG_CREATE_TASK_PROJECT",
      path: "/taskmanagement/project/tasks/create",
      isPublic: true,
      icon: "StarBorder",
      text: "Tạo mới nhiệm vụ",
      child: [],
    },
    {
      id: "MENU_BACKLOG_ADD_MEMBER_TO_PROJECT",
      path: "/taskmanagement/project/members/add",
      isPublic: true,
      icon: "StarBorder",
      text: "Thêm thành viên dự án",
      child: [],
    }
  ],
};
