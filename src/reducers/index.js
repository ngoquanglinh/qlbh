import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import account from './account';

const config = {
    key: 'Lucifer',
    blacklist: [],
    storage
};

const rootReducer = combineReducers({
    account
});


export default persistReducer(config, rootReducer)
