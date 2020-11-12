importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
	workbox.precaching.precacheAndRoute(
		[
			{ url: "/", revision: "1" },
			{ url: "/nav.html", revision: "1" },
			{ url: "/index.html", revision: "1" },
			{ url: "/detail.html", revision: "1" },
			{ url: "/manifest.json", revision: "1" },
			{ url: "/css/materialize.min.css", revision: "1" },
			{ url: "/css/custom.css", revision: "1" },
			{ url: "/icon/noimage.png", revision: "1" },
			{ url: "/js/materialize.min.js", revision: "1" },
			{ url: "/js/nav.js", revision: "1" },
			{ url: "/js/api.js", revision: "1" },
			{ url: "/js/idb.js", revision: "1" },
			{ url: "/js/db.js", revision: "1" },
			{ url: "/js/my.js", revision: "1" },
			{ url: "/js/my2.js", revision: "1" },
		],
		{ ignoreURLParametersMatching: [/.*/] }
	);

	workbox.routing.registerRoute(
		new RegExp("/pages/"),
		workbox.strategies.staleWhileRevalidate({
			cacheName: "pages",
		})
	);

	workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|svg)$/,
		workbox.strategies.cacheFirst({
			cacheName: "images",
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 60,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
				}),
			],
		})
	);

	workbox.routing.registerRoute(
		new RegExp("https://api.football-data.org/"),
		workbox.strategies.staleWhileRevalidate({
			cacheName: "football-api",
			plugins: [
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200],
				}),
			],
		})
	);

	workbox.routing.registerRoute(
		/.*(?:googleapis|gstatic)\.com/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: "google-fonts-stylesheets",
		})
	);

	workbox.routing.registerRoute(
		new RegExp("https://unpkg.com/"),
		workbox.strategies.staleWhileRevalidate({
			cacheName: "snarkdown",
		})
	);
} else console.log(`Workbox gagal dimuat`);

self.addEventListener("push", function (event) {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = "Push message no payload";
	}
	let options = {
		body: body,
		icon: "img/notification.png",
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(
		self.registration.showNotification("Push Notification", options)
	);
});
