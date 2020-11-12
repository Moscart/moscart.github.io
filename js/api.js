let base_url = " https://api.football-data.org/v2/";
const fetchApi = (url) => {
	return fetch(url, {
		headers: {
			"X-Auth-Token": "1505609154ff485388596eaba852c1ae",
		},
	});
};
function status(response) {
	if (response.status !== 200) {
		console.log("Error : " + response.status);
		return Promise.reject(new Error(response.statusText));
	} else {
		return Promise.resolve(response);
	}
}
function json(response) {
	return response.json();
}
function error(error) {
	console.log("Error : " + error);
}
function getData(endpoint) {
	fetchApi(base_url + endpoint)
		.then(status)
		.then(json)
		.then(function (data) {
			let teamsHTML = "";
			data.standings.forEach(function (teams) {
				if (teams.type === "TOTAL") {
					teams.table.forEach(function (data) {
						teamsHTML += getDataCard(data);
					});
				}
			});
			document.getElementById("data").innerHTML = teamsHTML;
		})
		.catch(error);
}

function getDataById() {
	return new Promise(function (resolve, reject) {
		let urlParams = new URLSearchParams(window.location.search);
		let idParam = urlParams.get("id");
		let saved = {};
		fetchApi(base_url + "teams/" + idParam)
			.then(status)
			.then(json)
			.then(function (data) {
				let dataHTML = getDataByIdCard(data);
				document.getElementById("body-content").innerHTML = dataHTML;

				let competitionsHTML = "";
				data.activeCompetitions.forEach(function (competitions) {
					competitionsHTML += `
						<tr style="border-color: white">
							<td>${competitions.name}</td>
							<td>${competitions.area.name}</td>
						</tr>
					`;
					document.getElementById("competitions").innerHTML = competitionsHTML;
				});

				let playersHTML = "";
				data.squad.forEach(function (players) {
					playersHTML += `
						<tr style="border-color: white">
							<td>${players.name}</td>
							<td>${players.position}</td>
							<td>${players.role}</td>
							<td>${players.dateOfBirth}</td>
							<td>${players.nationality}</td>
						</tr>
					`;
					document.getElementById("players").innerHTML = playersHTML;
				});

				let elems = document.querySelectorAll(".collapsible");
				let instances = M.Collapsible.init(elems, {
					accordion: false,
				});
				saved = { ...data };
			})
			.catch(error);
		fetchApi(base_url + "teams/" + idParam + "/matches?status=SCHEDULED")
			.then(status)
			.then(json)
			.then(function (data) {
				let matchHTML = "";
				data.matches.forEach(function (match) {
					matchHTML += `
						<tr style="border-color: white">
							<td>${match.utcDate}</td>
							<td>${match.homeTeam.name}</td>
							<td>VS</td>
							<td>${match.awayTeam.name}</td>
						</tr>
					`;
					document.getElementById("match").innerHTML = matchHTML;
				});
				saved = { ...saved, ...data };
				resolve(saved);
			})
			.catch(error);
	});
}

function getSavedData() {
	getAll().then(function (teams) {
		if (teams.length) {
			let teamsHTML = "";
			teams.forEach(function (data) {
				teamsHTML += `
				<div class="col s12 m6 l3">
					<div class="card z-depth-3">
						<div class="card-image" style="padding: 20px">
							<img
								src="${data.crestUrl}"
								style="
									height: 100px;
									width: 100px;
									margin-left: auto;
									margin-right: auto;
								"
								onerror="src='icon/noimage.png'"
								alt="badge"
							/>
						</div>
						<div class="card-content blue-grey darken-3 white-text center">
							<h6 class="truncate">${data.name}</h6>
							<br />
							<a class="waves-effect waves-light btn light-blue accent-3" href="./detail.html?id=${data.id}&saved=true">VIEW</a>
						</div>
					</div>
				</div>
				  `;
			});
			document.getElementById("saved").innerHTML = teamsHTML;
		}
	});
}

