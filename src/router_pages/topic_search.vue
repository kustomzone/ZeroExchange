<template>
	<div id="topicSearch" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<component :is="topic_navbar" active="search" style="margin-bottom: 0;" class="z-depth-2"></component>
	        	<nav style="background-color: #1976D2; margin-bottom: 10px;">
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

	module.exports = {
		props: ["mergerZites"],
		name: "topicSearch",
		data: () => {
			return {
				topic_navbar: TopicNavbar,
				connected_topics: connectedTopics,
				topicName: "",
				searchInput: ""
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
			this.$parent.$on("setMergerZites", this.manageMerger);

			// If mergerZites is empty
			if (this.mergerZites && Object.keys(this.mergerZites).length != 0 && this.mergerZites.constructor === Object) {
				this.manageMerger(this.mergerZites);
			}
		},
		methods: {
			manageMerger: function(mergerZites) {
				if (!mergerZites[Router.currentParams["topicaddress"]]) {
					page.addMerger(Router.currentParams["topicaddress"]);
				}
				this.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
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