export interface CommentRoot {
	isSuccess: boolean
	data: CommentData[]
	successMessage: string
	errorMessage: string
	status: number
}

export interface CommentData {
	id: string
	postId: string
	commentedUserId: string
	commentedUserName: string
	likeCount: number
	isLikedByCurrentUser: boolean
	isEdited: boolean
	commentedUserProfilePictureUrl: string
	childCount: number
	content: string
	parentCommentId: any
	createdAt: string
	updatedAt: string
}
