// auth API

// 사용자 로그인
const LOGIN = "/api/login";

// 사용자 회원가입
const SIGNUP = "/api/signup";

// 소셜 로그인
const SOCIAL_LOGIN = (social_id) => `/api/social/login/${social_id}`;

// 소셜 회원 가입
const SOCIAL_SIGNUP = "/api/social/signup";

// 소셜 가입 여부 확인
const SOCIAL_CHECK = (social_id) => `/api/social/check/${social_id}`;

// user API

// 사용자 정보 조회
const GET_USER = "/api/user";

// 사용자 정보 수정
const UPDATE_USER = "/api/user";

// 사용자 탈퇴
const DELETE_USER = "/api/user";

// 사용자 diary 리스트 조회
const GET_USER_DIARIES = (query) => `/api/diaries${query ? `?${query}` : ""}`;

// 사용자 todo 리스트 조회
const GET_USER_TODOS = (query) => `/api/user/todo${query ? `?${query}` : ""}`;

// FCM 토큰 업데이트
const UPDATE_FCM_TOKEN = (token) => `/api/user/fcm-token?token=${token}`;

// calendar API

// 달력 생성
const CREATE_CALENDAR = "/api/calendar";

// 달력 삭제
const DELETE_CALENDAR = (calendarId) => `/api/calendar/${calendarId}/del`;

// 달력 리스트 조회 (페이지네이션)
const GET_CALENDAR_LIST = (query) => `/api/calendar${query ? `?${query}` : ""}`;

// 달력 선택 리스트 조회
const GET_CALENDAR_SELECT_LIST = "/api/calendars";

// 달력 상세 정보 조회
const GET_CALENDAR_DETAIL = (calendarId) => `/api/calendar/${calendarId}`;

// 달력 기본 정보 조회
const GET_CALENDAR_BASIC = (calendarId) => `/api/calendar/${calendarId}/basic`;

// 달력 수정
const UPDATE_CALENDAR = (calendarId) => `/api/calendar/${calendarId}`;

// 초대 코드 생성
const CREATE_INVITE_CODE = (calendarId) => `/api/calendar/${calendarId}/invite`;

// 초대 코드 삭제 (삭제 예정)
const DELETE_INVITE_CODE = (calendarId) =>
  `/api/calendar/${calendarId}/invite/del`;

// 초대 코드 조회
const GET_INVITE_CODE = (calendarId) => `/api/calendar/${calendarId}/invite`;

// 달력에 가입
const JOIN_CALENDAR = (query) => `/api/joinCalendar${query ? `?${query}` : ""}`;

// 달력 사용자 정보 수정
const UPDATE_CALENDAR_USER_INFO = (calendarId) =>
  `/api/calendar/${calendarId}/user`;

// 달력 사용자 정보 조회
const GET_CALENDAR_USER_INFO = (calendarId) =>
  `/api/calendar/${calendarId}/user`;

// 달력 권한 조회
const GET_CALENDAR_PERMISSION = (calendarId) =>
  `/api/calendar/${calendarId}/permission`;

// 달력 권한 삭제 (특정 사용자)
const DELETE_CALENDAR_PERMISSION = (calendarId, userId) =>
  `/api/calendar/${calendarId}/permission/${userId}`;

// 달력에서 사용자 제거 (자신)
const LEAVE_CALENDAR = (calendarId) => `/api/calendar/${calendarId}/user`;

// 달력에서 사용자 제거 (소유자가 다른 사용자 제거) 달력 권한 삭제와 중복으로 보임
// const REMOVE_USER_FROM_CALENDAR = (calendarId, userId) =>
//   `/api/calendar/${calendarId}/del/${userId}`;

// 달력 권한 리스트 조회
const GET_CALENDAR_PERMISSION_LIST = (calendarId) =>
  `/api/calendar/${calendarId}/permissions`;

// 캘린더 프로필 조회
const GET_CALENDAR_PROFILE = (calendarId, query) =>
  `/api/calendar/${calendarId}/profile${query ? `?${query}` : ""}`;

// diary API

// 일기 생성
const CREATE_DIARY = (calendarId, query) =>
  `/api/calendar/${calendarId}/diary${query ? `?${query}` : ""}`;

