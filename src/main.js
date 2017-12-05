version = "0.1"

var ZeroFrame = require("./libs/ZeroFrame.js");
var Router = require("./libs/router.js");

var Vue = require("vue/dist/vue.min.js");

var App = require('./app.vue');

var VueZeroFrameRouter = require("./libs/vue-zeroframe-router.js");
var VueMaterial = require("vue-material/dist/vue-material");

var { sanitizeStringForUrl, sanitizeStringForUrl_SQL, html_substr, sanitizeHtmlForDb } = require("./util.js");


Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);
Vue.use(VueMaterial);
//Vue.use(VueMaterial);
//require('vue-material/dist/vue-material.css');

var app = new Vue({
	el: "#app",
	template: `<App />`,
	data: {
		currentView: null,
		siteInfo: null,
		userInfo: null
	},
	components: { App }
});

class ZeroApp extends ZeroFrame {
	onOpenWebsocket() {
		var self = this;

		this.cmdp("siteInfo", {})
			.then(siteInfo => {
				self.siteInfo = siteInfo;
				app.siteInfo = siteInfo;
				//app.getUserInfo();
				self.cmdp("wrapperNotification", ["info", "Loaded!"]);
			});
	}

	onRequest(cmd, message) {
		if (cmd === "setSiteInfo") {
			this.siteInfo = message.params;
			app.siteInfo = message.params;
			//app.getUserInfo();
		}

		if (message.params.event[0] === "file_done") {
		}

		Router.listenForBack(cmd, message);
	}

	selectUser() {
		return this.cmdp("certSelect", { accepted_domains: ["zeroid.bit", "kaffie.bit", "cryptoid.bit"] });
    }

    signout() {
    	return this.cmdp("certSelect", { accepted_domains: [""] });
    }

    unimplemented() {
        return page.cmdp("wrapperNotification", ["info", "Unimplemented!"]);
    }
}

page = new ZeroApp();

var Home = require("./router_pages/home.js");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
	{ route: "", component: Home }
]);