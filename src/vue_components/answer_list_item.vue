<template>
	<div id="answer-list-item">
		<div class="card">
			<div class="card-content">
				<div class="chip" style="background-color: #88AA88;" v-if="isSolution">Solution</div>
				<div class="chip" v-if="showName"><a :href="'./?/' + currentTopicAddress + '/' + getAuthAddress" v-on:click.prevent="goto(currentTopicAddress + '/' + getAuthAddress)">{{ getName }}</a></div>
				<div style="margin-bottom: 5px; font-size: 1.2rem;" v-html="getMarkdown"></div>
				<div>Published {{ getDate }} <span v-if="showName">by <a :href="'./?/' + currentTopicAddress + '/' + getAuthAddress" v-on:click.prevent="goto(currentTopicAddress + '/' + getAuthAddress)">{{ getName }}</a></span></div>
			</div>
			<component v-if="comments" :is="comment_area" :current-topic-address="currentTopicAddress" :comments="comments" :reference-id="answer.answer_id" :reference-auth-address="getAuthAddress" reference-type="a" v-on:update="getComments()">
				<a href="#" style="margin-right: 7px;"><i class="material-icons" style="font-size: 1.3rem;">thumb_up</i></a>
				<a href="#" style="margin-right: 7px;"><i class="material-icons" style="font-size: 1.3rem;">thumb_down</i></a>
				<a v-if="userIsQuestionOwner && !isSolution" href="#" v-on:click.prevent="markSolution" style="margin-right: 7px;"><i class="material-icons" style="font-size: 1.3rem;">check</i></a>
			</component>
		</div>
	</div>
</template>

<script>
	var moment = require("moment");
	var Router = require("../libs/router.js");
	var CommentArea = require("./comment_area.vue");

	module.exports = {
		props: ["userInfo", "mergerZites", "answer", "showName", "currentTopicAddress", "userIsQuestionOwner", "solutionId", "solutionAuthAddress"],
		name: "answer-list-item",
		data: () => {
			return {
				comment_area: CommentArea,
				comments: []
			};
		},
		computed: {
			getName: function() {
				if (!this.answer.cert_user_id) return "";
				var name = this.answer.cert_user_id.replace(/@.+/, "");
				return name[0].toUpperCase() + name.slice(1);
			},
			getDate: function() {
				return moment(this.answer.date_added).fromNow();
			},
			getAuthAddress: function() {
				return this.answer.directory.replace(/data\/users\//, "").replace(/\//g, "");
			},
			getMarkdown: function() {
				return md.render(this.answer.body);
			},
			userIsOwner: function() {
				return this.getAuthAddress === this.userInfo.auth_address;
			},
			isSolution: function() {
				return this.getAuthAddress === this.solutionAuthAddress && this.answer.answer_id === this.solutionId;
			}
		},
		beforeMount: function() {
			this.getComments();
		},
		methods: {
			goto: function(to) {
				Router.navigate(to);
			},
			getComments: function() {
				var self = this;

				page.getAnswerComments(this.currentTopicAddress, this.answer.answer_id, this.getAuthAddress)
					.then((comments) => {
						self.comments = comments;
					});
			},
			markSolution: function() {
				this.$emit("mark-solution", this.answer.answer_id, this.getAuthAddress);
			}
		}
	};
</script>