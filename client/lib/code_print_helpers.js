convertB30 = function (src) {
  var BASE10 = "0123456789";
    //  var BASE30 = "0123456789ABCDEFGHIJKLMNOPQRST";
  var BASE30 = "0123456789BCDFGHJKLMNPRSTVWXYZ";
  var srclen = BASE10.length;
  var destlen = BASE30.length;
  var val = 0;
  var numlen = src.length;
  for (var i = 0; i < numlen; i ++) {
    val = val * srclen + BASE10.indexOf(src.charAt(i));  // first convert to base 10
  }


  if (val < 0) { return 0; }

    // then covert to any base
    var r = val % destlen;
    var res = BASE30.charAt(r);
    var q = Math.floor(val / destlen);
    //   this will stop when q is <= 0. no need to put condition
    while (q)  {
      r = q % destlen;
      q = Math.floor(q / destlen);
      res =  BASE30.charAt(r) + res;
    }
    return res;
  };

dateConvert = function (src) {
  var dateBASE30 = "0123456789ABCDEFGHJKLMNPQRSTUVWX";
  var dateRes = dateBASE30.charAt(src);
  return dateRes;
};

zeroAppender = function (sourceNum) {
  var appendResult;
  switch (sourceNum.length) {
    case 1:
      appendResult = "00000" + sourceNum;
      break;
    case 2:
      appendResult = "0000" + sourceNum;
      break;
    case 3:
      appendResult = "000" + sourceNum;
      break;
    case 4:
      appendResult = "00" + sourceNum;
      break;
    case 5:
      appendResult = "0" + sourceNum;
      break;
    case 6:
      appendResult = sourceNum;
      break;
    }
    return appendResult;
};

GenPalletCode = function(pref) {
  var printsCounterPal = SeriesMonitor.findOne().count;
  return pref +
          moment().format('YY').substring(1)  +
          dateConvert(moment().format('M'))   +
          dateConvert(moment().format('D'))   +
          zeroAppender(convertB30(printsCounterPal.toString()));
};

GenCaseCode = function(pn) {
  var printsCounter = SeriesMonitor.findOne().count;
  return pn +
          moment().format('YY').substring(1)  +
          dateConvert(moment().format('M'))   +
          dateConvert(moment().format('D'))   +
          zeroAppender(convertB30(printsCounter.toString()));
};

printCase = function( serial, qty ) {
  var printfileCase = [ serial.substr(0,9), qty, serial, 1 ];
  var blob = new Blob([printfileCase], {type: "text/plain;charset=utf-8;", });
  saveAs(blob, "case_"+ serial + ".TXT");
};

printPallet = function( pn, serial, qty ) {
  // var printfileCase = [
  // "LABELNAME=\"C:\\Lotus Label Format\\PALLET.lbl\"",
  // "PALLET_CODE=\""+ serial + "\"",
  // "COUNT_CODE=\"24\"",
  // "MFG_PN_CODE=\"" + pn + "\"",
  // "LABELQUANTITY=4"
  // ].join('\r\n');

  var printfileCase = [ serial, qty, pn, 4 ]
  var blob = new Blob([printfileCase], {type: "text/plain;charset=utf-8;", });
  saveAs(blob, "pallet_"+ serial + ".DAT");
};

alphanumeric_unique = function(strlength) {
  return Math.random().toString(36).split('').filter( function(value, index, self) {
    return self.indexOf(value) === index;
  }).join('').substr(2,strlength).toUpperCase();
};
