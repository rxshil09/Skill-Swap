// Standardized response helper functions

const sendSuccessResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

const sendErrorResponse = (res, message = 'Internal Server Error', statusCode = 500, stack = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && stack) {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};

const sendPaginatedResponse = (res, data, pagination, message = 'Success') => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(response);
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse
};