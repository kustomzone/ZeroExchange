<template>
    <div id="comment-list-item">
        <a href="#">{{ getName }}</a>
        <small>
            Published {{ getDate }}
            <em v-if="userIsOwner"> | 
                <a href="#" v-on:click.prevent="showEdit()" v-if="!isEditing">Edit</a> 
                <span v-else>
                    <a href="#" v-on:click.prevent="editComment()">Save</a> | 
                    <a href="#" v-on:click.prevent="isEditing = false;">Cancel</a>
                </span> | 
                <a href="#" v-on:click.prevent="deleteComment()"> Delete</a>
            </em>
        </small>

        <div style="margin-left: 10px;" v-html="getMarkdown" v-if="!isEditing"></div>
        <div style="margin-left: 10px;" v-else> <!-- Editing Box for comment -->
            <form v-on:submit.prevent="editComment()">
                <div class="input-field">
                    <textarea rows="2" :id="'editComment_' + comment.comment_id" class="materialize-textarea validate" required v-model="editText"></textarea>
                    <label :for="'editComment_' + comment.comment_id" class="active">Comment body</label>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    var moment = require("moment");
    var Router = require("../libs/router.js");
    
    module.exports = {
        props: ["userInfo", "comment", "currentTopicAddress"],
        name: "comment-list-item",
        data: () => {
            return {
                isEditing: false,
                editText: "",
                saveBtnDisabled: false
            };
        },
        computed: {
            getName: function() {
                if (!this.comment || !this.comment.cert_user_id) return "";
				var name = this.comment.cert_user_id.replace(/@.+/, "");
				return name[0].toUpperCase() + name.slice(1);
            },
            getDate: function() {
				return moment(this.comment.date_added).fromNow();
			},
            getAuthAddress: function() {
				return this.comment.directory.replace(/data\/users\//, "").replace(/\//g, "");
			},
            getMarkdown: function() {
				return md.render(this.comment.body).replace(/(?:(>)|(^|\s|\r\n|\r|\n))(@\S+(?:\'s)?:?)(?:(<)|(\s|$|\r\n|\r|\n))/g, "$1<strong>$2$3$5</strong>$4").replace(/(<(?:p|li|blockquote)>)(\S+(?:\'s)?:)(?:(<)|(\s|$|\r\n|\r|\n))/g, "$1<strong>$2$4</strong>$3");
			},
            userIsOwner: function() {
				if (!this.userInfo) return false;
				return this.getAuthAddress === this.userInfo.auth_address;
			}
        },
        methods: {
            deleteComment: function() {
				if (!this.userIsOwner) return;
				if (!this.currentTopicAddress || this.currentTopicAddress === "") {
					console.log("[comment_list_item.vue deleteComment] ERROR!");
					return;
				}

				var self = this;
				page.deleteComment(this.currentTopicAddress, this.comment.comment_id, () => {
                        self.$emit("update");
                    });
			},
            editComment: function() {
                if (this.saveBtnDisabled) return;
				if (!this.currentTopicAddress || this.currentTopicAddress == "" || this.editText == "")
					return;
				this.saveBtnDisabled = true;

				var self = this;
				page.editComment(this.currentTopicAddress, this.comment.comment_id, this.editText, () => {
                        self.saveBtnDisabled = false;
                        self.isEditing = false;
                        self.$emit("update");
                    });
			},
            showEdit: function() {
                this.isEditing = true;
                this.editText = this.comment.body;
            }
        }
    };
</script>