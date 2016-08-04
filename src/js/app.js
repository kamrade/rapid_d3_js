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


// **********************************************   GLOBAL VARIABLES   ****************************
var width = 750,
	height = 300,
	margin = {top: 20, right: 20, bottom: 20, left: 70};

// **********************************************   CONNECT TO DOM   ****************************
var svg = d3.select("#results")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
;

// **********************************************   SCALING   ****************************
var x = d3.scale
	.ordinal()
	.rangeRoundBands([margin.left, width - margin.right], 0.1);

var y = d3.scale
	.linear()
	.range([height - margin.bottom, margin.top]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

// **********************************************   RELOAD   ****************************
var reload = function() {
	var data = [];
	d3.csv('afcw-results.csv', function(rows){
		redraw(rows);
	});
};

// **********************************************   REDRAW   ****************************
var redraw = function(data) {
	x.domain(data.map(function(d,i){ return i; }))
	y.domain([0, d3.max(data, function(d){return d.GoalsScored })]);

	var bars = svg.selectAll("rect.bar")
		.data(data);
	bars.enter()
		.append("rect")
		.classed("bar", true);
	bars
		.attr("x", function(d, i) { return x(i); })
		.attr("width", x.rangeBand())
		.attr("y", function(d){ return y(d.GoalsScored); })
		.attr("height", function(d) { return y(0) - y(d.GoalsScored); });

	// AXIS DATA
	var axisData = [
		{axis: xAxis, dx: 0, dy: (height - margin.bottom), clazz: 'x'},
		{axis: yAxis, dx: margin.left, dy: 0, clazz: 'y'}
	];
	var axis = svg.selectAll("g.axis")
		.data(axisData);
	axis.enter().append("g")
		.classed("axis", true);
	axis.each(function(d){
		d3.select(this)
			.attr("transform", "translate(" + d.dx + "," + d.dy + ")")
			.classed(d.clazz, true)
			.call(d.axis);
	});


};

reload();

