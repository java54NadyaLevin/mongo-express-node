import MongoConnection from '../mongo/MongoConnection.mjs'
import { ObjectId } from 'mongodb'
export default class MflixService {
    #moviesCollection
    #commentsCollection
    #connection
    constructor(uri, dbName, moviesCollection, commentsCollection){
        this.#connection = new MongoConnection(uri, dbName);
        this.#moviesCollection = this.#connection.getCollection(moviesCollection);
        this.#commentsCollection = this.#connection.getCollection(commentsCollection);
        
    }
    shutdown() {
        this.#connection.closeConnection();
    }
    async addComment(commentDto) {
        const commentDB = this.#toComment(commentDto, 'movie_id');
        const result = await this.#commentsCollection.insertOne(commentDB);
        commentDB._id = result.insertedId;
        return commentDB;
    }
    async updateComment(commentDto) {
        const commentDB = this.#toComment(commentDto, 'comment_id');
        const result = await this.#commentsCollection.findOneAndUpdate({_id: commentDB.comment_id}, {$set: commentDto}, {returnDocument: 'after'});
        commentDB.text = result.text;
        return commentDB;
    }
    #toComment(commentDto, idToString) {
        const idString = ObjectId.createFromHexString(commentDto[idToString]);
        return {...commentDto, [idToString]: idString}
    }

}