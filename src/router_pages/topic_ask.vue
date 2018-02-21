<template>
	<div id="topicAsk" class="container">
		<div class="row">
	        <div class="col s12 m7 l9">
	        	<component :is="topic_navbar" active="ask" :user-info="userInfo"></component>
	        	<div class="card">
	        		<div class="card-content">
	        			<span class="card-title">{{ topicName }}Ask Question</span>
		        		<!-- Using form so I can get html5 form validation -->
		        		<form v-on:submit.prevent="postQuestion()">
			        		<div class="input-field">
			        			<input id="title" v-model="title" type="text" class="validate" required>
			        			<label for="title">Title *</label>
			        		</div>
			        		<div class="input-field">
			        			<textarea id="body" class="materialize-textarea validate" required v-model="body"></textarea>
			        			<label for="body">Question body *</label>
			        		</div>
							<div class="chips chips-placeholder" ref="tags" style="margin-bottom: 0;"></div>
							<small>Press enter to add tag</small><br>
							<br>
			        		<button type="submit" class="btn waves-effect waves-light" :class="{ 'disabled': submitBtnDisabled }">Submit</button>
							<br>
							<small><em style="text-color: red;">* required</em></small>
			        	</form>
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
	var TopicNavbar = require("../vue_components/topic_navbar.vue");
	var connectedTopics = require("../vue_components/connected_topics.vue");
	var M = require("materialize-css");

	module.exports = {
		props: ["userInfo", "mergerZites"],
		name: "topicAsk",
		data: () => {
			return {
				topic_navbar: TopicNavbar,
				connected_topics: connectedTopics,
				topicName: "",
				topicAddress: "",
				submitBtnDisabled: false,
				title: "",
				body: "",
				tagsInstance: ""
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
		mounted: function() {
			var tags = this.$refs.tags;
			this.tagsInstance = new M.Chips(tags, {
				placeholder: "Enter tags *",
				secondaryPlaceholder: "+Tag"
			});
		},
		methods: {
			manageMerger: function(mergerZites) {
				if (this.topicAddress !== "" && this.topicName !== "") return;
				var self = this;
				if (!mergerZites[Router.currentParams["topicaddress"]]) {
					page.addMerger(Router.currentParams["topicaddress"])
						.then((mergerZites) => {
							self.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
							self.topicAddress = Router.currentParams["topicaddress"];
						}); // This will emit the 'setMergerZites' function, which will call the managerMerger function again.
				} else {
					this.topicName = mergerZites[Router.currentParams["topicaddress"]].content.title + " - ";
					this.topicAddress = Router.currentParams["topicaddress"];
				}
			},
			goto: function(to) {
				Router.navigate(to);
			},
			postQuestion: function() {
				if (!this.topicAddress || this.title === "" || this.body === "" || this.tagsInstance.chipsData.length == 0) return;
				this.submitBtnDisabled = true;

				var self = this;

				var tags = "";
				for (var i = 0; i < this.tagsInstance.chipsData.length; i++) {
					var chip = this.tagsInstance.chipsData[i];
					if (i == 0) {
						tags += chip.tag;
					} else {
						tags += "," + chip.tag;
					}
				}

				page.postQuestion(this.topicAddress, this.title, this.body, tags, (info) => {
					self.submitBtnDisabled = false;
					Router.navigate(self.topicAddress + "/" + info["auth_address"] + "/" + info["id"]);
				});
			}
		}
	}
</script>