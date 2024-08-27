export enum ErrorMessage {
  LOGIN_FAILED = 'Login failed',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  EMAIL_IS_REQUIRED = 'Email is required',
  EMAIL_INVALID = 'Email invalid',
  USERNAME_IS_REQUIRED = 'Username is required',
  PASSWORD_IS_REQUIRED = 'Password is required',
  USER_NOT_FOUND = 'User not found',
  USERNAME_PASSWORD_INCORRECT = 'username or password incorrect',
  CATEGORY_NOT_FOUND = 'Category not found',
  ACTIVITY_NOT_FOUND = 'Activity not found',
  BAD_REQUEST = 'Bad request',
  GOAL_NOT_FOUND = 'Goals not found',
  VALIDATION_FAILED = 'Validation failed',
  IS_REQUIRED = 'is required',
  DATA_NOT_FOUND = 'Data not found',
  MUST_GREATER_THAN = 'must greater than',
  INVALID_DATE = 'Invalid date',
  START_DATE_INVALID = 'Start date must be greater than or equal to present date',
}

export enum SuccessMessage {
  GET_DATA_SUCCESS = 'Get data success',
  CREATE_DATA_SUCCESS = 'Create data success',
  LOGIN_SUCCESS = 'Login successfully',
  UPDATE_DATA_SUCCESS = 'Update data success',
  DELETE_DATA_SUCCESS = 'Delete data success',
}
