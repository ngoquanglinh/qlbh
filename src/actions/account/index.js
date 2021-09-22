export const types = {
    ACB: 'ACB',
}

export const GET = () => {
    return {
        url: '/api/account',
        method: 'get',
        types: {
            success: types.ABC
        }
    };
};
