<template>
	<div id="commentArea">
		<div class="card-content card-section" style="padding-top: 13px; padding-bottom: 8px;">
			<a href="#" v-on:click.prevent="showCommentBox = !showCommentBox" style="margin-right: 7px;"><i class="material-icons" style="font-size: 1.3rem;">comment</i></a>
			<slot></slot>
		</div>
		<div class="card-content card-section" v-if="comments && comments.length > 0">
			<div v-for="comment in comments" :key="comment.comment_id" style="margin-bottom: 7px;">
				<a href="#">{{ getName(comment) }}</a> <small>Published {{ getDate(comment) }}</small>
				<div style="margin-left: 10px;" v-html="commentMarkdown(comment)"></div>
			</div>
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

	module.exports = {
		props: ["comments", "referenceType", "referenceId", "referenceAuthAddress", "currentTopicAddress"],
		name: "commentArea",
		data: () => {
			return {
				showCommentBox: false,
				commentText: ""
			};
		},
		methods: {
			getName(comment) {
				if (!comment || !comment.cert_user_id) return "";
				var name = comment.cert_user_id.replace(/@.+/, "");
				return name[0].toUpperCase() + name.slice(1);
			},
			getDate: function(comment) {
				return moment(comment.date_added).fromNow();
			},
			getAuthAddress: function(comment) {
				return comment.directory.replace(/data\/users\//, "").replace(/\//g, "");
			},
			postComment: function() {
				if (!this.referenceType || this.referenceType === "" || !this.referenceAuthAddress || this.referenceAuthAddress === "" || !this.referenceId || !this.currentTopicAddress || this.currentTopicAddress === "" || this.commentText === "") return;
				var self = this;
				this.submitBtnDisabled = true;

				page.postComment(this.currentTopicAddress, this.referenceType, this.referenceId, this.referenceAuthAddress, this.commentText, () => {
					self.submitBtnDisabled = false;
					self.commentText = "";
					self.$emit("update");
					//console.log(self.$refs.commentTextArea);
				});
			},
			commentMarkdown: function(comment) {
				return md.render(comment.body).replace(/(?:(>)|(^|\s|\r\n|\r|\n))(@\S+(?:\'s)?:?)(?:(<)|(\s|$|\r\n|\r|\n))/g, "$1<strong>$2$3$5</strong>$4").replace(/(?:>)(\S+(?:\'s)?:)(?:(<)|(\s|$|\r\n|\r|\n))/g, "><strong>$1$3</strong>$2");
			}
		}
	}
</script>