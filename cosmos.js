var cosmos = {};
cosmos.init = function()
{
	//jquery ui tabs for the details, graphs and maps tabs
	$( "#stationTabs" ).tabs();
	//add a magnifying glass on the lightbox images
	$('figure').prepend('<i class="fa fa-search-plus"></i>');
	//featherlight doesn't add captions to images by default, so extra code here to add it from the alt text.
	$.featherlight.prototype.afterContent = function() {
	  var caption = this.$currentTarget.find('img').attr('alt');
	  this.$instance.find('.caption').remove();
	  $('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
	};
}
$(document).ready(cosmos.init);