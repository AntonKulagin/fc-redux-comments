import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments";
import { useDispatch, useSelector } from "react-redux";
import {
    createComment,
    getComments,
    getCommentsLoadingStatus,
    getCreatingStatus,
    loadCommentsList
} from "../../store/comments";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { getCurrentUserId } from "../../store/users";

const Comments = () => {
    const { userId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());
    const isLoading = useSelector(getCommentsLoadingStatus());
    const isCreating = useSelector(getCreatingStatus());
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId, isCreating]);

    const comments = useSelector(getComments());

    const handleSubmit = (data) => {
        dispatch(
            createComment({
                ...data,
                _id: nanoid(),
                pageId: userId,
                created_at: Date.now(),
                userId: currentUserId
            })
        );
    };

    const sortedComments = orderBy(comments, ["created_at"], ["desc"]);
    return (
        <>
            <div className="card mb-2">
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {!isLoading ? (
                            <CommentsList comments={sortedComments} />
                        ) : (
                            "Nothing......"
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;