function getSavedDataById() {
	let urlParams = new URLSearchParams(window.location.search);
	let idParam = urlParams.get("id");
	getById(idParam).then(function (data) {
		let dataHTML = getDataByIdCard(data);
		document.getElementById("body-content").innerHTML = dataHTML;

		let competitionsHTML = "";
		data.activeCompetitions.forEach(function (competitions) {
			competitionsHTML += `
				<tr style="border-color: white">
					<td>${competitions.name}</td>
					<td>${competitions.area.name}</td>
				</tr>
			`;
			document.getElementById("competitions").innerHTML = competitionsHTML;
		});

		let playersHTML = "";
		data.squad.forEach(function (players) {
			playersHTML += `
				<tr style="border-color: white">
					<td>${players.name}</td>
					<td>${players.position}</td>
					<td>${players.role}</td>
					<td>${players.dateOfBirth}</td>
					<td>${players.nationality}</td>
				</tr>
			`;
			document.getElementById("players").innerHTML = playersHTML;
		});

		let elems = document.querySelectorAll(".collapsible");
		let instances = M.Collapsible.init(elems, {
			accordion: false,
		});

		let matchHTML = "";
		data.matches.forEach(function (match) {
			matchHTML += `
				<tr style="border-color: white">
					<td>${match.utcDate}</td>
					<td>${match.homeTeam.name}</td>
					<td>VS</td>
					<td>${match.awayTeam.name}</td>
				</tr>
			`;
			document.getElementById("match").innerHTML = matchHTML;
		});

		let breadHTML = `
			<div class="col s12 m6 l3">
				<div class="card z-depth-3" style="line-height: 30px">
					<div class="card-content blue-grey darken-3">
						<a href="./#saved" class="breadcrumb">Saved</a>
						<a href="#" class="breadcrumb">${data.name}</a>
					</div>
				</div>
			</div>
		`;
		document
			.getElementById("body-content")
			.insertAdjacentHTML("afterbegin", breadHTML);
	});
}

function getDataCard(data) {
	return `
	<div class="col s12 m6 l3">
		<div class="card z-depth-3">
			<div class="card-image" style="padding: 20px">
				<img
					src="${data.team.crestUrl}"
					style="
						height: 100px;
						width: 100px;
						margin-left: auto;
						margin-right: auto;
					"
					onerror="src='icon/noimage.png'"
					alt="badge"
				/>
			</div>
			<div class="card-content blue-grey darken-3 white-text center">
				<h6 class="truncate">${data.team.name}</h6>
				<table class="centered highlight">
					<thead>
						<tr style="border-color: white">
							<th>Won</th>
							<th>Draw</th>
							<th>Lost</th>
						</tr>
					</thead>
					<tbody>
						<tr style="border-color: white">
							<td>${data.won}</td>
							<td>${data.draw}</td>
							<td>${data.lost}</td>
						</tr>
						<tr style="border-color: white">
							<td colspan="3">${data.points} Pts</td>
						</tr>
					</tbody>
				</table>
				<br />
				<a class="waves-effect waves-light btn light-blue accent-3" href="./detail.html?id=${data.team.id}">VIEW</a>
			</div>
		</div>
	</div>
	`;
}

function getDataByIdCard(data) {
	return `
	<div class="col s12 m6 l3">
		<div class="card z-depth-3">
			<div class="card-image" style="padding: 20px">
				<img
					src="${data.crestUrl}"
					style="
						height: 100px;
						width: 100px;
						margin-left: auto;
						margin-right: auto;
					"
					onerror="src='icon/noimage.png'"
					alt="badge"
				/>
			</div>
			<div class="card-content blue-grey darken-3 white-text center">
				<h3 class="truncate">${data.name}</h3>
				<br />
				<ul class="collapsible expandable">
					<li class="active">
						<div class="collapsible-header blue-grey darken-2">
							Information
						</div>
						<div class="collapsible-body blue-grey darken-1">
							<table>
								<tbody>
									<tr style="border-color: white">
										<th scope="row">Name</th>
										<td>${data.name}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Short Name</th>
										<td>${data.shortName}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Founded</th>
										<td>${data.founded}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Club Colors</th>
										<td>${data.clubColors}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Venue</th>
										<td>${data.venue}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Website</th>
										<td>${data.website}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Email</th>
										<td>${data.email}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Phone</th>
										<td>${data.phone}</td>
									</tr>
									<tr style="border-color: white">
										<th scope="row">Address</th>
										<td>${data.address}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</li>
					<li>
						<div class="collapsible-header blue-grey darken-2">
							Active Competitions
						</div>
						<div class="collapsible-body blue-grey darken-1">
							<table>
								<thead>
									<tr style="border-color: white">
										<th>Competition</th>
										<th>Country</th>
									</tr>
								</thead>
								<tbody id="competitions"></tbody>
							</table>
						</div>
					</li>
					<li>
						<div class="collapsible-header blue-grey darken-2">Players</div>
						<div class="collapsible-body blue-grey darken-1">
							<table class="responsive-table">
								<thead>
									<tr style="border-color: white">
										<th>Name</th>
										<th>Position</th>
										<th>Role</th>
										<th>Birth Date</th>
										<th>Nationality</th>
									</tr>
								</thead>
								<tbody id="players"></tbody>
							</table>
						</div>
					</li>
					<li>
						<div class="collapsible-header blue-grey darken-2">
							Match Schedule
						</div>
						<div class="collapsible-body blue-grey darken-1">
							<table class="responsive-table centered">
								<thead>
									<tr style="border-color: white">
										<th>Date</th>
										<th>Home</th>
										<th></th>
										<th>Away</th>
									</tr>
								</thead>
								<tbody id="match"></tbody>
							</table>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	`;
}
