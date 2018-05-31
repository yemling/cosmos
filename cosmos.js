var cosmos = {};
cosmos.graphTypes = [
	{
		tab:"Summary",
		id:'summaryGraphs',
		graphs:[
		{name:'VWC (hourly)',id:'COSMOS_VWC'},
		{name:'VWC (daily)',id:'COSMOS_VWC_1DAY'},
		{name:'Precipitation',id:'PRECIPITATION_LEVEL2'},
		{name:'Air temperature',id:'TA_LEVEL2'},
		{name:'Atmospheric pressure',id:'PA_LEVEL2'},
		{name:'Relative humidity',id:'RH_LEVEL2'},
		{name:'Absolute humidity',id:'Q_LEVEL2'},
		{name:'Wind speed',id:'WS_LEVEL2'},
		{name:'Wind direction',id:'WD_LEVEL2'},
		{name:'Net radiation',id:'RN_LEVEL2'},
		{name:'Potential evaporation',id:'PE_LEVEL2'}
		]
	},
	{
		tab:"Weather", 
		id:'weatherGraphs',
		graphs:[
		{name:'Precipitation',id:'PRECIPITATION_LEVEL2'},
		{name:'Air temperature',id:'TA_LEVEL2'},
		{name:'Relative humidity',id:'RH_LEVEL2'},
		{name:'Absolute humidity',id:'Q_LEVEL2'},
		{name:'Atmospheric pressure',id:'PA_LEVEL2'},
		{name:'Wind speed',id:'WS_LEVEL2'},
		{name:'Wind direction',id:'WD_LEVEL2'},
		{name:'Net radiation',id:'RN_LEVEL2'},
		{name:'Potential evaporation',id:'PE_LEVEL2'},
		{name:'X component of wind speed',id:'UX_LEVEL2'},
		{name:'Y component of wind speed',id:'UY_LEVEL2'},
		{name:'Z component of wind speed',id:'UZ_LEVEL2'}
		]
	},
	{
		tab:"Soil moisture", 
		id:'moistureGraphs',
		graphs:[
		{name:'VWC (hourly)',id:'COSMOS_VWC'},
		{name:'VWC (daily)',id:'COSMOS_VWC_1DAY'},
		{name:'COSMOS counts',id:'CTS_MOD_CORR_LEVEL2'},
		{name:'Effective depth',id:'D86_75M'},
		{name:'Precipitation',id:'PRECIPITATION_LEVEL2'},
		{name:'Potential evaporation',id:'PE_LEVEL2'},
		{name:'TDT soil moisture 1 (10cm)',id:'TDT1_VWC_LEVEL2'},
		{name:'TDT soil moisture 2 (10cm)',id:'TDT2_VWC_LEVEL2'}
		]
	},
	{
		tab:"Soil temperature", 
		id:'temperatureGraphs',
		graphs:[
		{name:'TDT soil temperature 1 (10cm)',id:'TDT1_TSOIL_LEVEL2'},
		{name:'TDT soil temperature 2 (10cm)',id:'TDT2_TSOIL_LEVEL2'},
		{name:'Soil temperature profile (2cm)',id:'STP_TSOIL2_LEVEL2'},
		{name:'Soil temperature profile (5cm)',id:'STP_TSOIL5_LEVEL2'},
		{name:'Soil temperature profile (10cm)',id:'STP_TSOIL10_LEVEL2'},
		{name:'Soil temperature profile (20cm)',id:'STP_TSOIL20_LEVEL2'},
		{name:'Soil temperature profile (50cm)',id:'STP_TSOIL50_LEVEL2'},
		{name:'Soil heat flux 1',id:'G1_LEVEL2'},
		{name:'Soil heat flux 2',id:'G2_LEVEL2'}
		]
	}
];
cosmos.graphParams = {};
cosmos.graphParams.height = 500;
cosmos.graphParams.width = 800;
cosmos.graphParams.days = 50;
cosmos.graphParams.endOffset = 0;
cosmos.graphParams.startDate = 0;
cosmos.graphParams.endDate = 30;
cosmos.graphParams.urlType = 'days';
cosmos.station = 'ALIC1';

