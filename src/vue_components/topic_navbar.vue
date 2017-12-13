<template>
	<ul id="topicNavbar" class="tabs tabs-fixed-width z-depth-2" style="background-color: #1976D2; margin-top: 10px; margin-bottom: 10px;">
		<li class="tab waves-effect waves-light"><a class="white-text" :class="{ 'active': isActive('top') }" v-on:click.prevent="tabClick('top')">Top</a></li>
		<li class="tab waves-effect waves-light"><a class="white-text" :class="{ 'active': isActive('mine') }" v-on:click.prevent="tabClick('mine')">Mine</a></li>
		<li class="tab waves-effect waves-light"><a class="white-text" :class="{ 'active': isActive('ask') }" v-on:click.prevent="tabClick('ask')">Ask</a></li>
		<li class="tab waves-effect waves-light"><a class="white-text" :class="{ 'active': isActive('search') }" v-on:click.prevent="tabClick('search')">Search</a></li>
	</ul>
</template>

<script>
	var Router = require("../libs/router.js");
	var M = require("materialize-css");

	module.exports = {
		props: ['active'],
		name: 'topicNavbar',
		mounted: function() {
			//$("ul.tabs").tabs();
			var elem = document.querySelector("ul.tabs");
			var instance = new M.Tabs(elem, {});
		},
		methods: {
			isActive: function(tabName) {
				return tabName == this.active;
			},
			tabClick: function(tabName) {
				if (tabName === this.active) return false; // TODO: Do refresh here instead? Router.refresh() 
				if (tabName === "top") {
					Router.navigate(Router.currentParams["topicaddress"]);
				} else {
					Router.navigate(Router.currentParams["topicaddress"] + "/" + tabName);
				}
				return false;
			}
		}
	};
</script>