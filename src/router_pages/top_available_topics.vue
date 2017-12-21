<template>
	<div id="topAvailable" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<div class="card">
	        		<div class="card-content">
	        			<span class="card-title">Top Available Topics</span>
	        			<div class="row">
		        			<div class="col s12 l6 collection">
			        			<div class="collection-item" v-for="topic in getFirstHalfTopics">
			        				<h6><a :href="'./?/' + topic.address" v-on:click.prevent="goto(topic.address)">{{ topic.name }}</a></h6>
			        				<small>Maintainer: {{ topic.maintainer }}</small>
			        			</div>
			        		</div>
			        		<div class="col s12 l6 collection">
			        			<div class="collection-item" v-for="topic in getSecondHalfTopics">
			        				<h6><a :href="'./?/' + topic.address" v-on:click.prevent="goto(topic.address)">{{ topic.name }}</a></h6>
			        				<small>Maintainer: {{ topic.maintainer }}</small>
			        			</div>
			        		</div>
			        	</div>
	        			<small><a>Request a topic be added by ZeroMailing me at krixano@zeroid.bit</a></small>
	        		</div>
	        	</div>
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
		props: ["userInfo", "mergerZites"],
		name: "topAvailable",
		data: () => {
			return {
				connected_topics: connectedTopics,
				topics: [
					{ address: "1KkJtNt2WT7QXaa4L9iPKE6Ec3E5LM4GX3", name: "ZeroExchange Meta", description: "Testing!", maintainer: "Krixano" },
					{ address: "1HfXMzGHoz36sQBw7WqLSdxwq1agwWVR27", name: "Development", description: "", maintainer: "Krixano" },
					{ address: "1G3ZY8Un3GzB5U3ud9A3ddpng4dFRmmuC6", name: "Development Meta", description: "", maintainer: "Krixano" },
					{ address: "17PRT7jHB4TN1PMzgWbxDQYrUnWKX2bNcM", name: "Sandbox", description: "", maintainer: "Krixano" }
				]
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
			getFirstHalfTopics: function() {
				return this.topics.slice(0, (this.topics.length / 2) + 1);
			},
			getSecondHalfTopics: function() {
				return this.topics.slice((this.topics.length / 2) + 1);
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
				// Merger zites were successfully added
			},
			goto: function(to) {
				Router.navigate(to);
			}
		}
	}
</script>