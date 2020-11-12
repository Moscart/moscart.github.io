let webPush = require("web-push");

const vapidKeys = {
	publicKey:
		"BHKKt_V-TVe4asij54KF7ZvvjTjcMeNvj8g4SPatNagIVSQPO2Rx8PrNIrzEVeYi7gavFg5M820mq200KYQnUqU",
	privateKey: "nrE4PKcoZ01VyD21ggK8BZDtpooYxfg0hwlVfuDbUyM",
};

webPush.setVapidDetails(
	"mailto:example@yourdomain.org",
	vapidKeys.publicKey,
	vapidKeys.privateKey
);
let pushSubscription = {
	endpoint:
		"https://fcm.googleapis.com/fcm/send/fbjIK9ac5-8:APA91bEFMVToHlQOpZ-hSHElII_YAo7eOPl-T1Oq2l7Bjj0ZnAhA5Ai_tSfe-8krFKVds8Rxg-yrvq1CMAEuxqbY6BiMHSz4KQ81eahfu6hqzjMwPiYEsuwXUxBeL7xyEDI1bAoxPV9W",
	keys: {
		p256dh:
			"BCEkiweiSk519S9goTSF49sXTyD60QhAcmqRw+JL//AujQTQ7WjcJRikoGyXbRp34xNFKSNVoEPOdQR4whbWh3Y=",
		auth: "qsRSp7Pajvm4Ob2aqS4KJg==",
	},
};
let payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

let options = {
	gcmAPIKey: "612675961883",
	TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
