<template>
	<div id="topicSearch" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<component :is="topic_navbar" active="search" style="margin-bottom: 0;" class="z-depth-2"></component>
	        	<nav style="background-color: #1976D2; margin-bottom: 15px;">
		        	<div class="nav-wrapper">
		        		<form>
	    		        	<div class="input-field">
	    		        		<input id="search" type="search" placeholder="Search" v-model="searchInput" required>
	    		        		<label class="label-icon" for="search"><i class="material-icons">search</i></label>
	    		        		<i class="material-icons" v-on:click="searchInput = ''">close</i>
	    			        </div>
	    		      	</form>
		        	</div>
		        </nav>
		        <component :is="question_list_item" v-for="question in questions" :question="question" :show-name="true" :current-topic-address="topicAddress"></component>
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
	var TopicNavbar = require("../vue_components/topic_navbar.vue");
	var ConnectedTopics = require("../vue_components/connected_topics.vue");

	var QuestionListItem = require("../vue_components/question_list_item.vue");

	module.exports = {
		props: ["mergerZites"],
		name: "topicSearch",
		data: () => {
			return {
				topic_navbar: TopicNavbar,
				connected_topics: ConnectedTopics,
				question_list_item: QuestionListItem,
				topicName: "",
				topicAddress: "",
				searchInput: "",
				questions: []
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
			}
		},
		beforeMount: function() {
			var self = this;

			this.$parent.$on("setMergerZites", function(mergerZites) {
				self.manageMerger(mergerZites);
				self.getQuestions();
			});

			// If mergerZites is empty
			if (this.mergerZites && Object.keys(this.mergerZites).length != 0 && this.mergerZites.constructor === Object) {
				this.manageMerger(this.mergerZites);
				this.getQuestions();
			}
		},
		methods: {
			manageMerger: function(mergerZites) {
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
			getQuestions: function() {
				var self = this;

				page.getQuestionsTopic(this.topicAddress)
					.then((questions) => {
						console.log(questions);
						self.questions = questions;
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