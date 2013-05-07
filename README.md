jquery-cross-subdomain
======================

Plugin to allow jquery ajax calls to be made a cross-subdomains

## Installation

Assume you have two servers set up:

* www.example.com - server making the ajax request (source)
* alpha.example.com - server receiving the ajax request (destination)

Copy the following files:

* jquery.xsubdomain.js onto the source server (www.example.com)
* jquery.xsubdomain.html onto the destination server (alpha.example.com)

Finally, on the source server, link the plugin file after jQuery has loaded:

```
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="jquery.xsubdomain.js"></script>
```

## Usage

Call jQuery.xsubdomain(fullPath) with the full path to the jquery.xsubdomain.html file on the server you wish to make a cross-subdomain call to.  The call will return a jQuery promise object.  This is required since xsubdomain loads an iframe asynchronously.

```
var xsd = $.xsubdomain('http://alpha.example.com/jquery.xsubdomain.html');
```

The promise object can be used to attach callback functions which gets called once the iframe has finished loading.  This can be used to make the actual cross-subdomain ajax calls in your code.

```
xsd.done(function() {
  $.get('http://alpha.example.com/index.html');
});
```

## Example

```var xsd = $.xsubdomain('http://alpha.example.com/jquery.xsubdomain.html');
xsd.done(function() {
  $.get('http://alpha.example.com/index.html');
});

$('#test-button').on('click', function() {
  xsd.done(function() {
    $.get('http://alpha.example.com/index.html')
  });
});

$.xsubdomain('http://beta.example.com/jquery.xsubdomain.html').done(function() {
  $.get('http://beta.example.com/index.html')
});
```

The example in this repository assumes you have www.example.com, alpha.example.com, & beta.example.com all pointing to the same server
