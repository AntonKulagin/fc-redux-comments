import { createAction, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        isCreating: false
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        createCommentRequested: (state) => {
            state.isCreating = true;
        },
        createCommentSuccess: (state, action) => {
            state.entities = action.payload;
            state.isCreating = false;
        },
        removeCommentRequested: (state) => {
            state.isCreating = true;
        },
        removeCommentSuccess: (state) => {
            state.isCreating = false;
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    createCommentRequested,
    createCommentSuccess,
    removeCommentRequested,
    removeCommentSuccess
} = actions;

const createCommentFailed = createAction("comments/createCommentFailed");
const removeCommentFailed = createAction("comments/removeCommentFailed");

export const removeComment = (id) => async (dispatch) => {
    dispatch(removeCommentRequested());
    try {
        await commentService.removeComment(id);
        dispatch(removeCommentSuccess());
    } catch (error) {
        dispatch(removeCommentFailed(error.message));
    }
};

export const createComment = (payload) => async (dispatch) => {
    dispatch(createCommentRequested());
    try {
        const data = await commentService.createComment(payload);
        dispatch(createCommentSuccess(data));
    } catch (error) {
        dispatch(createCommentFailed());
    }
};

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;
export const getCreatingStatus = () => (state) => state.comments.isCreating;

export default commentsReducer;
