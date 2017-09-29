ListerPallet = new Meteor.Collection(null);


Template.scanner4.helpers({
  palletList: function() {
    return ListerPallet.find({date:{$gt: Session.get("port4OpenTime")}},{ fields: {bundlebox: 1}, sort: {date: -1} });
  },
  palletListCount: function() {
    return ListerPallet.find({date:{$gt: Session.get("port4OpenTime")}},{fields: {bundlebox: 1}}).count();
  }
});


Template.scanner4.events({

  "click .btnAggregate4": function (evt, tmpl) {
    var bundleboxCount = ListerPallet.find({date:{$gt: Session.get("port4OpenTime")}}).count();

    if ( bundleboxCount > 0 ) {
      Meteor.call('prefFinder', Session.get("poPN"), function(error, result) {
        if (error) {
          bootbox.alert('Cannot Pallet prefix');
        }
        else {
          if (result.length > 0) {
            prefix = result[0].palletprefix;

            var palletBoxCode = GenPalletCode(prefix);
            var bundleboxarray = ListerPallet.find({date:{$gt: Session.get("port4OpenTime")}}, {fields: {_id: 0 , date:0}}).fetch();

            _.each( bundleboxarray, function (bundleboxes) {
              Meteor.call("aggregatePallet", [Session.get("poPN"), palletBoxCode], bundleboxes.bundlebox, function (error, result) {
                if (error) {
                  bootbox.alert("Error: Cannot aggregate Pallet", error);
                }
                if (result !== "") {

                } // result !== ""
                }); // aggregatePallet
              }); //_.each

            Meteor.call("palletIndiCounter", palletBoxCode, function (error, result) {
              if (error) {
                bootbox.alert("Error: Cannot count # of Tanks inside the pallet", error);
              }
              if (result) {
                if (result.length > 0) {
                  indcount= result[0].indicount;
                  printPallet( Session.get("poPN"), palletBoxCode, indcount );
                  printPallet( Session.get("poPN"), palletBoxCode, indcount );
                  printPallet( Session.get("poPN"), palletBoxCode, indcount );
                  printPallet( Session.get("poPN"), palletBoxCode, indcount );

                  Session.set("port4OpenTime", new Date());
                  var id = SeriesMonitor.findOne()._id;
                  Meteor.call("updateSeriesMonitor", id, function(error, result) {
                    if(error){
                      bootbox.alert("error", error);
                    }
                    if(result){

                    }
                  });
                }
                else
                  console.log("empty");
                }
              }); // call palletIndiCounter

            }
            else
              bootbox.alert('Part Number not found in SKU');
        } // prefFinder else
      }); // prefFinder
    } // bundleboxCount > 0
    tmpl.find('#inputBarcode').focus();
  },

  "click #openScannerPort4": function(){
    var opencb = $('#openScannerPort4').prop('checked');

    if (opencb === false) {
      Session.set("port4OpenTime", new Date());
    } else {
      Session.set("port4OpenTime", new Date());
    }
  },

  "keypress #inputBarcode": function(evt, tmpl){
    if(evt.keyCode === 13) {
      if ( ListerPallet.find({bundlebox:tmpl.find('#inputBarcode').value.toUpperCase()}).count() === 0 &&
        tmpl.find('#inputBarcode').value.length === 18 ) {
        ListerPallet.insert({
          bundlebox: tmpl.find('#inputBarcode').value.toUpperCase(),
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
    ListerPallet.remove(this._id);
  }
});
