!function($) {
var _settings = {};
var _initialized = false;
var _domainRegex = /(?:^https?:\/\/|^\/\/)([^\/:]+)/;

function xdHostname(url) {
  var parts = url.match(_domainRegex);
  if (parts && parts[1] != window.location.hostname) return parts[1];
}

$.xsubdomain = function(arg1, domain) {
  var fullPath, callback, xdhost;

  if (typeof arg1 == 'string') {
    fullPath = arg1;
    xdhost = xdHostname(fullPath);
    if (!xdhost) return;
  }
  else if (typeof arg1 == 'function') {
    callback = arg1;
    xdhost = domain || (function() {
      for (var i in _settings) return i;
    })();
    return xdhost ? _settings[xdhost].deferred.done(callback) : callback();
  }

  // Check for duplicate loads
  if (_settings[xdhost] && _settings[xdhost].xhr) return _settings[xdhost].deferred.promise();

  _settings[xdhost] = {
    path: fullPath,
    deferred: $.Deferred()
  };

  if (!_initialized) {
    _initialized = true;

    // Autodetect domain if not defined
    if (!domain) {
      var parts = window.location.hostname.split('.');
      parts.shift();
      domain = parts.join('.');
    }
    _settings.domain = domain;
    window.document.domain = domain;

    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
      var xdhost = xdHostname(options.url);
      if (xdhost && _settings[xdhost].xhr) {
        $.support.cors = true;
        options.crossDomain = true;
        options.xhr = _settings[xdhost].xhr;
      }
    });
  }

  // Check for duplicate loads
  var iframeHTML = '<iframe src="' + fullPath.replace(/https?:/, '') + (fullPath.indexOf('?') >= 0 ? '&' : '?') + 'hostname=' + _settings.domain + '" style="width:0;height:0;display:none"></iframe>';

  if ($('body').length) {
    $('body').prepend(iframeHTML);
  }
  else {
    try {
      document.write(iframeHTML);
    } catch (e) {
      $(function() {$('body').append(iframeHTML);});
    }
  }

  return _settings[xdhost].deferred.promise();
};

// Called from iframe
$.xsubdomain.register = function(win) {
  var host = win.location.hostname;

  function createStandardXHR() {
    try {
      return new win.XMLHttpRequest();
    } catch( e ) {}
  }

  function createActiveXHR() {
    try {
      return new win.ActiveXObject("Microsoft.XMLHTTP");
    } catch( e ) {}
  }

  _settings[host].xhr = win.ActiveXObject ?
    function() {
      return !this.isLocal && createStandardXHR() || createActiveXHR();
    } :
    createStandardXHR;

  _settings[host].deferred.resolve();

  // for Prototype
  if (window.Prototype && window.Ajax) {
    Ajax.xd_getTransport = function() {
      return Try.these(
        function() {return new win.XMLHttpRequest()},
        function() {return new win.ActiveXObject('Msxml2.XMLHTTP')},
        function() {return new win.ActiveXObject('Microsoft.XMLHTTP')}
      ) || false;
    };

    if (Ajax.xd_frameLoaded) {
      Ajax.xd_frameLoaded();
    }
  }
};

}(jQuery);
