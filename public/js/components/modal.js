/** @format */
import CommentList from "./comment-list-together.js";

function getImage(id) {
    return fetch(`/images/${id}`).then((response) => response.json());
}

const modal = {
    props: ["id"],

    components: {
        "comment-list": CommentList,
    },

    data() {
        return {
            image: {},
            visible: false,
        };
    },

    methods: {
        onCloseButtonClick() {
            this.$emit("close");
        },

        onBackdropClick(event) {
            if (!event.target.classList.contains("modal")) {
                return;
            } else this.$emit("close");
        },

        onEscPress(event) {
            if (event.key !== "Escape") {
                return;
            }
            this.$emit("close");
        },

        beforeUnmount() {
            document.removeEventListener("keydown", this.onEscPress);
        },
    },

    mounted() {
        getImage(this.id).then((image) => {
            this.image = image;
            this.visible = true;
        });
        document.addEventListener("keydown", this.onEscPress);
    },

    beforeUnmount() {
        document.removeEventListener("keydown", this.onEscPress);
    },

    template: `
    <div class="modal" v-bind:class="{ visible }" v-on:click="onBackdropClick">

        <button id="close" class="close" v-on:click="onCloseButtonClick">
        
        <div id="nac_container">
            <div id="nav-icon1">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        </button>


        <div class="modal-content">
        
            <section class="modal-image">
                <img :src="image.url" class="modal-img">
            </section>

            <section class="modal-description">
                <div class="modal-description-text">
                <h2 class="modal-username">{{image.username}}</h2>
                <p class="modal-description-text">{{image.description}}</p>
                <p class="modal-date">{{image.created_at}}</p>
            </section>

            <section class="modal-comments">
                <comment-list :id="id"></comment-list>
            </section>
        </div>
        
    </div>`,
};

export default modal;
