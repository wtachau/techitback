jQuery(function($) {
	/*
	 * NOTE: Because many of these elements are added dynamically, use 
	 * $(document).on('click', "#<element>", function () { ... }); instead of 
	 * $("#<element>").click(function() { ... }); because former won't 
	 * register clicks on elements that are added later than the initial 
	 * javascript. The latter will check for the specified element.
	 */

	function yanng_listener (element, URL, replace, fade) {

		// necessary for mobile touches
		var dragging;
		$("body").on("touchstart", function(){
		 	dragging = false;
		});
		$("body").on("touchmove", function(){
		  	dragging = true;
		});

		$(document).on('click touchend', element, function (e) {
			// If touch has been dragged, cancel
			if (dragging) return;
			e.stopPropagation();

			var replaceContent = ".yanng_content";
			if (replace!= null) {
				replaceContent = replace;
			}

			$(replaceContent).html("<div id='loading_body'><img src='images/loading.gif'></div>");

			// change body
			ajaxRequest(e, URL, '', 'GET', function(data) {
				
				if (fade) {
					var timing = 50;
				    $( replaceContent ).fadeOut( timing , function(){
				    	$(replaceContent).html(data);
				    	$( replaceContent ).fadeIn( timing );
					});
			    } else {
			    	$(replaceContent).html(data);
			    }
			});
		});
	}

	// Add a listener event for element and corresponding ajax request
	[ 	// Main links	
		{'element':".yanng_home_link",	'url':'ajax/yanng_home'			, 'replace':null, 'fade':true},
		{'element':".about_link", 			'url':'ajax/yanng_about'		, 'replace':null, 'fade':true},
		{'element':".yanng_body .next_page",'url':'ajax/yanng_about2'		, 'replace':null, 'fade':true},
		{'element':"#etiquette", 			'url':'ajax/yanng_etiquette'	, 'replace':null, 'fade':true},
		{'element':"#meetus", 				'url':'ajax/yanng_meetus'		, 'replace':null, 'fade':true},
		{'element':".tips_link", 			'url':'ajax/yanng_tips'			, 'replace':null, 'fade':true},
		{'element':"#create", 				'url':'ajax/yanng_createshare'	, 'replace':null, 'fade':true},
		// Tip sections
		{'element':".tips_footer", 			'url':'ajax/yanng_etiquette'	, 'replace':null, 'fade':false},
		{'element':".tip1_link", 			'url':'ajax/yanng_tips/tips1'	, 'replace':null, 'fade':false},
		{'element':".tip2_link", 			'url':'ajax/yanng_tips/tips2'	, 'replace':null, 'fade':false},
		{'element':".tip3_link", 			'url':'ajax/yanng_tips/tips3'	, 'replace':null, 'fade':false},
		{'element':".tip4_link", 			'url':'ajax/yanng_tips/tips4'	, 'replace':null, 'fade':false},
		{'element':".tip5_link", 			'url':'ajax/yanng_tips/tips5'	, 'replace':null, 'fade':false},
		{'element':".tip6_link", 			'url':'ajax/yanng_tips/tips6'	, 'replace':null, 'fade':false},
		{'element':".tip7_link", 			'url':'ajax/yanng_tips/tips7'	, 'replace':null, 'fade':false},
		{'element':".tip8_link", 			'url':'ajax/yanng_tips/tips8'	, 'replace':null, 'fade':false},
		{'element':".tip9_link", 			'url':'ajax/yanng_tips/tips9'	, 'replace':null, 'fade':false},
		{'element':".tip10_link", 			'url':'ajax/yanng_tips/tips10'	, 'replace':null, 'fade':false},
		{'element':".tip11_link", 			'url':'ajax/yanng_tips/tips11'	, 'replace':null, 'fade':false},
		{'element':".tip12_link", 			'url':'ajax/yanng_tips/tips12'	, 'replace':null, 'fade':false},
		{'element':".tip13_link", 			'url':'ajax/yanng_tips/tips13'	, 'replace':null, 'fade':false},
		// Meet Us sections
		{'element':".meetus_body", 				'url':'ajax/yanng_meetus'		, 'replace':null, 'fade':true},
		{'element':".meetus_body #shlee img",	'url':'ajax/yanng_girls/shlee'	, 'replace':".meetus_body .row_container", 'fade':false},
		{'element':".meetus_body #goldie img",	'url':'ajax/yanng_girls/goldie'	, 'replace':".meetus_body .row_container", 'fade':false},
		{'element':".meetus_body #yumi img",	'url':'ajax/yanng_girls/yumi'	, 'replace':".meetus_body .row_container", 'fade':false}

		
	].map( function(listener) {
		yanng_listener(listener['element'], listener['url'], listener['replace']);
	} );

	// If there is a hash (i.e. techitback.com#games), then go there
	var hash;
	if (hash = window.location.hash.replace('#','.')) {
		console.log(hash);
		if ('.create' == hash) {
			$(document).ready(function () {
				ajaxRequest(null, "ajax/yanng_createshare", '', 'GET', function(data) {
					$(".yanng_content").html(data);
					document.location.hash = ''
				}); 
			});
		}
	}

	// Adding anchor element makes formatting weird, so listen for .yanng_main_link
	$(document).on('click touchend', ".yanng_main_link", function (e) {
		document.location = "/";
	});

	// "Email gate" YANNG book
 	$(document).on('click', "a[href='YANNG_ebook.pdf']", function (e) {
		e.preventDefault();
		var email = prompt("Please enter your email to access the free book!", "");
		var link = this.href;
		if (email != null) {
			if (!validateEmail(email)) {
				alert("Sorry! That doesn't look like a valid email address. Please try again.");
			} else {
				$.ajax(
				{
					url: "/form/schools/join",
					type: "POST",
					data: {"email": email},
					success:function(data, textStatus, jqXHR) {
						document.location = link;
					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert("Sorry! We couldn't add your email. Please try again.")
					}
				});
			}
		}	
	});

	/* USER CREATE AND SHARE */
	var addCounter = function(body, num) {
		var oldValue = "";
		$(document).on('keyup', body, function() {
			var maxwords = $(this).attr('maxwords');
			if (!maxwords) maxwords = 120;

			var count = countWords($(this).val());
			if (count > maxwords) {
				$(this).val(oldValue);
				console.log("reached max");
			} else {
				oldValue = $(this).val();
			}
			if (num == 0) 
				$(".counter span").first().html(count);
			else
				$(".counter span").last().html(count);
		});
	}
	// Update text counters
	addCounter(".create_body textarea[name='yes_box']", 0);
	addCounter(".create_body textarea[name='no_box']", 1);


	// $(document).on('keyup', ".create_body textarea[name='yes_box']", function() {
	// 	$(".counter span").first().html($(this).val().length);
	// })
	// $(document).on('keyup', ".create_body textarea[name='no_box']", function() {
	// 	$("div.counter span").last().html($(this).val().length);
	// })

	// User clicks to second page
	$(document).on('click', "#createsharenext", function (e) {
		// Verify user entered age and country
		if (!formValidate1()) return;

		$(".first_page_only").hide()
		$(".second_page_only").show();
		$(".create_body textarea").prop("disabled", true);
	});

	// User clicks back to first
	$(document).on('click', "#createshareedit", function (e) {
		$(".first_page_only").show()
		$(".second_page_only").hide();
		$(".create_body textarea").prop("disabled", false);
	});

	// Override default action for 'Create + Share' form 
	$(document).on("submit", "#createshareform", function(e) {
		e.preventDefault();

		// Verify appropriate combination of checkboxes is selected
		if (!formValidate2()) return;

		var formAppendage = '<input style="display:none;" name="name_can_use" value="' + $("input[name='name']").first().is(':checked') + '" />';
		$(".create_body textarea").prop("disabled", false);
		var postData = $(this).append(formAppendage).serializeArray();
		var formURL = $(this).attr("action");
		$.ajax(
		{
			url: formURL,
			type: "POST",
			data: postData,
			success:function(data, textStatus, jqXHR) {
				$(".yanng_content").html(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown + ": " + textStatus);
			}
		});
	});

	var formValidate1 = function() {
		if ($("input[name='age']").val().length < 1) {
			alert("Please enter your age");
			return false;
		} else if ($("input[name='country']").val().length < 1) {
			alert("Please enter your country");
			return false;
		} else if ($(".create_body textarea").first().val().length < 1) {
			alert("Please enter your 'Yes' tip!");
			return false;
		} else if ($(".create_body textarea").last().val().length < 1) {
			alert("Please enter your 'No No' tip!");
			return false;
		}
		return true;
	}

	var formValidate2 = function() {
		if ($("input[name='name']:checked").length < 1) {
			alert("Please select whether you would like your name used");
			return false;
		} else if ($("input[name='agree']:checked").length < 1) {
			alert("In order to submit a Yes and No No tip, you must agree to the terms and conditions");
			return false;
		}
		return true;
	}



	/* JOIN THE HOUR */

	// Override default action for 'Create + Share' form 
	$(document).on("submit", ".jointhehour form", function(e) {
		e.preventDefault();

		var postData = $(this).serializeArray();
		var formURL = $(this).attr("action");
		$.ajax(
		{
			url: formURL,
			type: "POST",
			data: postData,
			success:function(data, textStatus, jqXHR) {
				$(".jointhehour").html(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown + ": " + textStatus);
			}
		});
	});
});