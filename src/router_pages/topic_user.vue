<template>
	<div id="topicUser" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<!--<component :is="topic_navbar" active="mine" :user-info="userInfo"></component>-->
                <nav style="margin-top: 10px; margin-bottom: 15px; background-color: #1976D2;">
	        	    <div class="nav-wrapper">
	        	    	<div class="col s12">
		        	        <a :href="'./?/' + topicAddress" v-on:click.prevent="goto(topicAddress)" class="breadcrumb">{{ topicName.slice(0, topicName.length - 3) }}</a>
		        	        <a :href="'./?/' + topicAddress + '/' + userAuthAddress" v-on:click.prevent="goto(topicAddress + '/' + userAuthAddress)" class="breadcrumb" v-if="userName">{{ userName }}</a>
	        	    	</div>
	        	    </div>
        		</nav>

	        	<component :is="question_list_item" v-for="question in questions" :question="question" :show-name="false" :current-topic-address="topicAddress"></component>
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
	var connectedTopics = require("../vue_components/connected_topics.vue");

	var QuestionListItem = require("../vue_components/question_list_item.vue");

	module.exports = {
		props: ["userInfo", "mergerZites"],
		name: "topicUser",
		data: () => {
			return {
				topic_navbar: TopicNavbar,
				connected_topics: connectedTopics,
				question_list_item: QuestionListItem,
				topicName: "",
                topicAddress: "",
                userAuthAddress: "",
                userName: "",
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
            
            self.userAuthAddress = Router.currentParams["authaddress"];

			this.$parent.$on("update", function() {
				self.getQuestions();
			});

			this.$parent.$on("setMergerZites", function(mergerZites) {
				self.manageMerger(mergerZites);
				self.getQuestions();
			});

			// If mergerZites is empty
			if (this.mergerZites && Object.keys(this.mergerZites).length != 0 && this.mergerZites.constructor === Object) {
				this.manageMerger(this.mergerZites);
				self.getQuestions();
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
			getQuestions: function() {
				var self = this;

				page.getQuestionsTopicUser(this.topicAddress, this.userAuthAddress)
					.then((questions) => {
                        self.questions = questions;
                        if (questions.length > 0) {
                            self.userName = questions[0].cert_user_id;
                        }
					});
			},
			goto: function(to) {
				Router.navigate(to);
			},
			getDate: function(date) {
				return moment(date).fromNow();
			}
		}
	}
</script>