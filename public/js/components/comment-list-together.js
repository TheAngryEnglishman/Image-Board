/** @format */

function getCommentsForImage(id) {
    return fetch(`/images/${id}/comments`).then((response) => response.json());
}

function createComment({ id, username, text }) {
    return fetch(`/images/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ username, text }),
        headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
}

const commentList = {
    props: ["id"],

    data() {
        return {
            comments: [],
            username: "",
            text: "",
        };
    },

    methods: {
        submitComment() {
            createComment(this).then((comment) => {
                this.comments = [comment, ...this.comments];
            });
        },
    },

    mounted() {
        getCommentsForImage(this.id).then((comments) => {
            this.comments = comments;
        });
    },

    // need to create form input list //

    template: `
    
        <div class="comment-list flex-column-center">

            <ul v-if="comments.length > 0">
                <li v-for="comment in comments"><h6>{{comment.username}}</h6> {{comment.text}}</li>
            </ul>
            
            <p v-else>No comments yet, be the first!</p>
        </div>
        
        <div class="comment-form-container">
            <form v-on:submit.prevent="submitComment" class="comment-form">
                <h2>username</h2>
                <input v-model="username" name="username" placeholder="type your username">
                <h2>comment</h2>
                <input v-model="text" name="text" placeholder="type your comment">
                <button>post</button>
            </form>
        </div>

    `,
};

export default commentList;
