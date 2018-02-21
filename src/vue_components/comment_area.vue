<template>
	<div id="commentArea">
		<div class="card-content card-section" style="padding-top: 13px; padding-bottom: 8px;">
			<a href="#" v-on:click.prevent="showCommentBox = !showCommentBox" style="margin-right: 7px;"><i class="material-icons" style="font-size: 1.3rem;">comment</i></a>
			<slot></slot>
		</div>
		<div class="card-content card-section" v-if="comments && comments.length > 0">
			<component :is="comment_list_item" :current-topic-address="currentTopicAddress" :user-info="userInfo" v-for="comment in comments" style="margin-bottom: 7px;" :comment="comment" v-on:update="updateComments"></component>
		</div>
		<div class="card-content card-section" v-if="showCommentBox">
			<form v-on:submit.prevent="postComment()">
				<div class="input-field">
	    			<textarea ref="commentTextArea" rows="3" id="comment" class="materialize-textarea validate" required v-model="commentText"></textarea>
	    			<label for="comment">Comment body</label>
	    		</div>
	    		<button type="submit" class="btn btn-small waves-effect waves-light" :class="{ 'disabled': submitBtnDisabled }">Submit</button>
	    	</form>
		</div>
	</div>
</template>

<script>
	var moment = require("moment");
	var comment_list_item = require("./comment_list_item.vue");

	module.exports = {
		props: ["userInfo", "comments", "referenceType", "referenceId", "referenceAuthAddress", "currentTopicAddress"],
		name: "commentArea",
		data: () => {
			return {
				showCommentBox: false,
				comment_list_item: comment_list_item,
				commentText: ""
			};
		},
		methods: {
			postComment: function() {
				if (!this.referenceType || this.referenceType === "" || !this.referenceAuthAddress || this.referenceAuthAddress === "" || !this.referenceId || !this.currentTopicAddress || this.currentTopicAddress === "" || this.commentText === "") 
					return;
				var self = this;
				this.submitBtnDisabled = true;

				page.postComment(this.currentTopicAddress, this.referenceType, this.referenceId, this.referenceAuthAddress, this.commentText, () => {
					self.submitBtnDisabled = false;
					self.commentText = "";
					self.$emit("update");
				});
			},
			updateComments: function() {
				this.comments = [];
				this.$emit("update");
			}
		}
	}
</script>