// 일기 리스트 조회 (특정 날짜)
const GET_DIARIES = (calendarId, query) =>
  `/api/calendar/${calendarId}/diary${query ? `?${query}` : ""}`;

// 일기 상세 조회
const GET_DIARY_DETAIL = (calendarId, diaryId) =>
  `/api/calendar/${calendarId}/diary/${diaryId}`;

// 일기 수정
const UPDATE_DIARY = (calendarId, diaryId) =>
  `/api/calendar/${calendarId}/diary/${diaryId}`;

// 일기 삭제
const DELETE_DIARY = (calendarId, diaryId) =>
  `/api/calendar/${calendarId}/diary/${diaryId}/del`;

// todo API

// 할 일 생성
const CREATE_TODO = (calendarId, query) =>
  `/api/calendar/${calendarId}/todo${query ? `?${query}` : ""}`;

// 할 일 리스트 조회 (특정 날짜)
const GET_TODOS = (calendarId, query) =>
  `/api/calendar/${calendarId}/todo${query ? `?${query}` : ""}`;

// 할 일 상세 조회
const GET_TODO_DETAIL = (calendarId, todoId) =>
  `/api/calendar/${calendarId}/todo/${todoId}`;

// 할 일 수정
const UPDATE_TODO = (calendarId, todoId) =>
  `/api/calendar/${calendarId}/todo/${todoId}`;

// 할 일 삭제
const DELETE_TODO = (calendarId, todoId) =>
  `/api/calendar/${calendarId}/todo/${todoId}/del`;

// 할 일 완료 상태 토글
const TOGGLE_TODO_COMPLETE = (calendarId, todoId) =>
  `/api/calendar/${calendarId}/todo/${todoId}/check`;

// comment API

// 댓글 리스트 조회
const GET_COMMENTS = (calendarId, query) =>
  `/api/calendar/${calendarId}/comment${query ? `?${query}` : ""}`;

// 댓글 생성
const CREATE_COMMENT = (calendarId, query) =>
  `/api/calendar/${calendarId}/comment${query ? `?${query}` : ""}`;

// 댓글 수정
const UPDATE_COMMENT = (calendarId, commentId) =>
  `/api/calendar/${calendarId}/comment/${commentId}`;

// 댓글 삭제
const DELETE_COMMENT = (calendarId, commentId) =>
  `/api/calendar/${calendarId}/comment/${commentId}/del`;

// like API

// 좋아요 수 조회
const GET_LIKES = (query) => `/api/like${query ? `?${query}` : ""}`;

// 좋아요 토글(query)
const TOGGLE_LIKE = (query) => `/api/like${query ? `?${query}` : ""}`;

// image upload API

// 이미지 업로드
const UPLOAD_IMAGE = "/api/imageUpload";

export default {
  LOGIN,
  SIGNUP,
  SOCIAL_LOGIN,
  SOCIAL_SIGNUP,
  SOCIAL_CHECK,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_USER_DIARIES,
  GET_USER_TODOS,
  UPDATE_FCM_TOKEN,
  CREATE_CALENDAR,
  DELETE_CALENDAR,
  GET_CALENDAR_LIST,
  GET_CALENDAR_SELECT_LIST,
  GET_CALENDAR_DETAIL,
  GET_CALENDAR_BASIC,
  UPDATE_CALENDAR,
  CREATE_INVITE_CODE,
  DELETE_INVITE_CODE,
  GET_INVITE_CODE,
  JOIN_CALENDAR,
  UPDATE_CALENDAR_USER_INFO,
  GET_CALENDAR_USER_INFO,
  GET_CALENDAR_PERMISSION,
  DELETE_CALENDAR_PERMISSION,
  LEAVE_CALENDAR,
  // REMOVE_USER_FROM_CALENDAR,
  GET_CALENDAR_PERMISSION_LIST,
  CREATE_DIARY,
  GET_DIARIES,
  GET_DIARY_DETAIL,
  UPDATE_DIARY,
  DELETE_DIARY,
  GET_CALENDAR_PROFILE,
  CREATE_TODO,
  GET_TODOS,
  GET_TODO_DETAIL,
  UPDATE_TODO,
  DELETE_TODO,
  TOGGLE_TODO_COMPLETE,
  GET_COMMENTS,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  GET_LIKES,
  TOGGLE_LIKE,
  UPLOAD_IMAGE,
};
