jquery-cross-subdomain
======================

Plugin to allow jquery ajax calls to be made across subdomains

### Usage

Call jQuery.xsubdomain(fullPath) with the full path to the jquery.xsubdomain.html file on the server you wish to make a XSD call to.  The call will return a jQuery Promise object.  This is required since the xsubdomain loads an iframe asynchronously, so callbacks will be processed once everything has finished loading.

```var xsd = $.xsubdomain('http://alpha.example.com/jquery.xsubdomain.html');
```

### Example

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