cosmos.init = function()
{
	//jquery ui tabs for the details, graphs and maps tabs
	$("#stationTabs").tabs();
	$("#parameterTabs").tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $("#parameterTabs li").removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$('#graphsTabLink').click(cosmos.drawGraphs);
	cosmos.drawGraphContainer();
	//add a magnifying glass on the lightbox images
	$('figure').prepend('<i class="fa fa-search-plus"></i>');
	//featherlight doesn't add captions to images by default, so extra code here to add it from the alt text.
	$.featherlight.prototype.afterContent = function() {
	  var caption = this.$currentTarget.find('img').attr('alt');
	  this.$instance.find('.caption').remove();
	  $('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
	};
	var daysHandle = $( "#days-handle" );
	$( "#graphDays" ).slider({ 
		min: 1, 
		max: 180, 
		create: function()
		{
			daysHandle.text(cosmos.graphParams.days);
		},
		change: function(e,ui){
			cosmos.graphParams.days = ui.value;
			cosmos.graphParams.urlType = 'days';
			cosmos.drawGraphs();
			daysHandle.text(ui.value);
		}                
	});
	var endOffsetHandle = $( "#endOffset-handle" );
	$( "#endOffset" ).slider({ 
		min: 1, 
		max: 180, 
		create: function()
		{
			endOffsetHandle.text(cosmos.graphParams.endOffset);
		},
		change: function(e,ui){
			cosmos.graphParams.endOffset = ui.value;
			cosmos.drawGraphs();
			endOffsetHandle.text(ui.value);
			cosmos.graphParams.urlType = 'days';
		}                
	});
	var monthStartHandle = $( "#monthStart-handle" );
	var monthEndHandle = $( "#monthEnd-handle" );
	$( "#graphDates" ).slider({ 
		min: 0, 
		max: wrUtils.mapDates.length-1, 
		range:true,
		values:[cosmos.graphParams.startDate,cosmos.graphParams.endDate],
		create: function()
		{
			monthStartHandle.text(wrUtils.formatDate(cosmos.graphParams.startDate).shortDate);
			monthEndHandle.text(wrUtils.formatDate(cosmos.graphParams.endDate).shortDate);
		},
		change: function(e,ui){
			
			cosmos.graphParams.startDate = wrUtils.formatDate(ui.values[0]).shortDate;
			cosmos.graphParams.endDate = wrUtils.formatDate(ui.values[1]).shortDate;
			cosmos.drawGraphs();
			monthStartHandle.text(wrUtils.formatDate(ui.values[0]).shortDate);
			monthEndHandle.text(wrUtils.formatDate(ui.values[1]).shortDate);
			cosmos.graphParams.urlType = 'months';
		}                
	});
	$( ".monthStart" ).text(wrUtils.formatDate(0).shortDate);
	$( ".monthEnd" ).text(wrUtils.formatDate(wrUtils.mapDates.length-1).shortDate);
	cosmos.getStationData();
	return;
}
cosmos.getStationData = function()
{
	$.getJSON('data/cosmos-query-data.json',cosmos.outputStationData);
}
cosmos.outputStationData = function(stationData)
{
	var calibrated = 'No';
	if(stationData["calibrated"])
	{
		calibrated = 'Yes';
	}
	$('.siteName').text(stationData["site-name"]);
	$('#bng').text(stationData.easting+', '+stationData.northing);
	$('#latLng').text(stationData.latitude+', '+stationData.longitude);
	$('#region').text(stationData["site-metadata"]["nuts1-region"]);
	$('#lcm').text(stationData["site-metadata"]["bhab"]);
	$('#host').text(stationData["site-metadata"]["host-dclass"]);
	$('#superficalGeologyClass').text(wrUtils.autocase(stationData["site-metadata"]["rcs-d"]));
	$('#soilType').text(wrUtils.autocase(stationData["site-metadata"]["soil-type"]));
	$('#soilDepth').text(wrUtils.autocase(stationData["site-metadata"]["soil-depth"]));
	$('#bulkDensity').text(stationData["calibration-info"]["ref-bulk-density"]);
	$('#latticeWater').text(stationData["calibration-info"]["ref-lattice-water"]);
	$('#soilOrganicCarbon').text(stationData["calibration-info"]["ref-soil-organic-carbon"]);
	$('#calibrated').text(calibrated);
	$('#rainfall').text(stationData["site-metadata"]["saar"]);
	cosmos.drawMap(stationData);	
}
cosmos.drawMap = function(stationData)
{
	var markerIcon = L.icon({
		iconUrl: '/includes/images/redicon.png',
		iconSize: [10, 10],
		iconAnchor: [15, 15],
		popupAnchor: [-7, -12]
	});
	var stationCoords = [stationData.latitude,stationData.longitude];
	cosmos.map = L.map('mapid');
	cosmos.osMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiZ2VtbWF2bmFzaCIsImEiOiJjamdwNjR5YzMwZTc5MndtZDJteDFpY3lwIn0.3Exi_QhPZuuxHRcBXmpo5A'
	}).addTo(cosmos.map);
	cosmos.map.setView(stationCoords, 13);
	var marker = L.marker(stationCoords, {title:stationData["site-name"], icon:markerIcon}).addTo(cosmos.map);
	cosmos.getWMSlayers();
	return;
}
cosmos.getWMSlayers = function()
{
	var bgsSuperficialGeology = L.tileLayer.wms("https://map.bgs.ac.uk/arcgis/services/BGS_Detailed_Geology/MapServer/WMSServer", {
		layers: 'BGS.50k.Superficial.deposits',
		format: 'image/png',
		transparent: true,
		version: '1.3.0',
		opacity:0.5,
		attribution: "BGS superficial geology 50K"
	})
	.addTo(cosmos.map);

	return;
}
cosmos.drawGraphContainer = function()
{
	var i = 0;
	for (i; i< cosmos.graphTypes.length; i++)
	{
		var graphTab = cosmos.graphTypes[i];
		$('#graphTabLinks').append('<li><a href="#'+graphTab.id+'" class="groupedGraphsLink">'+graphTab.tab+'</a></li>');
		$('#graphContainer').append('<div id="'+graphTab.id+'" class="jTab groupedGraphs" />');
	}
	$( "#graphContainer" ).tabs();
	cosmos.graphTabID = $('div.groupedGraphs:first').attr('id');
	$('.groupedGraphsLink').click(function(){
		cosmos.graphTabID = $(this).attr('href').substring(1);
		cosmos.drawGraphs();
	});
	cosmos.drawGraphs();
	return;
}
cosmos.drawGraphs = function()
{
	var t = 0;
	var hasParams = false;
	$('.groupedGraphs').empty();
	//get the id of the graph type div container from the cosmos.graphTabID to add the images to
	var graphTab = $.grep(cosmos.graphTypes, function(obj){return obj.id === cosmos.graphTabID;})[0];
	//loop through the graphs for the particular graph type group
	for (t; t < graphTab.graphs.length; t++)
	{
		var graphType = graphTab.graphs[t];
		var graphSrc = 'http://nrfaapps.ceh.ac.uk/nrfa/image/cosmos/graph.png?db-level=2&site='+cosmos.station+'&h='+cosmos.graphParams.height+'&w='+cosmos.graphParams.width+'&parameter='+graphType.id;
		//either draw the days 
		if((cosmos.graphParams.days > 0 || cosmos.graphParams.endOffset > 0) && cosmos.graphParams.urlType === 'days')
		{
			graphSrc+='&days='+cosmos.graphParams.days+'&end-offset=-'+cosmos.graphParams.endOffset;
			hasParams = true;
		}
		//or the date range
		else if(cosmos.graphParams.startDate != 0 && cosmos.graphParams.endDate != 0 && cosmos.graphParams.urlType === 'months')
		{
			
			graphSrc+='&date='+cosmos.graphParams.startDate+'/'+cosmos.graphParams.endDate;
			hasParams = true;
		}
		if(hasParams)
		// draw the graphs from the web service.
		{
			$('#'+graphTab.id).append('<div id="graph'+graphType.id+'" class="leftCol33"><figure class="loading"><a href="'+graphSrc+'" data-featherlight="image" title="'+graphType.name+' for last '+cosmos.graphParams.days+' days"><img alt="'+graphType.name+' for last '+cosmos.graphParams.days+' days" /></a><figcaption>'+graphType.name+'</figcaption></figure></div>');
			$('#graph'+graphType.id).find('img').attr('src',graphSrc);
		}
	}
	return;
}
$(document).ready(cosmos.init);