PalletReport = new Mongo.Collection('palletreport');
BundleboxReport = new Mongo.Collection('bundleboxreport');



Tracker.autorun(function() {
  if ( Session.get('query') ) {

    if ( Session.get("isPalletCode") ) {
      var searchHandleP = Meteor.subscribe('palletSearch', Session.get('query'));
      Session.set('searching', ! searchHandleP.ready());
    }

    if ( Session.get("isBundleCode") ) {
      var searchHandleB = Meteor.subscribe('bundleSearch', Session.get('query'));
      Session.set('searching', ! searchHandleB.ready());
    }

  }
});


Template.aggregationReport.helpers({
  palletData: function(){
    return  PalletReport.find();
  },

  bundleData: function(){
    return  BundleboxReport.find();
  },

  searching: function() {
    return Session.get('searching');
  },

  tCounter: function() {
    if ( Session.get("isPalletCode") )
      return PalletReport.find().count();

    else {
      if ( Session.get("isBundleCode") )
        return BundleboxReport.find().count();
    };
  },

  serialCode: function () {
    return Session.get('query')
  },

  duplicateFound: function () {
    return Session.get("duplicateFounder");
  },

  duplicateCount: function () {
    return dupCounter;
  },
  isPallet: function () {
    return Session.get("isPalletCode")
  },
  isBundle: function () {
    return Session.get("isBundleCode")
  }

});

Template.aggregationReport.events({
  "click .btnReport": function(event, template) {
    event.preventDefault();
    var query = template.$('#inputCodeReport').val();

    if (query.length === 11) {
      Session.set("isPalletCode", true)
      Session.set("isBundleCode", false)
    }
    else if (query.length === 18) {
      Session.set("isBundleCode", true)
      Session.set("isPalletCode", false)
    }


    dupIndi.length = 0;
    dupTank1.length = 0;
    dupTank2.length = 0;
    dupFoil1.length = 0;
    dupFoil2.length = 0;
    Session.set("duplicateFounder", false);


    if (query)
      Session.set('query', query);
      // return Session.set('enteredCode', $('#inputCodeReport').val());
    template.$('#inputCodeReport').val('')
  },


  "click .btnSave": function(event, template){
    event.preventDefault();
    //PalletUID, BundleUID, ShippingUID, Topbill, Bag1, Tank1, Bag2, Tank2,	ModelType, Date, Time
    var strCodeData = [
                        "PalletUID"+"," +
                        "BundleUID"+ "," +
                        "ShippingUID"+ "," +
                        "IndiboxUID"+ "," +
                        "Topbill"+ "," +
                        "Bag1"+ "," +
                        "Tank1"+ "," +
                        "Bag2" + "," +
                        "Tank2" + "," +
                        "Type" + "," +
                        "Date" + "," +
                        "Time"
                      ];

    _.each( PalletReport.find().fetch(), function(codeResult) {

      var resultData = Session.get('query') + "," +
                       codeResult.bundlecode + "," +
                       codeResult.shipboxcode + "," +
                       codeResult.indiboxcode + "," +
                       codeResult.partnumber + "," +
                       codeResult.foil1 + "," +
                       codeResult.tank1 + "," +
                       codeResult.foil2 + "," +
                       codeResult.tank2 + "," +
                       "combopack" + "," +
                       moment(codeResult.date).format('M/D/YYYY') + "," +
                       moment(codeResult.date).format('hh : mm A')
                       ;
      strCodeData = [ strCodeData, resultData].join('\r\n');
    });
    var blob = new Blob([strCodeData], { type: "text/plain;charset=utf-8;", });
    saveAs(blob, Session.get('query') +".csv");
  },

  "click .btnReprint": function ( event, template ) {
    event.preventDefault();
    printPallet( PalletReport.findOne().partnumber, Session.get('query'), PalletReport.find().count() );
  }
});
