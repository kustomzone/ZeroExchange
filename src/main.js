version = "0.1"

var anime = require("animejs");
window.anime = anime;
var Materialize = require("materialize-css/dist/js/materialize.min.js");

var ZeroFrame = require("./libs/ZeroFrame.js");
var Router = require("./libs/router.js");

var Vue = require("vue/dist/vue.min.js");

var VueZeroFrameRouter = require("./libs/vue-zeroframe-router.js");

var { sanitizeStringForUrl, sanitizeStringForUrl_SQL, html_substr, sanitizeHtmlForDb } = require("./util.js");

Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);

// Vue Components
var Navbar = require("./vue_components/navbar.vue");

var app = new Vue({
	el: "#app",
	template: `<div>
			<component ref="navbar" :is="navbar" :user-info="userInfo"></component>
			<component ref="view" :is="currentView" v-on:show-signin-modal="showSigninModal()" v-on:get-user-info="getUserInfo()" :user-info="userInfo" :merger-zites="mergerZites"></component>
		</div>`,
	data: {
		navbar: Navbar,
		currentView: null,
		siteInfo: null,
		userInfo: null,
		signin_modal_active: false,
		mergerZites: null
	},
	methods: {
		getUserInfo: function(f = null) { // TODO: This can be passed in a function as a callback
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
                return;
            }

            console.log("Getting User Info");

            var that = this;

            that.userInfo = {
                cert_user_id: that.siteInfo.cert_user_id,
                auth_address: that.siteInfo.auth_address//,
                //keyvalue: keyvalue
            };
            that.$emit("setUserInfo", that.userInfo);
            if (f !== null && typeof f === "function") f();

            // TODO: This Query isn't working!
            page.cmd("dbQuery", ["SELECT key, value FROM keyvalue LEFT JOIN json USING (json_id) WHERE cert_user_id=\"" + this.siteInfo.cert_user_id + "\" AND directory=\"users/" + this.siteInfo.auth_address + "\""], (rows) => {
                var keyvalue = {};

                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    
                    keyvalue[row.key] = row.value;
                }
                if (!keyvalue.name || keyvalue.name === "") {
                    return;
                }
                //console.log("TESTING")

                /*if (!keyvalue.languages || keyvalue.languages === "") { // TODO: Might not need this check (this was from ZeroMedium originally)
                    that.language_modal_active = true;
                    that.$on("setUserLanguages", (languages) => {
                        that.keyvalue.languages = languages;
                        cache_remove("home_topics");
                        that.$emit("setUserInfo", that.userInfo); // TODO: Not sure if I need this if I can pass in a function callback instead
                        if (f !== null && typeof f === "function") f();
                        if (Router.currentRoute == "") {
                            that.$refs.view.getTopics();
                        }
                        /*page.getTopics((topics) => {
                            console.log(topics);
                            cache_add("home_topics", topics);
                        });*/ /*
                    });
                } else {*/
                    that.$emit("setUserInfo", that.userInfo); // TODO: Not sure if I need this if I can pass in a function callback instead
                    //cache_remove("home_topics");
                    if (f !== null && typeof f === "function") f();
                    /*if (Router.currentRoute == "") {
                        that.$refs.view.getTopics();
                    }*/
                    /*page.getTopics((topics) => {
                        console.log(topics);
                        cache_add("home_topics", topics);
                    });*/
                //}
            });
        }
	}
});

class ZeroApp extends ZeroFrame {
	onOpenWebsocket() {
		var self = this;

		this.cmdp("siteInfo", {})
			.then(siteInfo => {
				self.siteInfo = siteInfo;
				app.siteInfo = siteInfo;
				app.getUserInfo();
				//self.cmdp("wrapperNotification", ["info", "Loaded!"]);
				self.requestPermission("Merger:ZeroExchange", siteInfo, function() {
					self.cmdp("mergerSiteList", [true])
						.then((mergerZites) => {
							console.log(mergerZites);
							if (!mergerZites["1HhFcVz9sKDYes1oM6pUbqoVDnURr48mky"]) {
								/*self.cmdp("mergerSiteAdd", ["1HhFcVz9sKDYes1oM6pUbqoVDnURr48mky"])
									.then(() => {
										self.cmdp("mergerSiteList", [true])
											.then((mergerZites) => {
												app.mergerZites = mergerZites;
											});
									});*/
								self.addMerger("1HhFcVz9sKDYes1oM6pUbqoVDnURr48mky");
							} else {
								app.mergerZites = mergerZites;
								app.$emit('setMergerZites', mergerZites);
							}
						});
				});
			});
	}

