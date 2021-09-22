import { types } from './../../actions/account';

const initState = {

};

export default (state = initState, action) => {

    switch (action.type) {
        case types.ABC:
            return {
                ...state,
            }
        default:
            return state;
    }
}


