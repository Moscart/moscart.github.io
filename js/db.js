let dbPromised = idb.open("football", 1, function (upgradeDb) {
	let teamsObjectStore = upgradeDb.createObjectStore("teams", {
		keyPath: "id",
	});
	teamsObjectStore.createIndex("name", "name", {
		unique: false,
	});
});

function saveForLater(data) {
	dbPromised
		.then(function (db) {
			let tx = db.transaction("teams", "readwrite");
			let store = tx.objectStore("teams");
			store.put(data);
			return tx.complete;
		})
		.then(function () {
			console.log("Data berhasil di simpan.");
		})
		.catch(function (e) {
			console.log(e);
		});
}

function getAll() {
	return new Promise(function (resolve, reject) {
		dbPromised
			.then(function (db) {
				let tx = db.transaction("teams", "readonly");
				let store = tx.objectStore("teams");
				return store.getAll();
			})
			.then(function (teams) {
				resolve(teams);
			});
	});
}

function getById(id) {
	return new Promise(function (resolve, reject) {
		dbPromised
			.then(function (db) {
				let tx = db.transaction("teams", "readonly");
				let store = tx.objectStore("teams");
				return store.get(parseInt(id));
			})
			.then(function (team) {
				resolve(team);
			});
	});
}

function deleteById(id) {
	return new Promise(function (resolve, reject) {
		dbPromised
			.then(function (db) {
				let tx = db.transaction("teams", "readwrite");
				let store = tx.objectStore("teams");
				return store.delete(parseInt(id));
			})
			.then(function (team) {
				resolve(team);
			});
	});
}
