"use client"

import { CommentData } from "@/app/types/comment.types"

import { createContext, ReactNode, useContext, useState } from "react"

export interface ICommentProps extends CommentData {
    replies?: CommentData[]
}

interface ICommentContext {
    comments: ICommentProps[]
    handleDataUpdate: (newComment: CommentData, parentCommentId: string | null) => void
    requestedParentCommentId: string
    handleParentIdUpdate: (parentCommentId: string) => void
}
// comment + replies

export const CommentContext = createContext<ICommentContext>(null as any)



const CommentContextProvider = ({ children }: { children: ReactNode }) => {

    const [comments, setComments] = useState<ICommentProps[]>([])
    const [requestedParentCommentId, setRequestedParentCommentId] = useState<string>("")
    function handleDataUpdate(
        newComment: CommentData | CommentData[],
        parentCommentId: string | null
    ) {

        const normalized = Array.isArray(newComment)
            ? newComment
            : [newComment];

        if (parentCommentId) {
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === parentCommentId
                        ? {
                            ...comment,
                            replies: comment.replies
                                ? [...normalized, ...comment.replies]
                                : [...normalized],
                        }
                        : comment
                )
            );
        } else {
            setComments(prevComments => [...normalized, ...prevComments]);
        }
    }


    function handleParentIdUpdate(parentCommentId: string) {
        setRequestedParentCommentId(parentCommentId)
    }

    return (
        <CommentContext.Provider value={{ comments, handleDataUpdate, requestedParentCommentId, handleParentIdUpdate }}>
            {children}
        </CommentContext.Provider>
    )
}

export default CommentContextProvider

export const useCommentContext = () => {
    const context = useContext(CommentContext)
    if (!context) {
        throw new Error(
            "useCommentContext must be used within a CommentContextProvider",
        )
    }
    return context
}