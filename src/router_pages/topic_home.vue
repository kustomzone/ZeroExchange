<template>
	<div id="topicHome" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<component :is="topic_navbar" active="explore" :user-info="userInfo"></component>

				<h5>Recent</h5>
	        	<div class="divider"></div>

				<component :is="question_list_item" v-for="question in recentQuestions" :key="question.question_id" :user-info="userInfo" :merger-zites="mergerZites" :question="question" :show-name="true" :current-topic-address="topicAddress"></component>
	        </div>
	        <div class="col s12 m5 l3">
	        	<component :is="connected_topics" :merger-zites="mergerZites"></component>
	        </div>
	    </div>
	</div>
</template>

<script>
	var Router = require("../libs/router.js");
	var TopicNavbar = require("../vue_components/topic_navbar.vue");
	var connectedTopics = require("../vue_components/connected_topics.vue");
	var QuestionListItem = require("../vue_components/question_list_item.vue");

	module.exports = {
		props: ["userInfo", "mergerZites"],
		name: "topicHome",
		data: () => {
			return {
				topic_navbar: TopicNavbar,
				connected_topics: connectedTopics,
				question_list_item: QuestionListItem,
				topicName: "",
				topicAddress: "",
				recentQuestions: []
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

			this.$parent.$on("update", function() {
				console.log("Test");
				self.getRecent();
			});

			this.$parent.$on("setMergerZites", function(mergerZites) {
				self.manageMerger(mergerZites);
				self.getRecent();
			});

			// If mergerZites is empty
			if (this.mergerZites && Object.keys(this.mergerZites).length != 0 && this.mergerZites.constructor === Object) {
				this.manageMerger(this.mergerZites);
				this.getRecent();
			}
		},
		methods: {
			manageMerger: function(mergerZites) {
				if (this.topicAddress !== "" && this.topicName !== "") return;
				var self = this;
				if (!mergerZites[Router.currentParams["topicaddress"]]) {
					page.addMerger(Router.currentParams["topicaddress"])
						.then((mergerZites) => {
							self.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
							self.topicAddress = Router.currentParams["topicaddress"];
						});
				} else {
					this.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
					this.topicAddress = Router.currentParams["topicaddress"];
				}
			},
			getRecent: function() {
				var self = this;

				page.getQuestionsTopicRecent(this.topicAddress)
					.then((questions) => {
						self.recentQuestions = questions;
					});
			},
			goto: function(to) {
				Router.navigate(to);
			},
			isActive: function(address) {
				return Router.currentParams["topicaddress"] === address;
			}
		}
	}
</script>