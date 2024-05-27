const MyUserReducer = (current, action) => {
    switch (action.type) {
        case 'login':
            return action.payload; //Truy cập đến dữ liệu được gửi kèm theo hành động
        case 'logout':
            return null;
    }
    return current;
}

export default MyUserReducer;