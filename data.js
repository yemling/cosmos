var cosmos = {};
cosmos.relativeUrl = 'http://localhost:8080';
//cosmos.relativeUrl = 'http://wlarcgis2.nerc-wallingford.ac.uk/cosmos/';
cosmos.stylesheets = [cosmos.relativeUrl+'/includes/map.css', cosmos.relativeUrl+'/includes/loading.css', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'];

//use the below if on Drupal server
/* (function($){
    Drupal.behaviors.jspageLoad = {
       attach: function(context, settings) {
         var jspage = jQuery('#' + settings.jspage.divId);
         jspage.once('jspageLoad', function() {
            jspage.empty();
            cosmos.getStyleSheets();
            //need to wait for stylesheets to load...
            setTimeout(function () {
                cosmos.renderPage();
                cosmos.drawMap();
                cosmos.getSiteData();
            }, 1000);
            
         });
       }
   } 
})(jQuery); */

//use the below if no Drupal connection
cosmos.init = function()
{
    cosmos.getStyleSheets();
    //need to wait for stylesheets to load...
    setTimeout(function () {
        cosmos.renderPage();
        cosmos.drawMap();
        cosmos.getSiteData();
    }, 1000);
    return;
} 
$(document).ready(cosmos.init);
cosmos.getStyleSheets = function()
{
	for (var l = 0; l < cosmos.stylesheets.length; l++)
	{
		jQuery('head').append('<link href="'+cosmos.stylesheets[l]+'" type="text/css" rel="stylesheet" />');
	}
	return;
}
cosmos.renderPage = function()
{
    jQuery('#jspageDiv').append('<div id="mapid" class="leftCol50"><div id="vwcKey"><h4>VWC percent</h4></div></div>');
    jQuery('#jspageDiv').append('<div id="siteData" class="rightCol50"></div>');
    jQuery('#siteData').append('<p><label for="tableFilterTxt">Filter sites: </label><input type="text" name="tableFilterTxt" id="tableFilterTxt" /></p>')
    jQuery('#siteData').append('<div id="tableContainer"><table id="siteDetailTable"><tr><th>See on map</th><th>View details</th></tr></table></div>');
}
cosmos.drawMap = function(stationData)
{
	var osmUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VtbWF2bmFzaCIsImEiOiJjamdwNjR5YzMwZTc5MndtZDJteDFpY3lwIn0.3Exi_QhPZuuxHRcBXmpo5A';
	var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
	var osmId = 'mapbox.streets-satellite';
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
		"Satellite" :sateliteMap
	};
	cosmos.map = L.map('mapid', {
		layers: [sateliteMap], 
		center:[55,-4.17], 
			zoom:6
    });
    L.control.layers(baseMaps).addTo(cosmos.map);
	return;
}
cosmos.getSiteData = function()
{
	var siteDataUrl = 'https://nrfaapps.ceh.ac.uk/nrfa/json/cosmos-summary?parameter=COSMOS_VWC_1DAY&days=15';
	jQuery.ajax({
		url:siteDataUrl,
		success:cosmos.outputSiteData,
		error: function(jqXHR,textStatus,errorThrown){
			jQuery('#jspageDiv').html('<p>Sorry, can\'t load site data just now.</p>');
		}
	});
}
cosmos.markerCSS = function(bgColor)
{
    var markerHtmlStyles = 'background: '+bgColor+';';
    markerHtmlStyles += 'background: -moz-radial-gradient(center, ellipse cover, '+bgColor+' 50%, '+bgColor+' 50%, #000000 100%)';
    markerHtmlStyles += 'background: -webkit-radial-gradient(center, ellipse cover, '+bgColor+' 50%, '+bgColor+' 50%,#000000 100%);';
    markerHtmlStyles += 'background: radial-gradient(ellipse at center, '+bgColor+' 50%,'+bgColor+' 50%,#000000 100%);';
    markerHtmlStyles += 'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='+bgColor+', endColorstr=\'#000000\',GradientType=1 );';
    markerHtmlStyles += 'background: radial-gradient(circle,'+bgColor+',#ddd);';
    markerHtmlStyles += 'display: block;';
    markerHtmlStyles += 'width:12px;';
    markerHtmlStyles += 'height:12px;';
    markerHtmlStyles += 'position: relative;';
    markerHtmlStyles += 'border-radius: 6px;';
    return markerHtmlStyles;
}
cosmos.generateIcon = function(bgColor)
{
    var markerHtmlStyles = cosmos.markerCSS(bgColor);
    var icon = L.divIcon({
        iconSize: [12, 12],
        className: "my-custom-pin",
        html: '<span style="'+markerHtmlStyles+'" />'
    });
    return icon;
}
cosmos.outputSiteData = function(siteData)
{
    //console.log(siteData);
    cosmos.markers = L.featureGroup();
    cosmos.markerCircles = [];
    var sites = siteData.sites;
    var i;
    var markerColors = [
        {min:0, max:20, key:'0-20',color:'rgb(228,229,28)'},
        {min:20, max:40, key:'20-40',color:'rgb(188,201,66)'},
        {min:40, max:60, key:'40-60',color:'rgb(113,191,68)'},
        {min:60, max:80, key:'60-80',color:'rgb(57,199,244)'},
        {min:80, max:100, key:'80-100',color:'rgb(73,90,168)'}
    ];
    var c;
    for(c=0; c<markerColors.length;c++)
    {
        var colorKey = markerColors[c];
        jQuery('#vwcKey').append('<div><span class="leftCol33">'+colorKey.key+': </span><span class="floatLeft" style="'+cosmos.markerCSS(colorKey.color)+'"></span><br clear="all" /></div>');
    }
    //Uncalibrated
    jQuery('#vwcKey').append('<span style="float:left;">Uncalibrated: </span><span style="'+cosmos.markerCSS('rgb(0,0,0)')+'; float:left;"></span>');
    for(i=0; i<sites.length;i++)
    {
        var site = sites[i];
        var stationCoords = [parseFloat(site.latitude),parseFloat(site.longitude)];
        var siteLocation = site["name"];
        var markerBackgroundColor = '';
        var vwcSum ='';
        var siteVWC = jQuery.grep(siteData.data,function(d,j){
            return (d.site === site.id)
        });
        if(site.id != 'JUNG')
        {
            if(typeof site["region"] != 'undefined' && site["region"] != null)
            {
                siteLocation += ', ' + site["region"];
            }
            if(siteVWC.length > 0)
            {
                vwcSum = siteVWC[siteVWC.length-1].sum;
                var k;
                for(k=0; k<markerColors.length;k++)
                {
                    var colorKey = markerColors[k];
                    if(vwcSum >= colorKey.min && vwcSum <=colorKey.max)
                    {
                        markerBackgroundColor = colorKey.color;
                        var vwcTxt = 'VWC is ' + colorKey.key + '% (' + vwcSum + ')';
                        siteTitle = siteLocation + '. ' + vwcTxt;
                    }
                }
            }
            else
            {
                vwcTxt = '';
                markerBackgroundColor ='rgb(0,0,0)';
                siteTitle = siteLocation;
                console.log('Uncalibrated: ', site.id);
            }
            var markerIcon = cosmos.generateIcon(markerBackgroundColor);
            var siteMarker = L.marker(stationCoords, {id:site.id, title:siteTitle, icon:markerIcon}).addTo(cosmos.map).on('click',cosmos.setMarkerIcon).addTo(cosmos.markers);
            var siteCircle = L.circleMarker(stationCoords, {radius: 10});
            jQuery('#siteDetailTable').append('<tr><td class="siteCell" rel="'+site.id+'" title="Highlight '+site["name"]+' on the map" style="'+cosmos.markerCSS(markerBackgroundColor)+'">&nbsp;&nbsp;&nbsp;</td><td><a href="/sites/'+site.id+'" title="View details about '+siteLocation+'">'+siteLocation+'.</a></td></tr>');
            siteMarker.bindPopup('<a href="/sites/'+site.id+'">'+siteLocation+'</a><br />' + vwcTxt);
            cosmos.markerCircles.push(siteCircle);
        };
    };
    jQuery('#tableFilterTxt').keyup(function()
    {
        wrUtils.filterTable('siteDetailTable');
    });
    //cosmos.map.fitBounds(cosmos.markers.getBounds());
    jQuery('.siteCell').click(cosmos.highlightSite);
}
cosmos.highlightSite = function(e)
{
    var site = e.target;
    var siteId = jQuery(site).attr('rel');
    //get the marker in the markers array
    var marker = jQuery.grep(cosmos.markers.getLayers(),function(m,i){
        return (m.options.id === siteId)
    });
    jQuery(".siteCell").parents('tr').removeClass('highlighted');
    if(marker.length)
    {
        cosmos.setMarkerIcon(marker[0]);
        marker[0].openPopup();
        jQuery(site).parents('tr').addClass('highlighted');
    }
    return;
}
cosmos.setMarkerIcon = function(ele)
{
    var marker = ele;
    jQuery('#tableFilterTxt').val('');
    //make all table rows visible (if they've been filtered) and cells unhighlighted
    jQuery(".siteCell").parents('tr').removeClass('highlighted').parents().show();
    //check whether marker is clicked on from the map, ele will contain the whole event if it is from the map, so need to tell it to access the target (which is the marker).
    if(typeof ele.target != 'undefined')
    {
        marker = ele.target;
        var siteCell = jQuery(".siteCell[rel="+marker.options.id+"]");
        siteCell.parents('tr').addClass('highlighted');        
    }
    var markerCoords = marker.getLatLng();
    /* cosmos.markers.getLayers().forEach(marker  => {
        marker.setIcon(cosmos.redIcon);
    }); */
    var c;
    for(c=0; c<cosmos.markerCircles.length; c++)
    {
        var circle = cosmos.markerCircles[c];
        if(circle.getLatLng().lat === markerCoords.lat && circle.getLatLng().lng === markerCoords.lng)
        {
            circle.addTo(cosmos.map);
        }
        else
        {
            cosmos.map.removeLayer(circle);
        }
    };
    //change it's colour and open a details popup
    //marker.setIcon(cosmos.blueIcon);
    //cosmos.map.setView(markerCoords, 15);
    return;
}