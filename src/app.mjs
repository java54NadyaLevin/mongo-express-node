import express from 'express';
import MflixService from './service/MflixService.mjs'
const app = express();
const port = process.env.PORT || 3500;
const mflixService = new MflixService(process.env.MONGO_URI, "sample_mflix",
    "movies", "comments")
const server = app.listen(port);
server.on("listening", ()=>console.log(`server listening on port ${server.address().port}`));
app.use(express.json());
app.post("/mflix/comments", async (req, res) => {
    await requestHandler(req, res, 'addComment');
});
app.put("/mflix/comments", async (req, res) => {
    await requestHandler(req, res, 'updateComment');
});
app.delete("/mflix/comments/:id", async (req, res) => {
    await requestHandler(req, res, 'deleteComment');
})
app.get("/mflix/comments/:id", async (req, res) => {
    //TODO get comment
   // req.params.id - comment to get
})
app.post("/mflix/movies/rated", async (req, res) => {
    //TODO find most imdb rated movies
   // req.body {"year":<number>(optional), "genre":<string>(optional),
   // "actor":<string-regex>(optional), "amount":<number>(mandatory)}
   
})
async function requestHandler(req, res, operation) {
    const commentDB = await mflixService[operation](req.body);
    res.status(201).end(JSON.stringify(commentDB));
}