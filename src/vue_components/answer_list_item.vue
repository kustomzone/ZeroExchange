<template>
	<div class="card" id="answer-list-item">
		<div class="card-content">
			<p>
				{{ answer.body }}
			</p>
			<small>Published {{ getDate }} <span v-if="showName">by <a :href="'./?/' + currentTopicAddress + '/' + getAuthAddress" v-on:click.prevent="goto(currentTopicAddress + '/' + getAuthAddress)">{{ getName }}</a></span></small>
		</div>
	</div>
</template>

<script>
	var moment = require("moment");
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["mergerZites", "answer", "showName", "currentTopicAddress"],
		name: "answer-list-item",
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
			}
		},
		methods: {
			goto: function(to) {
				Router.navigate(to);
			}
		}
	};
</script>