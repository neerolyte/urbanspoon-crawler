var util = require('util');
var $ = require('jquery');

var http = require('http');

// var url = "http://www.urbanspoon.com/r/71/1656527/restaurant/Melbourne/The-Sharing-House-South-Wharf";

var url = 'http://www.urbanspoon.com/n/71/7128/Melbourne/Southbank-restaurants';
var urlPrefix = 'http://www.urbanspoon.com';

// start crawling
getHtml(url, extractRestaurants);

/**
 * Pull URLs of a few restaurants out of a restaurants listing page
 */
function extractRestaurants(html) {
	var dom = $(html);
	var restaurants = $('#restaurants div.details div.title a', dom);
	$.each(restaurants, function(k, v) {
		var href = v.href;
		if (/restaurant/.test(href)) {
			getHtml(urlPrefix + href, extractRestaurantMeta);
		}
	});
}

function extractRestaurantMeta(html) {
	var dom = $(html);
	var body = $('div #main', dom.clone());

	var org = {};
	
	org.name = $('.page_title,.fn,.org', dom).text();
	org.address = {};
	org.address.locality = $('.locality', dom).text();
	org.address.streetAddress = $('.street-address', dom).text().trim();
	org.phone = $('.phone.tel', dom).text();

	console.log(util.inspect(org));
}

function getHtml(url, cb) {
	var req = http.get(url, function(res) { 
		res.setEncoding('utf8');
		res.body = '';
		res.on('data', function(chunk) {
			res.body += chunk;
		}); 
		res.on('end', function() {
			cb(res.body);
		});
	});
	req.end();
}
