<template>
	<div id="connectedTopics">
    	<div class="card">
    		<div class="card-content">
	        	<span class="card-title center-align">Connected Topics</span>
	        	<ul class="collection">
					<a class="collection-item center-align" :class="{ 'active': isActive() }" href="./?/" v-on:click.prevent="goto('')">All</a>
	        		<a class="collection-item center-align" :class="{ 'active': isActive(zite.address) }" v-for="zite in mergerZiteValues" :href="'./?/' + zite.address">{{ zite.content.title }}</a>
	        	</ul>
	        	<div class="center-align">
	        		<a href="./?/top-available" v-on:click.prevent="goto('top-available')">Top Available Topics</a>
	        	</div>
	        </div>
        </div>
	</div>
</template>

<script>
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["mergerZites"],
		name: "connectedTopics",
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
			isActive: function(address) {
				if (Router.currentRoute === "/" && !Router.currentParams["topicaddress"]) return true;
				return Router.currentParams["topicaddress"] === address;
			},
			goto: function(to) {
				Router.navigate(to);
			}
		}
	};
</script>