<template>
	<div id="topicAsk" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<component :is="topic_navbar" active="ask"></component>
	        	<div class="card">
	        		<div class="card-content">
	        			<span class="card-title">{{ topicName }}Ask Question</span>
		        		<!-- Using form so I can get html5 form validation -->
		        		<form v-on:submit.prevent="postQuestion()">
			        		<div class="input-field">
			        			<input id="title" v-model="title" type="text" class="validate" required>
			        			<label for="title">Title</label>
			        		</div>
			        		<div class="input-field">
			        			<textarea id="body" class="materialize-textarea validate" required></textarea>
			        			<label for="body">Question body</label>
			        		</div>
			        		<button type="submit" class="btn waves-effect waves-light" :class="{ 'disabled': submitBtnDisabled }">Submit</button>
			        	</form>
			        </div>
	        	</div>
	        </div>
	        <div class="col s12 m5 l3">
	        	<div class="card">
	        		<div class="card-content">
			        	<span class="card-title center-align">Connected Topics</span>
			        	<ul class="collection">
			        		<a class="collection-item center-align" :class="{ 'active': isActive(zite.address) }" v-for="zite in mergerZiteValues" :href="'./?/' + zite.address + '/ask'" v-on:click.prevent="goto(zite.address + '/ask')">{{ zite.content.title }}</a>
			        	</ul>
			        	<div class="center-align">
			        		<a href="#" style="">Top Available Topics</a>
			        	</div>
			        </div>
		        </div>
	        </div>
	    </div>
	</div>
</template>

<script>
	var Router = require("../libs/router.js");
	var $ = require("jquery");
	var TopicNavbar = require("../vue_components/topic_navbar.vue");

	module.exports = {
		props: ["mergerZites"],
		name: "topicAsk",
		data: () => {
			return {
				topic_navbar: TopicNavbar,
				topicName: "",
				submitBtnDisabled: false
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
			},
			postQuestion: function() {
				console.log("Post Question");
				this.submitBtnDisabled = true;
			}
		}
	}
</script>