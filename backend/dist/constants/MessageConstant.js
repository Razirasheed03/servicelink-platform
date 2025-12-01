"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
exports.HttpResponse = {
    // Common
    SERVER_ERROR: "Internal server error",
    PAGE_NOT_FOUND: "Route not found",
    UNAUTHORIZED: "Unauthorized access!",
    FORBIDDEN: "Forbidden",
    VALIDATION_FAILED: "Validation failed",
    CONFLICT: "Conflict",
    NO_CONTENT: "No content",
    TOO_MANY_REQUESTS: "Too many requests, please try again later.",
    // Auth
    USER_EXIST: "User already exist",
    USER_NOT_FOUND: "User not found",
    EMAIL_EXIST: "Email already exist",
    INVALID_EMAIL: "Invalid email address",
    INVALID_CREDENTIALS: "Invalid credentials",
    PASSWORD_INCORRECT: "Incorrect password, try again",
    TOKEN_EXPIRED: "Token not valid or expired!",
    NO_TOKEN: "Token not provided",
    NO_PAYLOAD: "Payload not found",
    USER_CREATION_FAILED: "User creation failed",
    USER_CREATION_SUCCESS: "User created successfully",
    GOOGLE_LOGIN_SUCCESS: "Logged in with Google successfully",
    RESET_PASS_LINK: "Link for resetting password is sent to email",
    PASSWORD_CHANGE_SUCCESS: "Password changed successfully!",
    LOGOUT_SUCCESS: "User Logout successfully",
    // OTP
    OTP_INCORRECT: "Incorrect otp, try again",
    OTP_NOT_FOUND: "Otp not found",
    // Profile / User
    USERNAME_EXIST: "Username already exist",
    USERNAME_CHANGED: "Username has been changed successfully",
    SAME_USERNAME: "Cannot change to old username",
    PROFILE_PICTURE_CHANGED: "Profile picture changed successfully",
    // Resource
    RESOURCE_FOUND: "Resource found",
    RESOURCE_UPDATED: "Resource updated",
    INVALID_ID: "Invalid ID format",
    UNEXPECTED_KEY_FOUND: "Unexpected key found",
    // Blog
    BLOG_NOT_FOUND: "Blog not found",
    BLOG_IMAGE_NOT_FOUND: "Blog thumbnail not found",
    BLOG_ID_NOT_FOUND: "Blog id not found",
    INVALID_BOLG_ID: "Invalid blog ID format", // typo preserved from your code
    REQUIRED_AUTHOR_ID: "Author ID is required",
    REQUIRED_AUTHOR_NAME: "Author name is required",
    REQUIRED_TITLE: "Blog title is required",
    REQUIRED_CONTENT: "Blog content is required",
    REQUIRED_BLOG_ID: "Blog ID is required",
    // Comments
    REQUIRED_COMMENT: "Comment can't be empty",
    INVALID_USER_ID: "Invalid user ID format",
    INVALID_COMMENT_ID: "Invalid comment ID format",
    INVALID_PARENT_COMMENT_ID: "Invalid parent comment ID format",
    COMMENT_NOT_FOUND: "Comment not found",
    FAILED_TO_UPDATE_COMMENT_LIKES: "Failed to update comment likes",
    // Votes
    VOTE_ADDED: "Vote Added Successfully",
    VOTE_UPDATED: "Vote Updated Successfully",
    VOTE_REMOVED: "Vote Deleted Successfully",
    VOTE_ALREADY_EXISTS: "Vote already exist",
    VOTE_NOT_FOUND: "Vote not found",
    // Follows
    FOLLOWED_SUCCESSFULL: "Followed successfully",
    UNFOLLOWED_SUCCESSFULL: "Unfollowed successfully",
    INVALID_TYPE: "Invalid type. Must be 'followers' or 'followings'.",
};
