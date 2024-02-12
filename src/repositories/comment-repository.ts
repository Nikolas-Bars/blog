import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {CommentInputType} from "../models/comments/input/comment-input";
import {CommentOutputType} from "../models/comments/output/comment-output";

export class CommentRepository {

    static async createComment(newPost: CommentInputType): Promise<string | null> {
        try {
                const result = await commentsCollection.insertOne(
                    {
                        commentatorInfo: newPost.commentatorInfo,
                        content: newPost.content,
                        createdAt: newPost.createdAt,
                        postId: newPost.postId
                    })
                console.log(2, result.insertedId.toString())
                return result.insertedId.toString()

        } catch (e) {
            return null
        }
    }

    static async updateComment(id: string, content: string) {
        try {

            const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: {content: content}})

            return result.modifiedCount

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async getCommentById(commentId: string): Promise<CommentOutputType | null> {
        try {

            const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)})

            if (comment) {
                return {
                    id: comment._id.toString(),
                    commentatorInfo: comment.commentatorInfo,
                    content: comment.content,
                    createdAt: comment.createdAt
                }
            } else {
                return null
            }

        } catch (e) {
            console.error(e)

            return null
        }
    }

    static async deleteOneComment(id: string) {
        try {
            const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })

            if (!result) {
                return null
            }
            return result.deletedCount
        } catch (e) {
            console.error(e)
        }
    }

}