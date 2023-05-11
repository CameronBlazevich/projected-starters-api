
const createErrorResponse = (error) => {
    const response = { success: false, error };
    return response;
}

const createSuccessResponse = (data) => {
    const response = { success: true, data }
    return response;
}


module.exports = { createErrorResponse, createSuccessResponse }