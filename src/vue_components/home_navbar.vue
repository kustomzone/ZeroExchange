<template>
	<ul id="topicNavbar" class="tabs tabs-fixed-width z-depth-2" style="background-color: #1976D2; margin-top: 10px; margin-bottom: 15px;">
		<li class="tab waves-effect waves-light"><a class="white-text" :class="{ 'active': isActive('top') }" v-on:click.prevent="tabClick('top')">Explore</a></li>
		<li class="tab waves-effect waves-light" v-if="false"><a class="white-text" :class="{ 'active': isActive('recent') }" v-on:click.prevent="tabClick('recent')">Recent</a></li>
		<li class="tab waves-effect waves-light" v-show="userInfo || active == 'mine'"><a class="white-text" :class="{ 'active': isActive('mine') }" v-on:click.prevent="tabClick('mine')">Mine</a></li>
		<li class="tab waves-effect waves-light"><a class="white-text" :class="{ 'active': isActive('search') }" v-on:click.prevent="tabClick('search')">Search</a></li>
	</ul>
</template>

<script>
	var Router = require("../libs/router.js");
	var M = require("materialize-css");

	module.exports = {
		props: ["userInfo", "active"],
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
					Router.navigate();
				} else {
					Router.navigate(tabName);
				}
				return false;
			}
		}
	};
</script>