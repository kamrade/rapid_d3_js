var $c_01 = '#4080ff',
	$c_02 = '#1abc9c',
	$c_03 = '#e2234c';

var $c_white = '#fff',
	$c_bg_light = '#f5f8fd',
	$c_border_light = '#d8e1ea',
	$c_text_light_01 = '#778796',
	$c_bg_dark_selected = '#555e75',
	$c_bg_dark_main = '#383f52';

console.log( "D3 version: " + d3.version );

var width = 800,
	height = 600;

// START HERE
// **********************************************************
// ==========================================================

// OPTIONS

// PROCESS UTILITES
var position = { G:"Goalkeeper", D:"Defender", M:"Midfielder", F:"Forward" };
// var columns = ["No", "Name", "Pos"];
var columns = [];
var data = [];
var teams = [];


// INITIALIZATIONS
var table = d3.select('#roster')
	.append('table')
	// добавляет класс
	.classed('table', true);
	// .classed('table-striped', true);

var thead = table.append('thead').append('tr');
var tbody = table.append('tbody');

// добавление фильтра select и обработчика, который при изменении значения
// фильтрует содержимое таблицы
var teamSelector = d3.select("#page-title")
	.append("select")
	.on("change", function() { selectTeam( this.value ); })
	.attr("id", "team-selector");

// RELOAD DATA
var reload = function(){
	d3.tsv('eng2-rosters.tsv', function(rows){
		data = rows;
		data.forEach(function(d){
			d.Pos = position[d.Pos];
			
			if(teams.indexOf(d.TeamID) < 0) {
				teams.push(d.TeamID);
				teams[d.TeamID] = d.Team;
			};
		});
		// d3.map от data[0] берет первый элемент из data и превращает его в объект d3
		// где в его свойстве _ (underscore) хранятся данные и еще есть методы из d3
		// например keys - который достает из этого объекта все названия полей
		// таким образом мы получаем заголовки колонок
		columns = d3.map(data[0]).keys();
		// в итоге мы получаем массив columns с заголовками колонок
		// и массив объектов data со всеми данными
		// теперь можно перерисовывать
		teamSelector.selectAll("option")
			.data(teams)
			.enter()
			.append("option")
			.attr("value", function(d){ return d; })
			.text(function(d){ return teams[d]; })
			.sort(function(a, b){ return d3.ascending(a, b); });

		selectTeam("afc-wimbledon");
	});
};

// REDRAW TABLE IN BROWSER
var redraw = function(roster){
	// заполняем заголовки
	thead.selectAll("th")
		.data(columns)
		.enter()
		.append("th")
		// Обработчик события по клику по <TH> - заголовку колонки
		// Сортировка
		.on("click", function(d){
			tbody.selectAll("tr")
				.sort(function(a, b){
					return (d === 'No')
					? d3.ascending(+a[d], +b[d])
					: d3.ascending(a[d], b[d]);
				})
				.style('background-color', function(d, i){
					return(i%2)? 'white':'lightgray';
				});
		})
		.text(function(d){ return d; });

	var rows = tbody.selectAll("tr")
		.data(roster);

	rows.enter().append("tr")
		.style('background-color', function(d, i){
			return(i%2)? 'white':'lightgray';
		});
	rows.exit().remove();

	// Мы наполняем переменную cell tr-ками(rows), а каждую tr-ку в свою очередь забиваем td-шками
	// Причем в каждую tr кладем столько td, сколько у нас columns-ов, тоесть колонок.
	// Получаем полную структуру, которую потом заливаем текстом.
	var cells = rows.selectAll("td")
		.data(function(row){
			var values = [];
			columns.forEach(function(d){
				values.push(row[d]);
			});
			return values;
		});
	cells.enter().append("td");
	cells.text(function(d){ return d; });
};

// Функция фильтра выбора команды
var selectTeam = function(teamId) {
	var roster = data.filter(function(d) {
		return d["TeamID"] == teamId;
	});
	d3.select("#team-name").text(teams[teamId] + " Roster");
	document.getElementById('team-selector').value = teamId;
	redraw(roster);
};

reload();