<template>
	<div id="mainapp" class="container">
	  <md-whiteframe class="main-header">
	    <md-toolbar class="md-large">
	      <div class="page-wrapper">
	        <div class="md-toolbar-container">
	          <md-button class="main-menu-trigger md-icon-button" @click.native="toggleSidenav">
	            <md-icon md-src="assets/icon-menu.svg" />
	          </md-button>

	          <md-icon md-src="assets/icon-github.svg" />

	          <h1 class="md-title md-flex">Vue Material {{ test }}</h1>

	          <nav class="main-navigation">
	            <md-button class="md-dense">Pull requests</md-button>
	            <md-button class="md-dense">Issues</md-button>
	            <md-button class="md-dense">Trending</md-button>
	            <md-button class="md-dense">Gist</md-button>
	          </nav>
	        </div>

	        <div class="md-toolbar-container">
	          <md-tabs md-theme="alternative" @change="changeTab">
	            <md-tab v-for="item in nav" :key="item.url" :md-label="$t(item.label)" />
	          </md-tabs>
	        </div>
	      </div>
	    </md-toolbar>
	  </md-whiteframe>

	  <md-sidenav class="main-sidenav md-left md-fixed" ref="sideNav">
	    <md-list>
	      <md-list-item v-for="item in nav" :key="item.url">
	        <router-link exact :to="item.url">
	          <md-icon :md-src="`assets/icon-${item.icon}.svg`" />
	          <span>Test</span>
	        </router-link>
	      </md-list-item>
	    </md-list>
	  </md-sidenav>

	  <router-view />

	  <md-speed-dial md-open="hover" class="md-fab-bottom-right">
	    <md-button class="md-fab" md-fab-trigger>
	      <md-icon md-icon-morph md-src="assets/icon-code.svg" />
	      <md-icon md-src="assets/icon-add.svg" />
	    </md-button>

	    <md-button class="md-fab md-primary md-mini md-clean">
	      <md-icon md-src="assets/icon-note.svg" />
	    </md-button>

	    <md-button class="md-fab md-primary md-mini md-clean">
	      <md-icon md-src="assets/icon-work.svg" />
	    </md-button>
	  </md-speed-dial>
	</div>
</template>

<script>
	module.exports = {
		name: "mainapp",
		data: () => {
			return {
				test: "Testing Data!"
			}
		}
	}
</script>