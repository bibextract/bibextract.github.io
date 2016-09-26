function processReferences(referencesId, textId, callback) {
    var p = new DOMParser();

    var references = p.parseFromString(document.getElementById(referencesId).value, 'text/html')
    var text = p.parseFromString(document.getElementById(textId).value, 'text/html')
    
    var citations = text.querySelectorAll('a.citation');

    var referencesList = references.getElementsByTagName('ul')[0];
    if (!$(referencesList).hasClass('references')) {
	$('.references').addClass('has-error');
	return;
    }
    $('.references').removeClass('has-error');
    var used = referencesList.cloneNode(false);
    
    var missing = {};

    for (var i = 0; i < citations.length; i++ ) {
	var id = citations[i].hash.substr(1)
	var reference = references.getElementById(id);
	if (!reference) {
	    missing[id] = true;
	} else {
	    used.appendChild(reference);
	}
    }

    callback(used.outerHTML, missing);
}

function showResults(citations, missing) {
    $('#output').val(citations)
    var errors = $('.result-errors');
    errors.empty();
    Object.keys(missing).forEach(function(id) {
	$('<div class="alert alert-danger"><strong>Missing reference</strong> The text cites "'+id+'" but there is no reference with that id</div>').appendTo(errors);
    });
    $('.result').modal();
    $('#output').select();
}
