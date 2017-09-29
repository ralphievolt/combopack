ListerBundlebox = new Meteor.Collection(null);

Template.scanner3.helpers({
  bundleboxList: function() {
    return ListerBundlebox.find({date:{$gt: Session.get("port3OpenTime")}}, {fields: {shippingbox: 1}, sort: { date: -1 }});
  },
  bundleboxListCount: function() {
    var bundleboxCounter = ListerBundlebox.find({date:{$gt: Session.get("port3OpenTime")}},{fields: {shippingbox: 1}}).count();

    if ( bundleboxCounter === Session.get( "insideBundlebox") ) {

      var bundleBoxCode = GenCaseCode(Session.get("poPN"));
      var shipboxarray = ListerBundlebox.find({date:{$gt: Session.get("port3OpenTime")}}, {fields: {shippingbox: 1 }}).fetch();
      var shipboxCount = ListerBundlebox.find({date:{$gt: Session.get("port3OpenTime")}}).count();
      var id = SeriesMonitor.findOne()._id;

      if ( shipboxCount > 0 ) {
        _.each(shipboxarray, function(shipboxes) {
          Meteor.call("aggregateBundlebox", bundleBoxCode, shipboxes.shippingbox, function(error, result) {
            if ( error ) {
              bootbox.alert("error", error);
            }
            if ( result !== "" ) {

            }
          }); // Meteor.call("aggregateBundlebox")
        }); // _.each

        Session.set("port3OpenTime", new Date());
        printCase ( bundleBoxCode, shipboxCount );
        Meteor.call("updateSeriesMonitor", id, function(error, result) {
          if ( error ) {
            bootbox.alert("error", error);
          }
          if ( result ) {

          }
        }); //Meteor.call("updateSeriesMonitor")
      } //shipboxCount > 0

    }
    else
      return bundleboxCounter
  }

});

Template.scanner3.events({

  "click .btnAggregate3": function (evt, tmpl) {
    var bundleBoxCode = GenCaseCode(Session.get("poPN"));
    var shipboxarray = ListerBundlebox.find({date:{$gt: Session.get("port3OpenTime")}}, {fields: {shippingbox: 1 }}).fetch();
    var shipboxCount = ListerBundlebox.find({date:{$gt: Session.get("port3OpenTime")}}).count();
    var id = SeriesMonitor.findOne()._id;

    if ( shipboxCount > 0 ) {
      _.each(shipboxarray, function(shipboxes) {
        Meteor.call("aggregateBundlebox", bundleBoxCode, shipboxes.shippingbox, function(error, result) {
          if(error){
            bootbox.alert("error", error);
          }
          if (result !== "") {

          }
        }); // Meteor.call("aggregateBundlebox")
      }); // _.each

      Session.set("port3OpenTime", new Date());
      printCase ( bundleBoxCode, shipboxCount );
      Meteor.call("updateSeriesMonitor", id, function(error, result) {
        if(error){
          bootbox.alert("error", error);
        }
        if(result){

        }
      }); //Meteor.call("updateSeriesMonitor")
    } //shipboxCount > 0
    tmpl.find('#inputBarcode').focus();
  },

  "click #openScannerPort3": function(){
    var opencb = $('#openScannerPort3').prop('checked');

    if (opencb === false) {
      Session.set("port3OpenTime", new Date());
    } else {

      Session.set("port3OpenTime", new Date());
    }
  },

  "keypress #inputBarcode": function(evt, tmpl){
    if(evt.keyCode === 13) {
      if ( ListerBundlebox.find({shippingbox:tmpl.find('#inputBarcode').value.toUpperCase()}).count() === 0 &&
           tmpl.find('#inputBarcode').value.length === 18 ) {
        ListerBundlebox.insert({
          shippingbox: tmpl.find('#inputBarcode').value.toUpperCase(),
          date: new Date()
        });
        tmpl.find('#inputBarcode').value = null;
      }
      else {
        bootbox.alert("Duplicate or Invalid barcode");
      }
    }
  },

  "click .glyphicon-trash": function() {
    ListerBundlebox.remove(this._id);
  }
});
