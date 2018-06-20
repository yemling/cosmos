var cosmos = {};
cosmos.relativeUrl = 'http://localhost:8080/';
//cosmos.relativeUrl = 'http://wlarcgis2.nerc-wallingford.ac.uk/cosmos/';
cosmos.stylesheets = [cosmos.relativeUrl + '/includes/map.css', cosmos.relativeUrl + '/includes/loading.css', '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css', 'https://use.fontawesome.com/releases/v5.0.13/css/all.css', cosmos.relativeUrl + '/includes/featherlight.css', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css', cosmos.relativeUrl + '/includes/Control.MiniMap.min.css', cosmos.relativeUrl + '/includes/slick.css', cosmos.relativeUrl + '/includes/slick-theme.css'];
//use the below if on Drupal server
/* (function($){
	 Drupal.behaviors.jspageLoad = {
		attach: function(context, settings) {
		  var jspage = jQuery('#' + settings.jspage.divId);
		  jspage.once('jspageLoad', function() {
			    jspage.empty();
				cosmos.station = settings.jspage.param0;
				cosmos.getStyleSheets();
				//give stylesheets chance to load.
				setTimeout(function () {
					cosmos.getStationData();
					wrUtils.init();
			},  1000);
		  });
		}
	} 
})(jQuery); */
//use the below if no Drupal connection
cosmos.init = function () {
	cosmos.station = 'COCLP';
	cosmos.getStyleSheets();
	cosmos.getStationData();
	wrUtils.init();
	return;
}
$(document).ready(cosmos.init);
cosmos.getStyleSheets = function () {
	for (var l = 0; l < cosmos.stylesheets.length; l++) {
		jQuery('head').append('<link href="' + cosmos.stylesheets[l] + '" type="text/css" rel="stylesheet" />');
	}
	return;
}
cosmos.renderPage = function () {
	var defaultHtml = "";
	defaultHtml += '<div id=\"loadingBackground\"> </div>\n';
	defaultHtml += '<div id=\"bowlG\">\n';
	defaultHtml += '  <div id=\"bowl_ringG\">\n';
	defaultHtml += '    <div class=\"ball_holderG\">\n';
	defaultHtml += '      <div class=\"ballG\"> </div>\n';
	defaultHtml += '    </div>\n';
	defaultHtml += '  </div>\n';
	defaultHtml += '</div>\n';
	defaultHtml += '<noscript>\n';
	defaultHtml += 'Please enable JavaScript to use this page\n';
	defaultHtml += '</noscript>\n';
	defaultHtml += '<h1>COSMOS-UK site — <span class=\"siteName\"></span></h1>\n';
	defaultHtml += '<div id=\"stationTabs\">\n';
	defaultHtml += '	<ul>\n';
	defaultHtml += '		<li><a href=\"#details\" id=\"detailsTabLink\">Site details</a></li>\n';
	defaultHtml += '		<li><a href=\"#graphs\" id=\"graphsTabLink\">Graphs</a></li>\n';
	defaultHtml += '	</ul>\n';
	defaultHtml += '  <div id=\"details\" class=\"jTab\">\n';
	defaultHtml += '    <h2>Site details</h2>\n';
	defaultHtml += '    <div class=\"leftCol50\">\n';
	defaultHtml += '      <table>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th width="30%">Site name</th>\n';
	defaultHtml += '          <td class=\"siteName\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Easting, northing</th>\n';
	defaultHtml += '          <td id=\"bng\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <!-- probably not needed <tr>\n';
	defaultHtml += '          <th> Site NGR</th>\n';
	defaultHtml += '          <td id=\"ngr\"></td>\n';
	defaultHtml += '        </tr> -->\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Latitude, longitude</th>\n';
	defaultHtml += '          <td id=\"latLng\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Region</th>\n';
	defaultHtml += '          <td id=\"region\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Description</th>\n';
	defaultHtml += '          <td id=\"siteDesc\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Altitude (m)</th>\n';
	defaultHtml += '          <td id=\"altitude\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Point land cover</th>\n';
	defaultHtml += '          <td id=\"lcm\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '		<tr>\n';
	defaultHtml += '			<th>COSMOS footprint</th>\n';
	defaultHtml += '			<td id=\"footprint\"></td>\n';
	defaultHtml += '		<tr>\n';
	defaultHtml += '          <th>HOST class</th>\n';
	defaultHtml += '          <td id=\"host\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Soil texture</th>\n';
	defaultHtml += '          <td id=\"soilTexture\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Soil thickness</th>\n';
	defaultHtml += '          <td id=\"soilThickness\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Bedrock class</th>\n';
	defaultHtml += '          <td id=\"bedrockClass\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Superficial geology class</th>\n';
	defaultHtml += '          <td id=\"superficialGeologyClass\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Superficial geology series </th>\n';
	defaultHtml += '          <td id=\"superficialGeologySeries\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Reference bulk density</th>\n';
	defaultHtml += '          <td id=\"bulkDensity\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Reference lattice water</th>\n';
	defaultHtml += '          <td id=\"latticeWater\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Reference soil organic carbon</th>\n';
	defaultHtml += '          <td id=\"soilOrganicCarbon\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Calibrated (Y/N)</th>\n';
	defaultHtml += '          <td id=\"calibrated\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '        <tr>\n';
	defaultHtml += '          <th>Long-term annual rainfall</th>\n';
	defaultHtml += '          <td id=\"rainfall\"></td>\n';
	defaultHtml += '        </tr>\n';
	defaultHtml += '      </table>\n';
	defaultHtml += '    </div>\n';
	defaultHtml += '    <div class=\"rightCol50\">\n';
	defaultHtml += '	  <div id=\"mapid\" class=\"station\"></div>\n';
	defaultHtml += '      <h2>Site photos</h2><div id=\"stationPhotos\" class="slickImages"></div>\n';
	defaultHtml += '	     <h2>Maps</h2><div id=\"mapContainer\" class="slickImages" /></div>\n';
	defaultHtml += '  </div>\n';
	defaultHtml += '  <div id=\"graphs\" class=\"jTab\">\n';
	defaultHtml += '    <h2>Graphs</h2>\n';
	defaultHtml += '	<div id=\"parameterTabs\">\n';
	defaultHtml += '	<h3>Change chart parameters</h3>\n';
	defaultHtml += '		<ul>\n';
	defaultHtml += '			<li><a href=\"#daysParams\">Choose an amount of days</a></li>\n';
	defaultHtml += '			<li><a href=\"#dateRangeParams\">Choose a date range</a></li>\n';
	defaultHtml += '		</ul>\n';
	defaultHtml += '		<div class=\"jTab\" id=\"daysParams\">\n';
	defaultHtml += '			<label for=\"days-handle\">Amount of days to chart</label>\n';
	defaultHtml += '			<br clear=\"all\" />\n';
	defaultHtml += '			<div id=\"graphDays\" title=\"Amount of days to chart\">\n';
	defaultHtml += '				<div id=\"days-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml += '			</div>\n';
	defaultHtml += '			<br clear=\"all\" />\n';
	defaultHtml += '			<label for=\"endOffset-handle\">Offset from today\'s date</label>\n';
	defaultHtml += '			<br clear=\"all\" />\n';
	defaultHtml += '			<div id=\"endOffset\" title=\"Offset from today\'s date\">\n';
	defaultHtml += '				<div id=\"endOffset-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml += '			</div>\n';
	defaultHtml += '		</div>\n';
	defaultHtml += '		<div class=\"jTab\" id=\"dateRangeParams\">\n';
	defaultHtml += '			<label for=\"months-handle\">Date range to chart</label>\n';
	defaultHtml += '			<br clear=\"all\" />\n';
	defaultHtml += '			<span class=\"label monthStart\"></span>\n';
	defaultHtml += '			<div id=\"graphDates\" title=\"Date range to chart\">\n';
	defaultHtml += '				<div id=\"monthStart-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml += '				<div id=\"monthEnd-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml += '			</div>\n';
	defaultHtml += '			<span class=\"label monthEnd\"></span>\n';
	defaultHtml += '		</div>\n';
	defaultHtml += '	</div>\n';
	defaultHtml += '	<br clear=\"all\" />\n';
	defaultHtml += '	<div id=\"graphContainer\">\n';
	defaultHtml += '	<ul id=\"graphTabLinks\" />\n';
	defaultHtml += '	</div>\n';
	defaultHtml += '  </div>\n';
	defaultHtml += '  </div>\n';
	defaultHtml += '</div>';
	return defaultHtml;
}

cosmos.lcmClasses = [
	{ id: "LCM_CLASS_1", description: "% of Broadleaf Woodland (LCM 2015 Class 1)" },
	{ id: "LCM_CLASS_2", description: "% of Coniferous Woodland (LCM 2015  Class 2)" },
	{ id: "LCM_CLASS_3", description: "% of Arable and horticulture (LCM 2015 Class 3)" },
	{ id: "LCM_CLASS_4", description: "% of Improved Grassland (LCM 2015  Class 4)" },
	{ id: "LCM_CLASS_5", description: "% of Neutral Grassland (LCM 2015  Class 5)" },
	{ id: "LCM_CLASS_6", description: "% of Calcareous Grassland (LCM 2015  Class 6)" },
	{ id: "LCM_CLASS_7", description: "% of Acid grassland (LCM 2015  Class 7)" },
	{ id: "LCM_CLASS_8", description: "% of Fen, marsh and swamp (LCM 2015  Class 8)" },
	{ id: "LCM_CLASS_9", description: "% of Heather (LCM 2015 Class 9)" },
	{ id: "LCM_CLASS_10", description: "% of Heather Grassland (LCM 2015  Class 10)" },
	{ id: "LCM_CLASS_11", description: "% of Bog (LCM 2015  Class 11)" },
	{ id: "LCM_CLASS_12", description: "% of Inland Rock (LCM 2015  Class 12)" },
	{ id: "LCM_CLASS_13", description: "% of Saltwater (LCM 2015  Class 13)" },
	{ id: "LCM_CLASS_14", description: "% of Freshwater (LCM 2015  Class 14)" },
	{ id: "LCM_CLASS_15", description: "% of Supra-littoral rock (LCM 2015  Class 15)" },
	{ id: "LCM_CLASS_16", description: "% of Supra-littoral sediment (LCM 2015  Class 16)" },
	{ id: "LCM_CLASS_17", description: "% of Littoral rock (LCM 2015  Class 17)" },
	{ id: "LCM_CLASS_18", description: "% of Littoral sediment (LCM 2015  Class 18)" },
	{ id: "LCM_CLASS_19", description: "% of Saltmarsh (LCM 2015  Class 19)" },
	{ id: "LCM_CLASS_20", description: "% of Urban (LCM 2015  Class 20)" },
	{ id: "LCM_CLASS_21", description: "% of Suburban (LCM 2015  Class 21)" }
];
cosmos.graphTypes = [
	{
		tab: "Summary",
		id: 'summaryGraphs',
		graphs: [
			{ name: 'VWC (hourly)', id: 'COSMOS_VWC' },
			{ name: 'VWC (daily)', id: 'COSMOS_VWC_1DAY' },
			{ name: 'Precipitation', id: 'PRECIPITATION_LEVEL2' },
			{ name: 'Air temperature', id: 'TA_LEVEL2' },
			{ name: 'Atmospheric pressure', id: 'PA_LEVEL2' },
			{ name: 'Relative humidity', id: 'RH_LEVEL2' },
			{ name: 'Absolute humidity', id: 'Q_LEVEL2' },
			{ name: 'Wind speed', id: 'WS_LEVEL2' },
			{ name: 'Wind direction', id: 'WD_LEVEL2' },
			{ name: 'Net radiation', id: 'RN_LEVEL2' },
			{ name: 'Potential evaporation', id: 'PE_LEVEL2' }
		]
	},
	{
		tab: "Weather",
		id: 'weatherGraphs',
		graphs: [
			{ name: 'Precipitation', id: 'PRECIPITATION_LEVEL2' },
			{ name: 'Air temperature', id: 'TA_LEVEL2' },
			{ name: 'Relative humidity', id: 'RH_LEVEL2' },
			{ name: 'Absolute humidity', id: 'Q_LEVEL2' },
			{ name: 'Atmospheric pressure', id: 'PA_LEVEL2' },
			{ name: 'Wind speed', id: 'WS_LEVEL2' },
			{ name: 'Wind direction', id: 'WD_LEVEL2' },
			{ name: 'Net radiation', id: 'RN_LEVEL2' },
			{ name: 'Potential evaporation', id: 'PE_LEVEL2' },
			{ name: 'X component of wind speed', id: 'UX_LEVEL2' },
			{ name: 'Y component of wind speed', id: 'UY_LEVEL2' },
			{ name: 'Z component of wind speed', id: 'UZ_LEVEL2' }
		]
	},
	{
		tab: "Soil moisture",
		id: 'moistureGraphs',
		graphs: [
			{ name: 'VWC (hourly)', id: 'COSMOS_VWC' },
			{ name: 'VWC (daily)', id: 'COSMOS_VWC_1DAY' },
			{ name: 'COSMOS counts', id: 'CTS_MOD_CORR_LEVEL2' },
			{ name: 'Effective depth', id: 'D86_75M' },
			{ name: 'Precipitation', id: 'PRECIPITATION_LEVEL2' },
			{ name: 'Potential evaporation', id: 'PE_LEVEL2' },
			{ name: 'TDT soil moisture 1 (10cm)', id: 'TDT1_VWC_LEVEL2' },
			{ name: 'TDT soil moisture 2 (10cm)', id: 'TDT2_VWC_LEVEL2' }
		]
	},
	{
		tab: "Soil temperature",
		id: 'temperatureGraphs',
		graphs: [
			{ name: 'TDT soil temperature 1 (10cm)', id: 'TDT1_TSOIL_LEVEL2' },
			{ name: 'TDT soil temperature 2 (10cm)', id: 'TDT2_TSOIL_LEVEL2' },
			{ name: 'Soil temperature profile (2cm)', id: 'STP_TSOIL2_LEVEL2' },
			{ name: 'Soil temperature profile (5cm)', id: 'STP_TSOIL5_LEVEL2' },
			{ name: 'Soil temperature profile (10cm)', id: 'STP_TSOIL10_LEVEL2' },
			{ name: 'Soil temperature profile (20cm)', id: 'STP_TSOIL20_LEVEL2' },
			{ name: 'Soil temperature profile (50cm)', id: 'STP_TSOIL50_LEVEL2' },
			{ name: 'Soil heat flux 1', id: 'G1_LEVEL2' },
			{ name: 'Soil heat flux 2', id: 'G2_LEVEL2' }
		]
	}
];
cosmos.graphParams = {};
cosmos.graphParams.height = 700;
cosmos.graphParams.width = 1000;
cosmos.graphParams.days = 50;
cosmos.graphParams.endOffset = 0;
cosmos.graphParams.startDate = 0;
cosmos.graphParams.endDate = 10;
cosmos.graphParams.urlType = 'days';

cosmos.structurePage = function (defaultHtml) {
	jQuery('#jspageDiv').html(defaultHtml);
	wrUtils.pageLoading();
	//jquery ui tabs for the details, graphs and maps tabs
	jQuery("#stationTabs").tabs();
	jQuery("#parameterTabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
	jQuery("#parameterTabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
	jQuery('#graphsTabLink').click(cosmos.drawGraphs);
	cosmos.drawGraphContainer();
	cosmos.outputImages();
	//featherlight doesn't add captions to images by default, so extra code here to add it from the alt text.
	jQuery.featherlight.prototype.afterContent = function () {
		var caption = this.$currentTarget.find('img').attr('alt');
		this.$instance.find('.caption').remove();
		jQuery('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
	};
	cosmos.createSliders();
	cosmos.drawMap();
	return;
}
cosmos.createSliders = function () {
	var daysHandle = jQuery("#days-handle");
	jQuery("#graphDays").slider({
		min: 1,
		max: cosmos.graphParams.maxDays,
		value: cosmos.graphParams.days,
		create: function () {
			daysHandle.text(cosmos.graphParams.days);
		},
		change: function (e, ui) {
			cosmos.graphParams.days = ui.value;
			cosmos.graphParams.urlType = 'days';
			cosmos.drawGraphs();
			daysHandle.text(ui.value);
		}
	});
	var endOffsetHandle = jQuery("#endOffset-handle");
	jQuery("#endOffset").slider({
		min: 1,
		max: cosmos.graphParams.maxDays,
		create: function () {
			endOffsetHandle.text(cosmos.graphParams.endOffset);
		},
		change: function (e, ui) {
			cosmos.graphParams.endOffset = ui.value;
			cosmos.drawGraphs();
			endOffsetHandle.text(ui.value);
			cosmos.graphParams.urlType = 'days';
		}
	});
	return;
}
cosmos.drawMonthSlider = function () {
	var monthStartHandle = jQuery("#monthStart-handle");
	var monthEndHandle = jQuery("#monthEnd-handle");
	jQuery("#graphDates").slider({
		min: 0,
		max: wrUtils.mapDates.length - 1,
		range: true,
		values: [cosmos.graphParams.startDate, wrUtils.mapDates.length - 1],
		create: function () {
			monthStartHandle.text(wrUtils.formatDate(cosmos.graphParams.startDate).shortDate);
			monthEndHandle.text(wrUtils.formatDate(wrUtils.mapDates.length - 1).shortDate);
		},
		change: function (e, ui) {

			cosmos.graphParams.startDate = wrUtils.formatDate(ui.values[0]).shortDate;
			cosmos.graphParams.endDate = wrUtils.formatDate(ui.values[1]).shortDate;
			cosmos.drawGraphs();
			monthStartHandle.text(wrUtils.formatDate(ui.values[0]).shortDate);
			monthEndHandle.text(wrUtils.formatDate(ui.values[1]).shortDate);
			cosmos.graphParams.urlType = 'months';
		}
	});
	jQuery(".monthStart").text(wrUtils.formatDate(0).shortDate);
	jQuery(".monthEnd").text(wrUtils.formatDate(wrUtils.mapDates.length - 1).shortDate);
	return;
}
cosmos.getStationData = function () {
	var stationDetailUrl = 'https://nrfaapps.ceh.ac.uk/nrfa/json/cosmos-query-data?site=' + cosmos.station;
	//var stationDetailUrl = 'data/cosmos-query-data_BUNNY.json';
	jQuery.ajax({
		url: stationDetailUrl,
		/* crossdomain:true,
		jsonp: "callback",
		dataType:"jsonp", */
		success: cosmos.outputStationData,
		error: function (jqXHR, textStatus, errorThrown) {
			jQuery('#jspageDiv').html('<p>You have entered an incorrect station ID, please <a href="/data">go back to the map</a> and choose another station.</p>');
		}
	});
}
cosmos.outputStationData = function (stationData) {
	var defaultHtml = cosmos.renderPage();
	var dateDecommissioned = new Date(stationData["date-decommissioned"]);
	var currentDate = new Date();
	var calibrated = 'No';
	cosmos.structurePage(defaultHtml);
	/* jQuery.ajax({
		url:cosmos.relativeUrl+ '/cosmos/station.htm',
		crossDomain:true,
		success:cosmos.structurePage
	}); */
	if (stationData["calibrated"]) {
		calibrated = 'Yes';
	}
	wrUtils.startDate = new Date(stationData["date-installed"]);
	if (dateDecommissioned < currentDate) {
		wrUtils.endDate = dateDecommissioned;
	}
	wrUtils.dates = wrUtils.getSpiDates();
	//once got start date and end date of station, then can get the amount of days since it started to put on the days slider.
	cosmos.graphParams.maxDays = wrUtils.getDaysBetween();
	cosmos.drawMonthSlider();
	jQuery('.siteName').text(stationData["site-name"]);
	jQuery('#bng').text(stationData.easting + ', ' + stationData.northing);
	jQuery('#latLng').text(stationData.latitude + ', ' + stationData.longitude);
	jQuery('#region').text(stationData["region"]);
	jQuery('#siteDesc').text(stationData["description"]);
	jQuery('#lcm').text(stationData["land-cover"]);
	jQuery('#altitude').text(stationData["altitude"]);
	if (typeof stationData["bedrock-class"] != 'undefined') {
		jQuery('#bedrockClass').text(wrUtils.autocase(stationData["bedrock-class"]));
	}
	if (typeof stationData["super-class"] != 'undefined') {
		jQuery('#superficialGeologyClass').text(wrUtils.autocase(stationData["super-class"]));
	}
	if (typeof stationData["super-series"] != 'undefined') {
		jQuery('#superficialGeologySeries').text(wrUtils.autocase(stationData["super-series"]));
	}
	if (typeof stationData["soil-texture"] != 'undefined') {
		jQuery('#soilTexture').text(wrUtils.autocase(stationData["soil-texture"]));
	}
	if (typeof stationData["soil-thickness"] != 'undefined') {
		jQuery('#soilThickness').text(wrUtils.autocase(stationData["soil-thickness"]));
	}
	if (typeof stationData["saar"] != 'undefined') {
		jQuery('#rainfall').text(stationData["saar"]);
	}
	if (typeof stationData["calibration-info"] != 'undefined') {
		jQuery('#bulkDensity').text(stationData["calibration-info"]["ref-bulk-density"]);
		jQuery('#latticeWater').text(stationData["calibration-info"]["ref-lattice-water"]);
		jQuery('#soilOrganicCarbon').text(stationData["calibration-info"]["ref-soil-organic-carbon"]);
		jQuery('#calibrated').text(calibrated);
	}
	if (typeof stationData["site-attributes"] != 'undefined') {
		var footprint = '';
		for (var c = 0; c < cosmos.lcmClasses.length; c++) {
			var lcmClass = cosmos.lcmClasses[c];
			if (typeof stationData["site-attributes"][lcmClass.id] != 'undefined') {
				footprint += stationData["site-attributes"][lcmClass.id] + lcmClass.description + '<br />';
			}
		}
		jQuery('#footprint').html(footprint);
	}
	cosmos.updateMap(stationData);
}
cosmos.drawMap = function (stationData) {
	var osmUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VtbWF2bmFzaCIsImEiOiJjamdwNjR5YzMwZTc5MndtZDJteDFpY3lwIn0.3Exi_QhPZuuxHRcBXmpo5A';
	var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var sateliteMap = L.tileLayer(osmUrl, {
		attribution: osmAttrib,
		id: 'mapbox.streets-satellite'
	});
	var streetMap = L.tileLayer(osmUrl, {
		attribution: osmAttrib,
		id: 'mapbox.streets'
	});
	var baseMaps = {
		"Streets": streetMap,
		"Satellite": sateliteMap
	};
	cosmos.map = L.map('mapid', {
		layers: [sateliteMap],
		center: [55, -4.17],
		zoom: 5
	});
	L.control.layers(baseMaps).addTo(cosmos.map);
	cosmos.osm2 = new L.TileLayer(osmUrl, { id: 'mapbox.streets', attribution: osmAttrib });
	//cosmos.getWMSlayers();
	return;
}
cosmos.updateMap = function (stationData) {
	var markerLayer = new L.layerGroup();
	var markerIcon = new L.icon({
		iconUrl: cosmos.relativeUrl + '/includes/images/redicon.png',
		iconSize: [10, 10]
	});
	var stationCoords = [parseFloat(stationData.latitude), parseFloat(stationData.longitude)];
	//to get the marker and circle on both maps, have to draw them twice. 
	var siteCircle = new L.circle(stationCoords, { radius: 200 }).addTo(cosmos.map);
	var siteMarker = new L.marker(stationCoords, { title: stationData["site-name"], icon: markerIcon });
	var mmMarker = new L.marker(stationCoords, { title: stationData["site-name"], icon: markerIcon });
	var mmCircle = new L.circle(stationCoords, { radius: 200 }).addTo(cosmos.map);
	siteMarker.addTo(cosmos.map);
	mmMarker.addTo(markerLayer);
	mmCircle.addTo(markerLayer);
	var mmLayers = new L.LayerGroup([cosmos.osm2, markerLayer]);
	var miniMap = new L.Control.MiniMap(mmLayers, {
		centerFixed: stationCoords,
		zoomLevelFixed: 14,
		width: 160,
		height: 160,
		position: 'bottomleft'
	}).addTo(cosmos.map);
	cosmos.map.invalidateSize();
	return;
}
cosmos.getWMSlayers = function () {
	var bgsSuperficialGeology = L.tileLayer.wms("https://map.bgs.ac.uk/arcgis/services/BGS_Detailed_Geology/MapServer/WMSServer", {
		layers: 'BGS.50k.Superficial.deposits',
		format: 'image/png',
		transparent: true,
		version: '1.3.0',
		opacity: 0.5,
		attribution: "BGS superficial geology 50K"
	})
		.addTo(cosmos.map);
	return;
}
cosmos.drawGraphContainer = function () {
	var i = 0;
	for (i; i < cosmos.graphTypes.length; i++) {
		var graphTab = cosmos.graphTypes[i];
		jQuery('#graphTabLinks').append('<li><a href="#' + graphTab.id + '" class="groupedGraphsLink">' + graphTab.tab + '</a></li>');
		jQuery('#graphContainer').append('<div id="' + graphTab.id + '" class="jTab groupedGraphs" />');
	}
	jQuery("#graphContainer").tabs();
	cosmos.graphTabID = jQuery('div.groupedGraphs:first').attr('id');
	jQuery('.groupedGraphsLink').click(function () {
		cosmos.graphTabID = jQuery(this).attr('href').substring(1);
		cosmos.drawGraphs();
	});
	cosmos.drawGraphs();
	return;
}
cosmos.drawGraphs = function () {
	var t = 0;
	var hasParams = false;
	var smallGraph = '&w=' + cosmos.graphParams.width;
	var largeGraph = '&w=1600';
	jQuery('.groupedGraphs').empty();
	//get the id of the graph type div container from the cosmos.graphTabID to add the images to
	var graphTab = jQuery.grep(cosmos.graphTypes, function (obj) { return obj.id === cosmos.graphTabID; })[0];
	//loop through the graphs for the particular graph type group
	for (t; t < graphTab.graphs.length; t++) {
		var graphType = graphTab.graphs[t];
		var graphCaption = '';
		var graphSrc = 'http://nrfaapps.ceh.ac.uk/nrfa/image/cosmos/graph.png?db-level=2&site=' + cosmos.station + '&h=' + cosmos.graphParams.height + '&parameter=' + graphType.id;
		//either draw the days 
		if ((cosmos.graphParams.days > 0 || cosmos.graphParams.endOffset > 0) && cosmos.graphParams.urlType === 'days') {
			graphSrc += '&days=' + cosmos.graphParams.days + '&end-offset=-' + cosmos.graphParams.endOffset;
			graphCaption = graphType.name + ' for last ' + cosmos.graphParams.days + ' days';
			hasParams = true;
		}
		//or the date range
		else if (cosmos.graphParams.startDate != 0 && cosmos.graphParams.endDate != 0 && cosmos.graphParams.urlType === 'months') {
			graphSrc += '&date=' + cosmos.graphParams.startDate + '/' + cosmos.graphParams.endDate;
			graphCaption = graphType.name + ' for date range ' + cosmos.graphParams.startDate + ' to ' + cosmos.graphParams.endDate;
			hasParams = true;
		}
		if (hasParams)
		// draw the graphs from the web service.
		{
			jQuery('#' + graphTab.id).append('<div id="graph' + graphType.id + '" class="leftCol33"><figure class="loading"><a href="' + graphSrc + largeGraph + '" data-featherlight="image" title="' + graphCaption + '"><img alt="' + graphCaption + '" /></a><figcaption>' + graphType.name + '</figcaption></figure></div>');
			jQuery('#graph' + graphType.id).find('img').attr('src', graphSrc + smallGraph);
		}
	}
	return;
}
cosmos.outputImages = function () {
	var imgUrl = cosmos.relativeUrl;
	if (cosmos.relativeUrl === 'http://localhost:8080/') {
		imgUrl = cosmos.relativeUrl + 'cosmos/';
	}
	jQuery('#mapContainer').append('<div><figure><a href="' + imgUrl + 'images/maps/AirPhoto_%20' + cosmos.station + '.png" title="' + cosmos.station + ' satellite photo. Click to enlarge." data-featherlight="image"><img src="' + imgUrl + '/images/maps/AirPhoto_%20' + cosmos.station + '.png" alt="' + cosmos.station + ' satellite photo" /></a><figcaption class="centred">' + cosmos.station + ' satellite photo</figcaption></figure></div>');
	jQuery('#mapContainer').append('<div><figure><a href="' + imgUrl + 'images/maps/LCM_%20' + cosmos.station + '.png" title="' + cosmos.station + ' land cover map. Click to enlarge." data-featherlight="image"><img src="' + imgUrl + '/images/maps/LCM_%20' + cosmos.station + '.png" alt="' + cosmos.station + ' land cover map" /></a><figcaption class="centred">' + cosmos.station + ' land cover map</figcaption></figure></div>');
	jQuery('#mapContainer').append('<div><figure><a href="' + imgUrl + 'images/maps/StreetView_%20' + cosmos.station + '.png" title="' + cosmos.station + ' street view. Click to enlarge." data-featherlight="image"><img src="' + imgUrl + '/images/maps/StreetView_%20' + cosmos.station + '.png" alt="' + cosmos.station + ' street view" /></a><figcaption class="centred">' + cosmos.station + ' street view</figcaption></figure></div>');
	jQuery('#stationPhotos').append('<div><figure><a href="' + imgUrl + 'images/photos/photo1_' + cosmos.station + '.jpg" title="' + cosmos.station + ' photo 1. Click to enlarge." data-featherlight="image"><img src="' + imgUrl + '/images/photos/photo1_' + cosmos.station + '.jpg" alt="' + cosmos.station + ' photo 1" /></a><figcaption class="centred">' + cosmos.station + ' photo 1</figcaption></figure></div>');
	jQuery('#stationPhotos').append('<div><figure><a href="' + imgUrl + 'images/photos/photo1_' + cosmos.station + '.jpg" title="' + cosmos.station + ' photo 2. Click to enlarge." data-featherlight="image"><img src="' + imgUrl + '/images/photos/photo2_' + cosmos.station + '.jpg" alt="' + cosmos.station + ' photo 2" /></a><figcaption class="centred">' + cosmos.station + ' photo 2</figcaption></figure></div>');
	jQuery('#stationPhotos').append('<div><figure><a href="' + imgUrl + 'images/photos/pheno_' + cosmos.station + '.jpg" title="' + cosmos.station + ' phenocam. Click to enlarge." data-featherlight="image"><img src="' + imgUrl + '/images/photos/pheno_' + cosmos.station + '.jpg" alt="' + cosmos.station + ' phenocam" /></a><figcaption class="centred">' + cosmos.station + ' phenocam</figcaption></figure></div>');
	jQuery('.slickImages').slick({
		dots: true,
		infinite: true,
		speed: 500,
		fade: true,
		cssEase: 'linear'
	});
	return;
};