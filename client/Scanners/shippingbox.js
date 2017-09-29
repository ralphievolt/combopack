ListerShipbox = new Meteor.Collection(null);

Template.scanner2.helpers({
  shippingboxList: function() {
    return ListerShipbox.find({date:{$gt: Session.get("port2OpenTime")}},{ fields: {indibox: 1}, sort: { date: -1} });
  },
  shippingboxListCount: function() {
    var shipboxCounter = ListerShipbox.find({date:{$gt: Session.get("port2OpenTime")}},{fields: {indibox: 1}}).count();

    if ( shipboxCounter === Session.get( "insideShipbox") ) {

      var shipBoxCode = GenCaseCode(Session.get("poPN"));
      var indiArray = ListerShipbox.find({date:{$gt: Session.get("port2OpenTime")}},{fields: {indibox: 1 }}).fetch();
      var indiCount = ListerShipbox.find({date:{$gt: Session.get("port2OpenTime")}}).count();
      var id = SeriesMonitor.findOne()._id;

      if ( indiCount > 0 ) {
        _.each(indiArray, function(indiboxes) {
          Meteor.call( "aggregateShipbox", shipBoxCode, indiboxes.indibox, function ( error, result ) {
            if (error){
              bootbox.alert("error", error);

            }
            if (result !== "") {

            }
          });
        }); //_each

        // debug: transfer printCase and updateSeriesMonitor to prevent multiple print
        // have if option if all indibox successfully save in db
        Session.set ("port2OpenTime", new Date());
        printCase( shipBoxCode, indiCount );
        Meteor.call ( "updateSeriesMonitor", id, function ( error, result ) {
          if ( error ) {

            tmpl.find('#inputBarcode').focus();
          }
          if ( result ) {

          }
        }); // Meteor.call updateSeriesMonitor
      } //indiCount > 0

    }
    else
      return shipboxCounter
  }
});

Template.scanner2.events({
  "click .btnAggregate2":  function (evt, tmpl) {
    var shipBoxCode = GenCaseCode(Session.get("poPN"));
    var indiArray = ListerShipbox.find({date:{$gt: Session.get("port2OpenTime")}},{fields: {indibox: 1, _id: 0}}).fetch();
    var indiCount = ListerShipbox.find({date:{$gt: Session.get("port2OpenTime")}}).count();
    var id = SeriesMonitor.findOne()._id;


    if ( indiCount > 0 ) {
      _.each(indiArray, function(indiboxes) {
        Meteor.call("aggregateShipbox", shipBoxCode, indiboxes.indibox, function ( error, result ) {
          if (error){
            bootbox.alert("error", error);

          }
          if (result !== "") {

          }
        });
      }); //_each
      // debug: transfer printCase and updateSeriesMonitor to prevent multiple print
      // have if option if all indibox successfully save in db

      Session.set ("port2OpenTime", new Date());
      printCase( shipBoxCode, indiCount );
      Meteor.call ("updateSeriesMonitor", id, function ( error, result ) {
        if ( error ) {
          bootbox.alert("error", error);

        }
        if ( result ) {

        }
      }); // Meteor.call updateSeriesMonitor
    } //indiCount > 0
    tmpl.find('#inputBarcode').focus();
  },

  "click #openScannerPort2": function(){
    var opencb = $('#openScannerPort1').prop('checked');
    if (opencb === false) {
      Session.set("port2OpenTime", new Date());
    } else {
      Session.set("port2OpenTime", new Date());
    }
  },

  "keypress #inputBarcode": function(evt, tmpl) {
    var scanCode = tmpl.find('#inputBarcode').value.toUpperCase();

    if ( evt.keyCode === 13 ) {

      if ( ListerShipbox.find({indibox:scanCode}).count() === 0 && tmpl.find('#inputBarcode').value.length === 17 && scanCode.substring(0,9) === Session.get("poPN") ) {
        //===================================================================================
        Meteor.call("checkIndiboxEmpty", scanCode, function ( error, result ) {
          if ( error ) {
            bootbox.alert ("error", error);

          }
          else {
            if (result.length < 1 ) {
              bootbox.alert (" Indibox Empty");
            }
            else {
              ListerShipbox.insert({
                indibox: scanCode,
                date: new Date()
              });
              tmpl.find('#inputBarcode').value = null;
              tmpl.find('#inputBarcode').focus();

            } // result.length
          }
        }); // Meteor.call("checkFoilEmpty"

        //===================================================================================
      }
      else {
        // bootbox.alert("Duplicate or Invalid barcodes");
        bootbox.confirm("Duplicate or Invalid barcodes", function (result) {
          if (result) {
            $('#inputBarcode').focus();
            tmpl.find('#inputBarcode').value = null;

          };
        });
      }
    } //if evt.keyCode
  },

  "click .glyphicon-trash": function() {
    ListerShipbox.remove(this._id);
  }
});
