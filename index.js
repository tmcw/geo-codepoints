var osmium = require('osmium');
var uniq = require('uniq');
require('string.prototype.codepointat');
var file = new osmium.File('./austin.osm.pbf');
var reader = new osmium.Reader(file);
var handler = new osmium.Handler();
var nodes = 0;

var squares = {};

handler.on('node',function(node) {
    var name = node.tags().name;
    if (name) {
        var sym = getSymbols(name);
        var square = Math.round(node.lon / 10) + ',' + Math.round(node.lat / 10);
        if (typeof squares[square] === 'undefined') {
            squares[square] = [];
        }
        squares[square] = squares[square].concat(sym);
    }
});

handler.on('done', function() {
    for (var square in squares) {
        uniq(squares[square]);
    }
    console.log(squares);
});

function getSymbols(string) {
  var length = string.length;
  var index = -1;
  var output = [];
  var character;
  var charCode;
  while (++index < length) {
    character = string.charAt(index);
    charCode = character.charCodeAt(0);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      // note: this doesn’t account for lone high surrogates
      output.push((character + string.charAt(++index)).codePointAt(0));
    } else {
      output.push((character).codePointAt(0));
    }
  }
  return output;
}

reader.apply(handler);
