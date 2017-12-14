<template>
	<div class="card" id="question-list-item">
		<div class="card-content">
			<span class="card-title"><a :href="'./?/' + currentTopicAddress + '/' + getAuthAddress + '/' + question.date_added" v-on:click.prevent="goto(currentTopicAddress + '/' + getAuthAddress + '/' + question.date_added)">{{ question.title }}</a></span>
			<p>
				{{ question.body }}
			</p>
			<small>Published {{ getDate }} <span v-if="showName">by <a :href="'./?/' + currentTopicAddress + '/' + getAuthAddress" v-on:click.prevent="goto(currentTopicAddress + '/' + getAuthAddress)">{{ getName }}</a></span></small>
		</div>
	</div>
</template>

<script>
	var moment = require("moment");
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["mergerZites", "question", "showName", "currentTopicAddress"],
		name: "question-list-item",
		computed: {
			getName: function() {
				var name = this.question.cert_user_id.replace(/@.+/, "");
				return name[0].toUpperCase() + name.slice(1);
			},
			getDate: function() {
				return moment(this.question.date_added).fromNow();
			},
			getAuthAddress: function() {
				return this.question.directory.replace(/data\/users\//, "").replace(/\//g, "");
			}
		},
		methods: {
			goto: function(to) {
				Router.navigate(to);
			}
		}
	};
</script>