/** @format */

import * as Vue from "./vue.js";
import modal from "./components/modal.js";

const defaultLimit = 4;

export function getImages(query) {
    return fetch("/images.json?" + new URLSearchParams(query)).then(
        (response) => response.json()
    );
}

const app = Vue.createApp({
    components: { modal: modal },

    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            currentImageID: null,
            currentPage: 1,
            noMoreImages: false,
        };
    },

    methods: {
        setImage({ target }) {
            this.file = target.files[0];
            console.log("[files]", target.files);
        },

        submitImage() {
            const { title, description, username, file } = this;
            const formData = new FormData();
            formData.append("image", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("username", username);
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((image) => {
                    this.images = [image, ...this.images];
                });
        },

        onImageClick(id) {
            this.currentImageID = id;
            history.pushState({}, "", "/id/" + id);
        },

        onModalClose() {
            this.currentImageID = null;
            history.pushState({}, "", "/");
        },

        loadMoreImages() {
            getImages({
                limit: defaultLimit,
                page: this.currentPage,
            }).then((images) => {
                this.images = [...this.images, ...images];
                if (!images.length) {
                    this.noMoreImages = true;
                    return;
                }
                this.currentPage++;
            });
        },

        updateStateFromLocation() {
            const id = location.pathname.split("/").pop();
            if (!id) {
                this.currentImageID = null;
                return;
            }
            this.currentImageID = id;
        },
    },

    mounted() {
        this.loadMoreImages();
        window.addEventListener("popstate", () => {
            this.updateStateFromLocation();
        });
        this.updateStateFromLocation();
    },
});

app.mount("main");
