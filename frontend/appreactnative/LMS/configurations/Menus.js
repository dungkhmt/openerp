export const MenuProgrammingContestTeacher = () => {
  return {
    id: 'MENU_PROGRAMMING_CONTEST_MANAGER',
    path: '',
    isPublic: false,
    icon: 'LocalLibraryIcon',
    text: 'Programming Contest Teacher',
    child: [
      {
        id: 'MENU_PROGRAMMING_CONTEST_MANAGER_LIST_PROBLEM',
        path: '/programming-contest/list-problems',
        isPublic: false,
        icon: null,
        text: 'Problem',
        child: [],
        color: '#E57373',
        description: 'Vấn đề',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_MANAGER_CREATE_PROBLEM',
        path: '/programming-contest/create-problem',
        isPublic: false,
        icon: null,
        text: 'Create Problem',
        child: [],
        color: '#F06292',
        description: 'Tạo vấn đề',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_MANAGER_CREATE_CONTEST',
        path: '/programming-contest/create-contest',
        isPublic: false,
        icon: null,
        text: 'Create Contest',
        child: [],
        color: '#BA68C8',
        description: 'Tạo cuộc thi',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_MANAGER_LIST_CONTEST',
        path: '/programming-contest/list-contest',
        isPublic: false,
        icon: null,
        text: 'List Contest',
        child: [],
        color: '#9575CD',
        description: 'Danh sách cuộc thi',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_MANAGER_IDE',
        path: '/programming-contest/ide',
        isPublic: false,
        icon: null,
        text: 'IDE',
        child: [],
        color: '#7986CB',
        description: 'Môi trường phát triển tích hợp',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_MANAGER',
        path: '/programming-contest/teacher-list-contest-manager',
        isPublic: false,
        icon: null,
        text: 'List Contest Manager',
        child: [],
        color: '#64B5F6',
        description: 'Quản lý danh sách cuộc thi',
      },
    ],
  };
};

export const MenuProgrammingContestStudent = () => {
  return {
    id: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT',
    path: '',
    isPublic: false,
    icon: 'LocalLibraryIcon',
    text: 'Programming Contest Student',
    child: [
      {
        id: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_LIST_NOT_REGISTERED_CONTEST',
        path: '/programming-contest/student-list-contest-not-registered',
        isPublic: false,
        icon: null,
        text: 'List Contest Not Registered',
        child: [],
        color: '#DFFF00',
        description: 'Các cuộc thi chưa đăng ký',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_LIST_REGISTERED_CONTEST',
        path: '/programming-contest/student-list-contest-registered',
        isPublic: false,
        icon: null,
        text: 'List Contest Registered',
        child: [],
        color: '#4FC3F7',
        description: 'Các cuộc thi đã đăng ký',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_IDE',
        path: '/student/ide1',
        isPublic: false,
        icon: null,
        text: 'IDE',
        child: [],
        color: '#4DD0E1',
        description: 'Môi trường phát triển tích hợp',
      },
      {
        id: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_LIST_PUBLIC_PROBLEM',
        path: '/programming-contest/student-public-problem',
        isPublic: false,
        icon: null,
        text: 'Practical Problem',
        child: [],
        color: '#4DB6AC',
        description: 'Vấn đề thực tế',
      },
    ],
  };
};

export const MenuEduLearningManagement = () => {
  return {
    id: 'MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT',
    path: '',
    isPublic: false,
    icon: 'LocalLibraryIcon',
    text: 'Học tập',
    child: [
      {
        id: 'MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT_REGISTER_CLASS',
        path: '/edu/class/register',
        isPublic: false,
        icon: null,
        text: 'Đăng ký lớp',
        child: [],
        color: '#81C784',
        description: 'Sinh viên đăng ký vào lớp học',
      },
      {
        id: 'MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT_VIEW_LIST_CLASS',
        path: '/edu/student/class/list',
        isPublic: false,
        icon: null,
        text: 'Danh sách lớp',
        child: [],
        color: '#AED581',
        description: 'Danh sách lớp học',
      },
      {
        id: 'MENU_EDUCATION_TEACHING_MANAGEMENT_STUDENT_QUIZ_TEST_LIST',
        path: '/edu/class/student/quiztest/list',
        isPublic: false,
        icon: null,
        text: 'Quiz Test',
        child: [],
        color: '#DCE775',
        description: 'Kiểm tra trắc nghiệm',
      },

      {
        id: 'MENU_EDUCATION_ASSIGNMENT_EXECUTION',
        path: '/edu/student/contestprogramming',
        isPublic: true,
        icon: null,
        text: 'Programming Contest',
        child: [],
        color: '#FFF176',
        description: 'Cuộc thi lập trình',
      },
    ],
  };
};

