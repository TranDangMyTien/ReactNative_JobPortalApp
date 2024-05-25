import { createContext } from "react";

export const MyUserContext = createContext();
export const MyDispatchContext = createContext();


// Context là một cách để truyền dữ liệu xuống từ component cha đến các component con mà không cần thông qua việc truyền dữ liệu qua các props từng cấp.

//MyUserContext là một context được tạo ra để lưu trữ thông tin về người dùng:
//đăng nhập, quyền truy cập...

//MyDispatchContext  là một context khác được tạo ra để lưu trữ các hàm xử lý sự kiện hoặc hành động (dispatch) liên quan đến người dùng
