jQuery Cross Subdomain
======================

This plugin allows jQuery to make cross-subdomain ajax calls.

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

```
$.xsubdomain(fullPath, [domain]);
```

Call xsubdomain with the full path to the jquery.xsubdomain.html file on the server you wish to make a cross-subdomain call to.  You can optionally pass in the domain which will be used to set document.domain.  If the domain is not provided, the function will make an educated guess based on location.hostname.  The call will return a jQuery promise object.  This is required since xsubdomain loads an iframe asynchronously.

```
var xsd = $.xsubdomain('http://alpha.example.com/jquery.xsubdomain.html');
```

The promise object can be used to attach callback functions which gets called once the iframe has finished loading.  This can be used to make the actual cross-subdomain ajax calls in your code.

```
xsd.done(callback);
```

If you don't want to use a promise object, you can also attach a callback by using the $.xsubdomain() function.  You will need to specify the domain that's associated with the callback, but if you leave it blank, it will use the first domain that was used:

```
$.xsubdomain(callback, [domain]);
```

## Example

```
var xsd = $.xsubdomain('http://alpha.example.com/jquery.xsubdomain.html');
xsd.done(function() {
  $.get('http://alpha.example.com/index.html');
});

$.xsubdomain(function() {
  $.get('http://alpha.example.com/index.html');
}, 'alpha.example.com');

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
