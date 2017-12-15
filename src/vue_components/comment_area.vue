<template>
	<div id="commentArea">
		<div class="card-content card-section" style="padding-top: 13px; padding-bottom: 5px;">
			<a href="#" v-on:click.prevent="showCommentBox = !showCommentBox" style="margin-right: 5px;"><i class="material-icons" style="font-size: 1.3rem;">comment</i></a>
			<a href="#" style="margin-right: 5px;"><i class="material-icons" style="font-size: 1.3rem;">thumb_up</i></a>
			<a href="#" style="margin-right: 5px;"><i class="material-icons" style="font-size: 1.3rem;">thumb_down</i></a>
		</div>
		<div class="card-content card-section" v-if="comments && comments.length > 0">
			<div v-for="comment in comments" style="margin-bottom: 7px;">
				<a href="#">{{ getName(comment) }}</a> <small>Published {{ getDate(comment) }}</small><br>
				{{ comment.body }}<br>
			</div>
		</div>
		<div class="card-content card-section" v-if="showCommentBox">
			<form v-on:submit.prevent="postComment()">
				<div class="input-field">
	    			<textarea rows="3" id="comment" class="materialize-textarea validate" required v-model="commentText"></textarea>
	    			<label for="comment">Question body</label>
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

				page.postComment(this.currentTopicAddress, this.referenceType, this.referenceId, this.referenceAuthAddress, this.commentText)
					.then(() => {
						self.submitBtnDisabled = false;
						self.commentText = "";
						self.$emit("update");
						//self.getComments(); // Update comments
						// TODO: emit update event here!
					});
			}
		}
	}
</script>