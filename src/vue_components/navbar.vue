<template>
	<nav id="navbar" class="indigo darken-3">
		<div class="nav-wrapper">
			<div class="container">
				<a href="./?/" class="brand-logo" v-on:click.prevent="navbarLinkClick({ route: '' })">{{ ZiteName }}</a>
				<a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
				<!--<ul class="left">-->
				<!--</ul>-->
				<ul class="right hide-on-med-and-down">
					<li v-for="link in navbarLinks">
						<a :href="'./?/' + link.route" v-on:click.prevent="navbarLinkClick(link)">{{ link.name }}</a>
					</li>
					<li v-if="!isLoggedIn"><a v-on:click.prevent="login()">Login</a></li>
					<li v-else><a v-on:click.prevent="">{{ userInfo ? userInfo.cert_user_id : "" }}</a></li>
				</ul>
				<ul id="mobile-nav" class="sidenav">
					<li v-for="link in navbarLinks">
						<a :href="'./?/' + link.route" v-on:click.prevent="navbarLinkClick(link)">{{ link.name }}</a>
					</li>
					<li v-if="!isLoggedIn"><a v-on:click.prevent="login()">Login</a></li>
					<li v-else><a v-on:click.prevent="">{{ userInfo ? userInfo.cert_user_id : "" }}</a></li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
	var Router = require("../libs/router.js");
	var M = require("materialize-css");

	module.exports = {
		props: ["userInfo"],
		name: "navbar",
		data: () => {
			return {
				ZiteName: "ZeroExchange",
				navbarLinks: [
					{ name: "About", route: "about" },
				]
			}
		},
		mounted: function() {
			var elem = document.querySelector('.sidenav');
  			var instance = new M.Sidenav(elem, {
  				edge: "left",
  				draggable: true
  			});
			if (!this.userInfo) {
				/*this.$parent.on('setUserInfo', function() {
					// TODO
				});*/
			}
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			}
		},
		methods: {
			navbarLinkClick: function(link) {
				if (link.route !== null || link.route === "#") {
					Router.navigate(link.route);
				} else {
					link.onclick(this);
				}
			},
			login: function() {
				console.log("Login button clicked!");
				console.log(this.userInfo);
				page.selectUser();
				return false;
			}
		}
	}
</script>