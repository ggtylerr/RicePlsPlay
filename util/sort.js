exports.sort = function (a,b) {
  var ar = [...a];
  if (b == 0) {
    // Default sorting
    return ar;
  } else if (b == 1) {
    // Reverse default
    return ar.reverse();
  } else if (b == 2) {
    // Alphabetical
    ar.sort(function(x,y) {
      if (x.name < y.name) return -1;
      if (x.name > y.name) return 1;
      return 0;
    });
    return ar;
  } else if (b == 3) {
    // Reverse Alphabetical
    ar.sort(function(x,y) {
      if (x.name < y.name) return 1;
      if (x.name > y.name) return -1;
      return 0;
    });
    return ar;
  } else if (b == 4) {
    // Alphabetical (name)
    ar.sort(function(x,y) {
      if (x.user < y.user) return -1;
      if (x.user > y.user) return 1;
      return 0;
    });
    return ar;
  } else if (b == 5) {
    // Reverse Alphabetical (name)
    ar.sort(function(x,y) {
      if (x.user < y.user) return 1;
      if (x.user > y.user) return -1;
      return 0;
    });
    return ar;
  } else if (b == 6) {
    // Most upvoted
    ar.sort(function(x,y) {
      if (x.up < y.up) return 1;
      if (x.up > y.up) return -1;
      return 0;
    });
    return ar;
  } else if (b == 7) {
    // Most downvoted
    ar.sort(function(x,y) {
      if (x.down < y.down) return 1;
      if (x.down > y.down) return -1;
      return 0;
    });
    return ar;
  }
}