export const MenuEduTeachingManagement = () => {
  return {
    id: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER',
    path: '',
    isPublic: false,
    icon: 'GiTeacher',
    text: 'Giảng dạy',
    child: [
      {
        id: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_VIEW_LIST_COURSE',
        path: '/edu/teacher/course/list',
        isPublic: false,
        icon: null,
        text: 'Môn học',
        child: [],
        color: '#FFD54F',
        description: 'Môn học',
      },
      {
        id: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_VIEW_LIST_CLASS',
        path: '/edu/teacher/class/list',
        isPublic: false,
        icon: null,
        text: 'Lớp',
        child: [],
        color: '#FFB74D',
        description: 'Lớp',
      },
      {
        id: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_CREATE_CLASS',
        path: '/edu/class/add',
        isPublic: false,
        icon: null,
        text: 'Tạo lớp',
        child: [],
        color: '#FF8A65',
        description: 'Tạo lớp',
      },
      {
        id: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_QUIZ_TEST_LIST',
        path: '/edu/class/quiztest/list',
        isPublic: false,
        icon: null,
        text: 'Quiz Test',
        child: [],
        color: '#A1887F',
        description: 'Quiz Test',
      },
      {
        id: '',
        path: '/edu/teach/resource-links/list',
        isPublic: true,
        icon: null,
        text: 'Link hữu ích',
        child: [],
        color: '#E0E0E0',
        description: 'Link hữu ích',
      },
      {
        id: 'MENU_EDUCATION_MANAGEMENT_PROGRAMMING_CONTEST',
        path: '/edu/management/contestprogramming',
        isPublic: true,
        icon: null,
        text: 'Programming Contest',
        child: [],
        color: '#90A4AE',
        description: 'Programming Contest',
      },
    ],
  };
};

export const MenuChat = () => {
  return {
    id: 'MENU_CHAT',
    path: '',
    isPublic: true,
    icon: 'iconChat',
    text: 'Chat',
    child: [
      {
        id: 'MENU_CHAT_MESSENGER',
        path: '',
        isPublic: true,
        icon: null,
        text: 'Chat Messenger',
        child: [],
        color: '#EFBBFF',
        description: 'Chat Messenger',
      },
      {
        id: 'MENU_CHAT_LIVE',
        path: '',
        isPublic: true,
        icon: null,
        text: 'Chat Live',
        child: [],
        color: '#800080',
        description: 'Chat Live',
      },
    ],
  };
};

export const getRouteNameByMenuId = menuId => {
  const RouteMap = [
    {menuId: 'MENU_PROGRAMMING_CONTEST_MANAGER', routeName: null},
    {menuId: 'MENU_PROGRAMMING_CONTEST_MANAGER_LIST_PROBLEM', routeName: 'TeacherProblemListScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_MANAGER_CREATE_PROBLEM', routeName: 'TeacherCreateProblemScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_MANAGER_CREATE_CONTEST', routeName: 'TeacherCreateContestScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_MANAGER_LIST_CONTEST', routeName: 'TeacherContestListScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_MANAGER_IDE', routeName: 'TeacherIDEScreen'},

    {menuId: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT', routeName: null},
    {menuId: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_LIST_NOT_REGISTERED_CONTEST', routeName: 'StudentNotRegisteredProgrammingContestScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_LIST_REGISTERED_CONTEST', routeName: 'StudentRegisteredProgrammingContestScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_IDE', routeName: 'StudentIDEScreen'},
    {menuId: 'MENU_PROGRAMMING_CONTEST_PARTICIPANT_LIST_PUBLIC_PROBLEM', routeName: 'StudentProblemListScreen'},

    {menuId: 'MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT', routeName: null},
    {menuId: 'MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT_REGISTER_CLASS', routeName: 'StudentRegisterClassScreen'},
    {menuId: 'MENU_EDUCATION_LEARNING_MANAGEMENT_STUDENT_VIEW_LIST_CLASS', routeName: 'StudentClassListScreen'},
    {menuId: 'MENU_EDUCATION_TEACHING_MANAGEMENT_STUDENT_QUIZ_TEST_LIST', routeName: 'StudentQuizTestListScreen'},
    {menuId: 'MENU_EDUCATION_ASSIGNMENT_EXECUTION', routeName: 'StudentAssignmentExecutionScreen'},

    {menuId: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER', routeName: null},
    {menuId: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_VIEW_LIST_COURSE', routeName: 'TeacherCourseListScreen'},
    {menuId: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_VIEW_LIST_CLASS', routeName: 'TeacherClassListScreen'},
    {menuId: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_CREATE_CLASS', routeName: 'TeacherCreateClassScreen'},
    {menuId: 'MENU_EDUCATION_TEACHING_MANAGEMENT_TEACHER_QUIZ_TEST_LIST', routeName: 'TeacherQuizTestScreen'},
    {menuId: 'MENU_EDUCATION_MANAGEMENT_PROGRAMMING_CONTEST', routeName: 'TeacherProgrammingContestScreen'},

    {menuId: 'MENU_CHAT', routeName: null},
    {menuId: 'MENU_CHAT_MESSENGER', routeName: 'ChatMessengerScreen'},
    {menuId: 'MENU_CHAT_LIVE', routeName: 'ChatLiveScreen'},
  ];

  return RouteMap.find(x => x.menuId === menuId).routeName;
};
