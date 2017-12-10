<template>
	<div id="mainapp" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<h4>Top Questions</h4>
	        </div>
	        <div class="col s12 m5 l3">
	        	<h5>Topics</h5>
	        	<ul class="collection">
	        		<a class="collection-item" :class="{ 'active': isActive(zite.address) }" v-for="zite in mergerZiteValues" :href="'./?/' + zite.address" v-on:click.prevent="goto(zite.address)">{{ zite.content.title }}</a>
	        	</ul>
	        </div>
	    </div>
	</div>
</template>

<script>
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["mergerZites"],
		name: "mainapp",
		data: () => {
			return {
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
			console.log(Router.currentParams["topicaddress"]);
			if (!this.mergerZites[Router.currentParams["topicaddress"]]) {
				page.addMerger(Router.currentParams["topicaddress"]);
			}
		},
		methods: {
			goto: function(to) {
				Router.navigate(to);
			},
			isActive: function(address) {
				return Router.currentParams["topicaddress"] === address;
			}
		}
	}
</script>