	requestPermission(permission, siteInfo, callback) {
		// Already have permission
		if (siteInfo.settings.permissions.indexOf(permission) > -1) {
			callback();
			return;
		}

		this.cmdp("wrapperPermissionAdd", [permission])
			.then(callback);
	}

	addMerger(ziteAddress) {
		var self = this;

		return this.cmdp("mergerSiteAdd", [ziteAddress])
			.then(() => {
				return self.cmdp("mergerSiteList", [true])
					.then((mergerZites) => {
						app.mergerZites = mergerZites;
						app.$emit('setMergerZites', mergerZites);
					});
			});
	}

	onRequest(cmd, message) {
		if (cmd === "setSiteInfo") {
			this.siteInfo = message.params;
			app.siteInfo = message.params;
			app.getUserInfo();
		}

		if (message.params.event[0] === "file_done") {
		}

		Router.listenForBack(cmd, message);
	}

	selectUser() {
		return this.cmdp("certSelect", { accepted_domains: ["zeroid.bit", "kaffie.bit", "cryptoid.bit", "peak.id"] });
    }

    signout() {
    	return this.cmdp("certSelect", { accepted_domains: [""] });
    }

    unimplemented() {
        return page.cmdp("wrapperNotification", ["info", "Unimplemented!"]);
    }

    postQuestion(currentTopicAddress, title, body, tags, beforePublishCB = null) {
    	if (!this.siteInfo.auth_address) {
    		return this.cmdp("wrapperNotification", ["error", "You must be logged in to make a post."]);
    	} else if (!Router.currentParams["topicaddress"] && !currentTopicAddress) {
    		return this.cmdp("wrapperNotification", ["error", "You must choose a topic to post to."]);
    	}

    	var data_inner_path = "merged-ZeroExchange/" + currentTopicAddress + "/data/users/" + this.siteInfo.auth_address + "/data.json";
    	var content_inner_path = "merged-ZeroExchange/" + currentTopicAddress + "/data/users/" + this.siteInfo.auth_address + "/content.json";

    	var self = this;
    	return this.cmdp("fileGet", { "inner_path": data_inner_path, "required": false })
    		.then((data) => {
    			data = JSON.parse(data);
    			if (!data) {
    				data = {};
    			}

    			if (!data["questions"]) data["questions"] = [];

    			var date = Date.now();

    			data["questions"].push({
    				"question_id": date,
    				"title": title,
    				"body": body,
    				"tags": tags,
    				"date_added": date
    			});

    			var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')));

    			return self.cmdp("fileWrite", [data_inner_path, btoa(json_raw)]);
    		}).then((res) => {
    			if (res === "ok") {
    				return self.cmdp("siteSign", { "inner_path": content_inner_path });
    			} else {
    				return self.cmdp("wrapperNotification", ["error", "Failed to write to data file."]);
    			}
    		}).then((res) => {
    			if (res === "ok") {
    				if (beforePublishCB != null && typeof beforePublishCB === "function") beforePublishCB();
    				return self.cmdp("sitePublish", { "inner_path": content_inner_path, "sign": false });
    			} else {
    				return self.cmdp("wrapperNotification", ["error", "Failed to sign user data."]);
    			}
    		});
    }

    getQuestionsUser(currentTopicAddress) {
    	var auth_address = this.siteInfo.auth_address;
    	var query = `
    		SELECT * FROM questions
	    		LEFT JOIN json USING (json_id)
	    		WHERE site='${currentTopicAddress}'
	    		AND directory='data/users/${auth_address}'
	    		ORDER BY date_added DESC
    	`;
    	return this.cmdp("dbQuery", [query]);
    }

    getQuestionsTopic(currentTopicAddress) {
    	var auth_address = this.siteInfo.auth_address;
    	var query = `
    		SELECT * FROM questions
	    		LEFT JOIN json USING (json_id)
	    		WHERE site='${currentTopicAddress}'
	    		ORDER BY date_added DESC
    	`;
    	return this.cmdp("dbQuery", [query]);
    }
}

page = new ZeroApp();

var Home = require("./router_pages/home.vue");
var TopicHome = require("./router_pages/topic_home.vue");
var TopicMine = require("./router_pages/topic_mine.vue");
var TopicAsk = require("./router_pages/topic_ask.vue");
var TopicSearch = require("./router_pages/topic_search.vue");
var About = require("./router_pages/about.vue");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
	{ route: "about", component: About },
	{ route: ":topicaddress/mine", component: TopicMine },
	{ route: ":topicaddress/ask", component: TopicAsk },
	{ route: ":topicaddress/search", component: TopicSearch },
	{ route: ":topicaddress", component: TopicHome },
	{ route: "", component: Home }
]);
