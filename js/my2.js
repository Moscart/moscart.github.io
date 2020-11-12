document.addEventListener("DOMContentLoaded", function () {
	var urlParams = new URLSearchParams(window.location.search);
	var isFromSaved = urlParams.get("saved");
	var btnSave = document.getElementById("save");

	if (isFromSaved) {
		btnSave.innerHTML = "<i class='large material-icons'>delete</i>";
		var id = urlParams.get("id");

		getSavedDataById();

		btnSave.onclick = function () {
			M.toast({ html: "Data Deleted" });
			console.log("Tombol FAB di klik.");
			deleteById(id);
			btnSave.style.display = "none";
		};
	} else {
		var item = getDataById();
		btnSave.onclick = function () {
			M.toast({ html: "Data Saved" });
			console.log("Tombol FAB di klik.");
			item.then(function (data) {
				saveForLater(data);
			});
		};
	}
});
