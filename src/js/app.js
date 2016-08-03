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

var position = { G:"Goalkeeper", D:"Defender", M:"Midfielder", F:"Forward" };
var columns = [ "No", "Name", "Team", "Pos" ];
var data = [];


var table = d3.select('#roster')
	.append('table')
	.classed('table', true);

var thead = table.append('thead').append('tr');
var tbody = table.append('tbody');

var reload = function(){
	d3.tsv('eng2-rosters.tsv', function(rows){
		data = rows;
		data.forEach(function(d){
			d.Pos = position[d.Pos];
		});
		columns = d3.map(data[0]).keys();
		redraw();
	});
};

var redraw = function(){
	thead.selectAll("th")
		.data(columns)
		.enter()
		.append("th")
		.text(function(d){ return d; });

	var rows = tbody.selectAll("tr")
		.data(data);

	rows.enter().append("tr");
	rows.exit().remove();

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

reload();