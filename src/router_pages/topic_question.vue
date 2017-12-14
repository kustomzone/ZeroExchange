<template>
	<div id="topicQuestion" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<nav style="margin-top: 10px; margin-bottom: 15px; background-color: #1976D2;">
	        	    <div class="nav-wrapper">
	        	    	<div class="col s12">
		        	        <a :href="'./?/' + topicAddress" v-on:click.prevent="goto(topicAddress)" class="breadcrumb">{{ topicName.slice(0, topicName.length - 3) }}</a>
		        	        <a :href="'./?/' + topicAddress + '/' + getAuthAddress" v-on:click.prevent="goto(topicAddress + '/' + getAuthAddress)" class="breadcrumb" v-if="question">{{ getName }}</a>
		        	        <a href="#!" class="breadcrumb" v-if="question">{{ question.title }}</a>
	        	    	</div>
	        	    </div>
        		</nav>
	        	<div class="card" v-if="question">
	        		<div class="card-content">
	        			<span class="card-title">{{ question.title }}</span>
	        			<p>
	        				{{ question.body }}
	        			</p>
	        			<small>Published {{ getDate }} <span>by <a :href="'./?/' + topicAddress + '/' + getAuthAddress" v-on:click.prevent="goto(topicAddress + '/' + getAuthAddress)">{{ getName }}</a></span></small>
	        		</div>
	        	</div>
	        	<h5 v-if="question">Answers <small style="margin-left: 10px; font-size: 65%;"><a :href="'./?/' + topicAddress + '/' + getAuthAddress + '/' + question.question_id + '/answer'" v-on:click.prevent="goto(topicAddress + '/' + getAuthAddress + '/' + question.question_id + '/answer')">Post Answer</a></small></h5>
	        	<div class="divider"></div>

	        	<component :is="answer_list_item" v-for="answer in answers" :merger-zites="mergerZites" :current-topic-address="topicAddress" :show-name="true" :answer="answer"></component>
	        </div>
	        <div class="col s12 m5 l3">
	        	<component :is="connected_topics" :merger-zites="mergerZites"></component>
	        </div>
	    </div>
	</div>
</template>

<script>
	var moment = require("moment");
	var Router = require("../libs/router.js");
	var connectedTopics = require("../vue_components/connected_topics.vue");
	var AnswerListItem = require("../vue_components/answer_list_item.vue");

	module.exports = {
		props: ["mergerZites"],
		name: "topicQuestion",
		data: () => {
			return {
				connected_topics: connectedTopics,
				answer_list_item: AnswerListItem,
				topicName: "",
				topicAddress: "",
				question: null,
				answers: []
			}
		},
		computed: {
			mergerZiteValues: function() {
				if (this.mergerZites == null) {
					return [];
				}
				return Object.values(this.mergerZites);
			},
			mergerZiteKeys: function() {
				if (this.mergerZites == null) {
					return [];
				}
				return Object.keys(this.mergerZites);
			},
			getName: function() {
				if (!this.question || !this.question.cert_user_id) return "";
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
		beforeMount: function() {
			var self = this;

			this.$parent.$on("setMergerZites", function(mergerZites) {
				self.manageMerger(mergerZites);
				self.getQuestion();
				self.getAnswers();
			});

			// If mergerZites is empty
			if (this.mergerZites && Object.keys(this.mergerZites).length != 0 && this.mergerZites.constructor === Object) {
				this.manageMerger(this.mergerZites);
				self.getQuestion();
				self.getAnswers();
			}
		},
		methods: {
			manageMerger: function(mergerZites) { // TODO: Update this in other pages
				if (!mergerZites[Router.currentParams["topicaddress"]]) {
					page.addMerger(Router.currentParams["topicaddress"])
						.then(() => {
							this.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
							this.topicAddress = Router.currentParams["topicaddress"];
						});
				} else {
					this.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
					this.topicAddress = Router.currentParams["topicaddress"];
				}
			},
			getQuestion: function() {
				var self = this;

				page.getQuestion(this.topicAddress, Router.currentParams["authaddress"], Router.currentParams["questionid"])
					.then((questions) => {
						console.log(questions);
						self.question = questions[0];
					});
			},
			getAnswers: function() {
				var self = this;

				page.getQuestionAnswers(this.topicAddress, Router.currentParams["authaddress"], Router.currentParams["questionid"])
					.then((answers) => {
						console.log(answers);
						self.answers = answers;
					});
			},
			goto: function(to) {
				Router.navigate(to);
			},
			isActive: function(address) {
				return Router.currentParams["topicaddress"] === address;
			},
			getDate: function(date) {
				return moment(date).fromNow();
			}
		}
	}
</script>