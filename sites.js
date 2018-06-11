var cosmos = {};
cosmos.relativeUrl = 'http://localhost:8080';
cosmos.stylesheets = ['//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css', cosmos.relativeUrl+'/includes/featherlight.css', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css', cosmos.relativeUrl+'/includes/map.css', cosmos.relativeUrl+'/includes/loading.css'];

(function($){
	Drupal.behaviors.jspageLoad = {
		attach: function(context, settings) {
		  var jspage = jQuery('#' + settings.jspage.divId);
		  jspage.once('jspageLoad', function() {
				cosmos.station = settings.jspage.param0;
				cosmos.getStationData();
				wrUtils.init();
				
		  });
		}
	}
})(jQuery);

cosmos.renderPage = function()
{
	var defaultHtml = "";
	defaultHtml +='<div id=\"loadingBackground\"> </div>\n';
	defaultHtml +='<div id=\"bowlG\">\n';
	defaultHtml +='  <div id=\"bowl_ringG\">\n';
	defaultHtml +='    <div class=\"ball_holderG\">\n';
	defaultHtml +='      <div class=\"ballG\"> </div>\n';
	defaultHtml +='    </div>\n';
	defaultHtml +='  </div>\n';
	defaultHtml +='</div>\n';
	defaultHtml +='<noscript>\n';
	defaultHtml +='Please enable JavaScript to use this page\n';
	defaultHtml +='</noscript>\n';
	defaultHtml +='<h1>COSMOS station — <span class=\"siteName\"></span></h1>\n';
	defaultHtml +='<div id=\"stationTabs\">\n';
	defaultHtml +='	<ul>\n';
	defaultHtml +='		<li><a href=\"#details\" id=\"detailsTabLink\">Site details</a></li>\n';
	defaultHtml +='		<li><a href=\"#graphs\" id=\"graphsTabLink\">Graphs</a></li>\n';
	defaultHtml +='		<li><a href=\"#maps\" id=\"mapsTabLink\">Maps</a></li>\n';
	defaultHtml +='	</ul>\n';
	defaultHtml +='  <div id=\"details\" class=\"jTab\">\n';
	defaultHtml +='    <h2>Site details</h2>\n';
	defaultHtml +='    <div class=\"leftCol50\">\n';
	defaultHtml +='      <table>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th width="30%">Site name</th>\n';
	defaultHtml +='          <td class=\"siteName\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Easting, northing</th>\n';
	defaultHtml +='          <td id=\"bng\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <!-- probably not needed <tr>\n';
	defaultHtml +='          <th> Site NGR</th>\n';
	defaultHtml +='          <td id=\"ngr\"></td>\n';
	defaultHtml +='        </tr> -->\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Latitude, longitude</th>\n';
	defaultHtml +='          <td id=\"latLng\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Region</th>\n';
	defaultHtml +='          <td id=\"region\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Description</th>\n';
	defaultHtml +='          <td id=\"siteDesc\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Altitude (m)</th>\n';
	defaultHtml +='          <td id=\"altitude\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Point land cover</th>\n';
	defaultHtml +='          <td id=\"lcm\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='		<tr>\n';
	defaultHtml +='			<th>COSMOS footprint</th>\n';
	defaultHtml +='			<td id=\"footprint\"></td>\n';
	defaultHtml +='		<tr>\n';
	defaultHtml +='          <th>HOST class</th>\n';
	defaultHtml +='          <td id=\"host\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Soil texture</th>\n';
	defaultHtml +='          <td id=\"soilTexture\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Soil thickness</th>\n';
	defaultHtml +='          <td id=\"soilThickness\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Bedrock class</th>\n';
	defaultHtml +='          <td id=\"bedrockClass\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Superficial geology class</th>\n';
	defaultHtml +='          <td id=\"superficalGeologyClass\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Superficial geology series </th>\n';
	defaultHtml +='          <td id=\"superficialGeologySeries\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Reference bulk density</th>\n';
	defaultHtml +='          <td id=\"bulkDensity\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Reference lattice water</th>\n';
	defaultHtml +='          <td id=\"latticeWater\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Reference soil organic carbon</th>\n';
	defaultHtml +='          <td id=\"soilOrganicCarbon\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Calibrated (Y/N)</th>\n';
	defaultHtml +='          <td id=\"calibrated\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='        <tr>\n';
	defaultHtml +='          <th>Long-term annual rainfall</th>\n';
	defaultHtml +='          <td id=\"rainfall\"></td>\n';
	defaultHtml +='        </tr>\n';
	defaultHtml +='      </table>\n';
	defaultHtml +='    </div>\n';
	defaultHtml +='    <div class=\"rightCol50\">\n';
	defaultHtml +='	  <div id=\"mapid\" class=\"station\"></div>\n';
	defaultHtml +='      <div id=\"stationPhotos\"></div>\n';
	defaultHtml +='    </div>\n';
	defaultHtml +='  </div>\n';
	defaultHtml +='  <div id=\"graphs\" class=\"jTab\">\n';
	defaultHtml +='    <h2>Graphs</h2>\n';
	defaultHtml +='	<div id=\"parameterTabs\">\n';
	defaultHtml +='	<h3>Change chart parameters</h3>\n';
	defaultHtml +='		<ul>\n';
	defaultHtml +='			<li><a href=\"#daysParams\">Choose an amount of days</a></li>\n';
	defaultHtml +='			<li><a href=\"#dateRangeParams\">Choose a date range</a></li>\n';
	defaultHtml +='		</ul>\n';
	defaultHtml +='		<div class=\"jTab\" id=\"daysParams\">\n';
	defaultHtml +='			<label for=\"days-handle\">Amount of days to chart</label>\n';
	defaultHtml +='			<br clear=\"all\" />\n';
	defaultHtml +='			<div id=\"graphDays\" title=\"Amount of days to chart\">\n';
	defaultHtml +='				<div id=\"days-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml +='			</div>\n';
	defaultHtml +='			<br clear=\"all\" />\n';
	defaultHtml +='			<label for=\"endOffset-handle\">Offset from today\'s date</label>\n';
	defaultHtml +='			<br clear=\"all\" />\n';
	defaultHtml +='			<div id=\"endOffset\" title=\"Offset from today\'s date\">\n';
	defaultHtml +='				<div id=\"endOffset-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml +='			</div>\n';
	defaultHtml +='		</div>\n';
	defaultHtml +='		<div class=\"jTab\" id=\"dateRangeParams\">\n';
	defaultHtml +='			<label for=\"months-handle\">Date range to chart</label>\n';
	defaultHtml +='			<br clear=\"all\" />\n';
	defaultHtml +='			<span class=\"label monthStart\"></span>\n';
	defaultHtml +='			<div id=\"graphDates\" title=\"Date range to chart\">\n';
	defaultHtml +='				<div id=\"monthStart-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml +='				<div id=\"monthEnd-handle\" class=\"ui-slider-handle controlHandle\"></div>\n';
	defaultHtml +='			</div>\n';
	defaultHtml +='			<span class=\"label monthEnd\"></span>\n';
	defaultHtml +='		</div>\n';
	defaultHtml +='	</div>\n';
	defaultHtml +='	<br clear=\"all\" />\n';
	defaultHtml +='	<div id=\"graphContainer\">\n';
	defaultHtml +='	<ul id=\"graphTabLinks\" />\n';
	defaultHtml +='	</div>\n';
	defaultHtml +='  </div>\n';
	defaultHtml +='  <div id=\"maps\" class=\"jTab\">\n';
	defaultHtml +='    <h2>Maps</h2>\n';
	defaultHtml +='	<div id=\"mapContainer\" />\n';
	defaultHtml +='	</div>\n';
	defaultHtml +='  </div>\n';
	defaultHtml +='</div>';
	return defaultHtml;
}

cosmos.lcmClasses = [
	{id:"LCM_CLASS_1", description:"% of Broadleaf Woodland (LCM 2015 Class 1)"},
	{id:"LCM_CLASS_2", description:"% of Coniferous Woodland (LCM 2015  Class 2)"},
	{id:"LCM_CLASS_3", description:"% of Arable and horticulture (LCM 2015 Class 3)"},
	{id:"LCM_CLASS_4", description:"% of Improved Grassland (LCM 2015  Class 4)"},
	{id:"LCM_CLASS_5", description:"% of Neutral Grassland (LCM 2015  Class 5)"},
	{id:"LCM_CLASS_6", description:"% of Calcareous Grassland (LCM 2015  Class 6)"},
	{id:"LCM_CLASS_7", description:"% of Acid grassland (LCM 2015  Class 7)"},
	{id:"LCM_CLASS_8", description:"% of Fen, marsh and swamp (LCM 2015  Class 8)"},
	{id:"LCM_CLASS_9", description:"% of Heather (LCM 2015 Class 9)"},
	{id:"LCM_CLASS_10", description:"% of Heather Grassland (LCM 2015  Class 10)"},
	{id:"LCM_CLASS_11", description:"% of Bog (LCM 2015  Class 11)"},
	{id:"LCM_CLASS_12", description:"% of Inland Rock (LCM 2015  Class 12)"},
	{id:"LCM_CLASS_13", description:"% of Saltwater (LCM 2015  Class 13)"},
	{id:"LCM_CLASS_14", description:"% of Freshwater (LCM 2015  Class 14)"},
	{id:"LCM_CLASS_15", description:"% of Supra-littoral rock (LCM 2015  Class 15)"},
	{id:"LCM_CLASS_16", description:"% of Supra-littoral sediment (LCM 2015  Class 16)"},
	{id:"LCM_CLASS_17", description:"% of Littoral rock (LCM 2015  Class 17)"},
	{id:"LCM_CLASS_18", description:"% of Littoral sediment (LCM 2015  Class 18)"},
	{id:"LCM_CLASS_19", description:"% of Saltmarsh (LCM 2015  Class 19)"},
	{id:"LCM_CLASS_20", description:"% of Urban (LCM 2015  Class 20)"},
	{id:"LCM_CLASS_21", description:"% of Suburban (LCM 2015  Class 21)"}
];
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
cosmos.graphParams.height = 700;
cosmos.graphParams.width = 1000;
cosmos.graphParams.days = 50;
cosmos.graphParams.endOffset = 0;
cosmos.graphParams.startDate = 0;
cosmos.graphParams.endDate = 30;
cosmos.graphParams.urlType = 'days';

cosmos.structurePage = function(defaultHtml)
{
	jQuery('#jspageDiv').html(defaultHtml);
	wrUtils.pageLoading();
	//jquery ui tabs for the details, graphs and maps tabs
	jQuery("#stationTabs").tabs();
	jQuery("#parameterTabs").tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    jQuery("#parameterTabs li").removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	jQuery('#graphsTabLink').click(cosmos.drawGraphs);
	cosmos.drawGraphContainer();
	cosmos.outputImages();
	//add a magnifying glass on the lightbox images
	jQuery('figure').prepend('<i class="fa fa-search-plus"></i>');
	//featherlight doesn't add captions to images by default, so extra code here to add it from the alt text.
	jQuery.featherlight.prototype.afterContent = function() {
	  var caption = this.$currentTarget.find('img').attr('alt');
	  this.$instance.find('.caption').remove();
	  jQuery('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
	};
	var daysHandle = jQuery( "#days-handle" );
	jQuery( "#graphDays" ).slider({ 
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
	var endOffsetHandle = jQuery( "#endOffset-handle" );
	jQuery( "#endOffset" ).slider({ 
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
	cosmos.drawMap();
	return;
}
cosmos.drawMonthSlider = function()
{
	wrUtils.dates = wrUtils.getSpiDates();
	var monthStartHandle = jQuery( "#monthStart-handle" );
	var monthEndHandle = jQuery( "#monthEnd-handle" );
	jQuery( "#graphDates" ).slider({ 
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
	jQuery( ".monthStart" ).text(wrUtils.formatDate(0).shortDate);
	jQuery( ".monthEnd" ).text(wrUtils.formatDate(wrUtils.mapDates.length-1).shortDate);
	return;
}
cosmos.getStationData = function()
{
	var stationDetailUrl = 'https://nrfaapps.ceh.ac.uk/nrfa/json/cosmos-query-data?site='+cosmos.station;
	jQuery.ajax({
		url:stationDetailUrl,
		crossdomain:true,
		jsonp: "callback",
		dataType:"jsonp",
		success:cosmos.outputStationData,
		error: function(jqXHR,textStatus,errorThrown){
			jQuery('#jspageDiv').html('<p>You have entered an incorrect station ID, please <a href="/data">go back to the map</a> and choose another station.</p>');
		}
	});
}
cosmos.outputStationData = function(stationData)
{
	for (var l = 0; l < cosmos.stylesheets.length; l++)
	{
		jQuery('head').append('<link href="'+cosmos.stylesheets[l]+'" type="text/css" rel="stylesheet" />');
	}
	var defaultHtml = cosmos.renderPage();
	cosmos.structurePage(defaultHtml);
	/* jQuery.ajax({
		url:cosmos.relativeUrl+ '/cosmos/station.htm',
		crossDomain:true,
		success:cosmos.structurePage
	}); */
	var calibrated = 'No';
	if(stationData["calibrated"])
	{
		calibrated = 'Yes';
	}
	wrUtils.startYear = stationData["date-installed"].split('-')[0];
	var yearDecommissioned = stationData["date-decommissioned"].split('-')[0];
	var currentYear = (new Date).getFullYear();
	if(yearDecommissioned < currentYear)
	{
		wrUtils.endYear = yearDecommissioned;
	}
	cosmos.drawMonthSlider();
	jQuery('.siteName').text(stationData["site-name"]);
	jQuery('#bng').text(stationData.easting+', '+stationData.northing);
	jQuery('#latLng').text(stationData.latitude+', '+stationData.longitude);
	jQuery('#region').text(stationData["region"]);
	jQuery('#siteDesc').text(stationData["description"]);
	jQuery('#lcm').text(stationData["land-cover"]);
	jQuery('#altitude').text(stationData["altitude"]);
	jQuery('#superficalGeologyClass').text(wrUtils.autocase(stationData["bedrock-class"]));
	jQuery('#soilTexture').text(wrUtils.autocase(stationData["soil-texture"]));
	jQuery('#soilThickness').text(wrUtils.autocase(stationData["soil-thickness"]));
	jQuery('#rainfall').text(stationData["saar"]);
	if(typeof stationData["calibration-info"] != 'undefined')
	{
		jQuery('#bulkDensity').text(stationData["calibration-info"]["ref-bulk-density"]);
		jQuery('#latticeWater').text(stationData["calibration-info"]["ref-lattice-water"]);
		jQuery('#soilOrganicCarbon').text(stationData["calibration-info"]["ref-soil-organic-carbon"]);
		jQuery('#calibrated').text(calibrated);
	}
	if(typeof stationData["site-attributes"] != 'undefined')
	{
		var footprint = '';
		for(var c = 0; c < cosmos.lcmClasses.length;c++)
		{
			var lcmClass = cosmos.lcmClasses[c];
			if(typeof stationData["site-attributes"][lcmClass.id] != 'undefined')
			{
				footprint += stationData["site-attributes"][lcmClass.id]+lcmClass.description+'<br />';
			}
		}
		jQuery('#footprint').html(footprint);
	}
	cosmos.updateMap(stationData);
}
cosmos.drawMap = function(stationData)
{
	cosmos.map = L.map('mapid');
	cosmos.osMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiZ2VtbWF2bmFzaCIsImEiOiJjamdwNjR5YzMwZTc5MndtZDJteDFpY3lwIn0.3Exi_QhPZuuxHRcBXmpo5A'
	}).addTo(cosmos.map);
	cosmos.getWMSlayers();
	return;
}
cosmos.updateMap = function(stationData)
{
	var markerIcon = L.icon({
		iconUrl: cosmos.relativeUrl+'/includes/images/redicon.png',
		iconSize: [10, 10],
		iconAnchor: [15, 15],
		popupAnchor: [-7, -12]
	});
	var stationCoords = [stationData.latitude,stationData.longitude];
	cosmos.map.setView(stationCoords, 13);
	var marker = L.marker(stationCoords, {title:stationData["site-name"], icon:markerIcon}).addTo(cosmos.map);
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
		jQuery('#graphTabLinks').append('<li><a href="#'+graphTab.id+'" class="groupedGraphsLink">'+graphTab.tab+'</a></li>');
		jQuery('#graphContainer').append('<div id="'+graphTab.id+'" class="jTab groupedGraphs" />');
	}
	jQuery( "#graphContainer" ).tabs();
	cosmos.graphTabID = jQuery('div.groupedGraphs:first').attr('id');
	jQuery('.groupedGraphsLink').click(function(){
		cosmos.graphTabID = jQuery(this).attr('href').substring(1);
		cosmos.drawGraphs();
	});
	cosmos.drawGraphs();
	return;
}
cosmos.drawGraphs = function()
{
	var t = 0;
	var hasParams = false;
	jQuery('.groupedGraphs').empty();
	//get the id of the graph type div container from the cosmos.graphTabID to add the images to
	var graphTab = jQuery.grep(cosmos.graphTypes, function(obj){return obj.id === cosmos.graphTabID;})[0];
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
			jQuery('#'+graphTab.id).append('<div id="graph'+graphType.id+'" class="leftCol33"><figure class="loading"><a href="'+graphSrc+'" data-featherlight="image" title="'+graphType.name+' for last '+cosmos.graphParams.days+' days"><img alt="'+graphType.name+' for last '+cosmos.graphParams.days+' days" /></a><figcaption>'+graphType.name+'</figcaption></figure></div>');
			jQuery('#graph'+graphType.id).find('img').attr('src',graphSrc);
		}
	}
	return;
}
cosmos.outputImages = function()
{
	jQuery('#mapContainer').append('<div class="leftCol33"><figure class="centred"><a href="'+cosmos.relativeUrl+'/cosmos/images/maps/AirPhoto_%20'+cosmos.station+'.png" title="'+cosmos.station+' satellite photo" data-featherlight="image"><img src="'+cosmos.relativeUrl+'/cosmos/images/maps/AirPhoto_%20'+cosmos.station+'.png" alt="'+cosmos.station+' satellite photo" /></a><figcaption>'+cosmos.station+' satellite photo</figcaption></figure></div>');
	jQuery('#mapContainer').append('<div class="leftCol33"><figure class="centred"><a href="'+cosmos.relativeUrl+'/cosmos/images/maps/LCM_%20'+cosmos.station+'.png" title="'+cosmos.station+' LCM" data-featherlight="image"><img src="'+cosmos.relativeUrl+'/cosmos/images/maps/LCM_%20'+cosmos.station+'.png" alt="'+cosmos.station+' LCM" /></a><figcaption>'+cosmos.station+' LCM</figcaption></figure></div>');
	jQuery('#mapContainer').append('<div class="leftCol33"><figure class="centred"><a href="'+cosmos.relativeUrl+'/cosmos/images/maps/StreetView_%20'+cosmos.station+'.png" title="'+cosmos.station+' street view" data-featherlight="image"><img src="'+cosmos.relativeUrl+'/cosmos/images/maps/StreetView_%20'+cosmos.station+'.png" alt="'+cosmos.station+' street view" /></a><figcaption>'+cosmos.station+' street view</figcaption></figure></div>');
	jQuery('#stationPhotos').append('<div class="leftCol33"><figure class="centred"><a href="'+cosmos.relativeUrl+'/cosmos/images/photos/photo1_'+cosmos.station+'.jpg" title="'+cosmos.station+' photo 1" data-featherlight="image"><img src="'+cosmos.relativeUrl+'/cosmos/images/photos/photo1_'+cosmos.station+'.jpg" alt="'+cosmos.station+' photo 1" /></a><figcaption>'+cosmos.station+' photo 1</figcaption></figure></div>');
	jQuery('#stationPhotos').append('<div class="leftCol33"><figure class="centred"><a href="'+cosmos.relativeUrl+'/cosmos/images/photos/photo1_'+cosmos.station+'.jpg" title="'+cosmos.station+' photo 2" data-featherlight="image"><img src="'+cosmos.relativeUrl+'/cosmos/images/photos/photo2_'+cosmos.station+'.jpg" alt="'+cosmos.station+' photo 2" /></a><figcaption>'+cosmos.station+' photo 2</figcaption></figure></div>');
	jQuery('#stationPhotos').append('<div class="leftCol33"><figure class="centred"><a href="'+cosmos.relativeUrl+'/cosmos/images/photos/pheno_'+cosmos.station+'.jpg" title="'+cosmos.station+' phenocam" data-featherlight="image"><img src="'+cosmos.relativeUrl+'/cosmos/images/photos/pheno_'+cosmos.station+'.jpg" alt="'+cosmos.station+' phenocam" /></a><figcaption>'+cosmos.station+' phenocam</figcaption></figure></div>');
	return;
};