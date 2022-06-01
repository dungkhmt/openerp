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
      text: "Danh sách dự án",
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
    },
    {
      id: "MENU_BACKLOG_MEMBER_ASSIGNED_TO_TASKs",
      path: "/taskmanagement/tasks/members/assigned",
      isPublic: true,
      icon: "StarBorder",
      text: "Danh sách nhiệm vụ được giao",
      child: [],
    }
  ],
};
