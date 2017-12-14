<template>
	<div id="mainapp" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<h4>Top Questions</h4>
	        </div>
	        <div class="col s12 m5 l3">
	        	<component :is="connected_topics" :merger-zites="mergerZites"></component>
	        </div>
	    </div>
	</div>
</template>

<script>
	var Router = require("../libs/router.js");
	var connectedTopics = require("../vue_components/connected_topics.vue");

	module.exports = {
		props: ["mergerZites"],
		name: "mainapp",
		data: () => {
			return {
				connected_topics: connectedTopics
			}
		},
		beforeMount: function() {
			this.$parent.$on("setMergerZites", this.manageMerger);

			// If mergerZites is empty
			if (this.mergerZites && Object.keys(this.mergerZites).length != 0 && this.mergerZites.constructor === Object) {
				this.manageMerger(this.mergerZites);
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
		methods: {
			manageMerger: function(mergerZites) {
				// Merger zites were successfully added
			},
			goto: function(to) {
				Router.navigate(to);
			}
		}
	}
</script>