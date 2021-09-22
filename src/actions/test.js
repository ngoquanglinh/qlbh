export const types = {
    CREATE_SUCCESS: "CREATE_SUCCESS",
};

export const create = (params) => ({
    url: "",
    method: "",
    types: {
        success: types.CREATE_SUCCESS,
    },
    params: {
        ...params
    }
});

