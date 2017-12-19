<template>
	<div class="card" id="question-list-item">
		<div class="card-content">
			<span class="card-title"><a :href="'./?/' + currentTopicAddress + '/' + getAuthAddress + '/' + question.date_added" v-on:click.prevent="goto(currentTopicAddress + '/' + getAuthAddress + '/' + question.date_added)">{{ question.title }}</a></span>
			<p class="truncate">
				{{ bodyMarkdownStriped }}
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
				if (!this.question.cert_user_id) return "";
				var name = this.question.cert_user_id.replace(/@.+/, "");
				return name[0].toUpperCase() + name.slice(1);
			},
			getDate: function() {
				return moment(this.question.date_added).fromNow();
			},
			getAuthAddress: function() {
				return this.question.directory.replace(/data\/users\//, "").replace(/\//g, "");
			},
			bodyMarkdownStriped: function() {
				return this.question.body.replace(/(?:\r\n|\r|\n|^)\s*[#+\-*1-9a-z]\.?\s+/, " ").replace(/(?:\r\n|\r|\n|^)```(.*)(?:\r\n|\r|\n|$)(.*)(?:\r\n|\r|\n|^)```(.*)(?:\r\n|\r|\n|$)/, "| $2 | (code: $1)") // Remove markdown symbols that appear at begining of lines, including code
					.replace(/\*(\S(?:.*\S)?)\*/, "$1").replace(/_(\S(?:.*\S)?)_/, "$1") // Remove bold (Note that $1 in replace string denotes the first group from the regex)
					.replace(/\*\*(\S(?:.*\S)?)\*\*/, "$1").replace(/__(\S(?:.*\S)?)__/, "$1") // Remove italics
					.replace(/~(\S(?:.*\S)?)~/, "$1").replace(/~~(\S(?:.*\S)?)~~/, "$1") // Remove strikethrough
					.replace(/`(\S(?:.*\S)?)`/, "|$1|(code)") // Remove code symbols
					.replace(/\[(\S(?:.*\S)?)\]\(\S(?:.*\S)?\)/, "| $1 | (link)"); // Remove link
			}
		},
		methods: {
			goto: function(to) {
				Router.navigate(to);
			}
		}
	};
</script>