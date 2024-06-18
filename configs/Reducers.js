const MyUserReducer = (current, action) => {
    switch (action.type) {
        case 'login':
            return action.payload; 
        case 'update_applicant':
            return {
                ...current,
                applicant: action.payload,
            };
        case 'update_employer':
            return {
                ...current,
                employer: action.payload,
            };
        case 'logout':
            return null;
    }
    return current;
}

export default MyUserReducer;