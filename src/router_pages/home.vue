<template>
	<div id="mainapp" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<h4>Top Questions</h4>
	        </div>
	        <div class="col s12 m5 l3">
	        	<h5 class="center-align">Connected Topics</h5>
	        	<ul class="collection">
	        		<a class="collection-item center-align" v-for="zite in mergerZiteValues" :href="'./?/' + zite.address" v-on:click.prevent="goto(zite.address)">{{ zite.content.title }}</a>
	        	</ul>
	        	<div class="center-align">
	        		<a href="#" style="">Top Available Topics</a>
	        	</div>
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
		methods: {
			goto: function(to) {
				Router.navigate(to);
			}
		}
	}
</script>