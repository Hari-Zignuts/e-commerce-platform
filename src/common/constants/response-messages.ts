export const ResponseMessages = {
  GENERAL: {
    DATABASE_ERROR: 'Database Error',
    INVALID_DATA: 'Invalid data provided.',
  },
  USER: {
    INVALID_ID: `Invalid user ID provided.`,
    CREATE_FAILED: 'Failed to create the user.',
    DUPLICATE: 'Username or email already exists.',
    NOT_FOUND: 'The requested user was not found.',
    CREATED: 'The user account has been created successfully.',
    DELETE_FAILED: 'Failed to delete the user.',
    NO_UPDATE: 'No changes were made to the user.',
    FETCHED: 'User data has been retrieved successfully.',
    UPDATE_FAILED: 'Failed to update the user.',
    UPDATE_SUCCESS: 'User updated successfully.',
    DELETE_SUCCESS: 'The user has been deleted successfully.',
  },
  AUTH: {
    SIGNUP_SUCCESS: 'User account created successfully.',
    LOGIN_SUCCESS: 'User logged in successfully.',
    INVALID_CREDENTIALS: 'Invalid username or password.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
  },
  ROLE: {
    ALREADY_EXISTS: 'Role already exists.',
    CREATED: 'Role created successfully.',
    CREATE_FAILED: 'Failed to create the role.',
    NOT_FOUND: 'The requested role was not found.',
    FETCHED: 'Role data has been retrieved successfully.',
    INVALID_ID: 'Invalid role ID provided.',
    DELETED_SUCCESS: 'Role deleted successfully.',
    UPDATE_SUCCESS: 'Role updated successfully.',
  },
  ADDRESS: {
    DATABASE_ERROR: 'Error occurred while saving the address in the database.',
    CREATE_FAILED: 'Failed to create the address.',
    CREATE_SUCCESS: 'The address has been created successfully.',
    FETCH_ALL_SUCCESS: 'All addresses have been retrieved successfully.',
    NOT_FOUND: 'The requested address was not found.',
    FETCHED: 'Address data has been retrieved successfully.',
    DELETE_FAILED: 'Failed to delete the address.',
    DELETE_SUCCESS: 'The address has been deleted successfully.',
    INVALID_ID: 'Invalid address ID provided.',
    NO_UPDATE: 'No changes were made to the address.',
    UPDATE_FAILED: 'Failed to update the address.',
    UPDATE_SUCCESS: 'The address has been updated successfully.',
  },
  CATEGORY: {
    CREATE_FAILED: 'Failed to create the category.',
    NOT_FOUND: 'The requested category was not found.',
    CREATED: 'The category has been created successfully.',
    FETCHED: 'Category data has been retrieved successfully.',
    DELETE_FAILED: 'Failed to delete the category.',
    DELETE_SUCCESS: 'The category has been deleted successfully.',
    INVALID_ID: 'Invalid category ID provided.',
    NO_UPDATE: 'No changes were made to the category.',
    UPDATE_FAILED: 'Failed to update the category.',
    FETCHED_ALL: 'All categories have been retrieved successfully.',
    UPDATE_SUCCESS: 'The category has been updated successfully.',
  },
  CLOUD: {
    UPLOAD_FAILED: 'Failed to upload the image.',
    UPLOAD_SUCCESS: 'The image has been uploaded successfully.',
  },
  PRODUCT: {
    INVALID_ID: 'Invalid product ID provided.',
    CREATE_FAILED: 'Failed to create the product.',
    NOT_FOUND: 'The requested product was not found.',
    CREATED: 'The product has been created successfully.',
    FETCHED: 'Product data has been retrieved successfully.',
    DELETE_FAILED: 'Failed to delete the product.',
    DELETE_SUCCESS: 'The product has been deleted successfully.',
    NO_UPDATE: 'No changes were made to the product.',
    UPDATED: 'The product has been updated successfully.',
  },
  STOCK: {
    INVALID_ID: 'Invalid stock ID provided.',
    NOT_FOUND: 'The requested stock was not found.',
    NOT_ENOUGH: 'Not enough stock available.',
    UPDATE_FAILED: 'Failed to update the stock.',
  },
  ORDER: {
    INVALID_ID: 'Invalid order ID provided.',
    CREATE_FAILED: 'Failed to create the order.',
    NOT_FOUND: 'The requested order was not found.',
    CREATED: 'The order has been created successfully.',
    FETCHED: 'Order data has been retrieved successfully.',
    COMPLETED: 'The order has been completed successfully.',
    CANCELLED: 'The order has been cancelled successfully.',
    DELETED: 'The order has been deleted successfully.',
    NOT_PENDING: 'The order is not pending.',
  },
};
