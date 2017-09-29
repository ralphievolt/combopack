Indiboxes = new Meteor.Collection(null);
entrybar = [];
goodUPC = false;

Template.scanner1.helpers({
  indiboxList: function() {
    return Indiboxes.find({
      date: {
        $gt: Session.get("port1OpenTime")
      }
    }, {
      sort: {
        date: -1
      }
    });
  },
  indiboxListCount: function() {
    var counter = Indiboxes.find({
      date: {
        $gt: Session.get("port1OpenTime")
      }
    }, {
      fields: {
        _id: 1
      }
    }).count();
    return counter;
  }
});


Template.scanner1.events({
  "click #openScannerPort1": function() {
    var opencb = $('#openScannerPort1').prop('checked');

    if (opencb === false) {
      Session.set("port1OpenTime", new Date());
    } else {
      Session.set("port1OpenTime", new Date());
    }
  },

  "keypress #inputBarcode": function(evt, tmpl) {
    if (evt.keyCode === 13) {
      var scanCode = tmpl.find('#inputBarcode').value.toUpperCase();

      if (scanCode.length > 11 && entrybar.length === 0) {
        Meteor.call('upcFinder', Session.get("poPN"), function(error, result) {
          if (error)
            bootbox.alert('Error in retrieving UPC Barcode from database');
          else {
            if (result.length > 0 && result[0].upc === scanCode ) {
              goodUPC = true;
              tmpl.find('#inputBarcode').value = "";
            }
            else {
              goodUPC = false;
              bootbox.alert('Cannot find UPC Barcode from database');
            }
          };
        }); //Meteor.call('upcFinder'
      }; //if (scanCode.length > 11

      if (goodUPC) {
        switch (entrybar.length) {

          case 0:
            if (scanCode.length === 11) {
              Meteor.call('prefFinder', Session.get("poPN"), function(error, result) {
                if (error) {
                  bootbox.alert('Cannot find color bag prefix');
                } else {
                  //===================================================================================
                  if (result.length > 0 && result[0].color === scanCode.substr(0, 2)) {

                    Meteor.call("checkFoilEmpty", scanCode, function(error, result) {
                      if (error)
                        bootbox.alert("error", error);
                      else {
                        if (result.length < 1)
                          bootbox.alert(" Foil bag Empty");
                        else
                          entrybar[0] = scanCode;
                      }
                    });
                    tmpl.find('#inputBarcode').value = "";
                  }
                  //===================================================================================
                  else {
                    bootbox.alert("Product does not match. Scan a color bag first!");
                  }
                }
              }); // Meteor.call('prefFinder'

            } else {
              bootbox.alert("Invalid barcode");
            }
            break;

          case 1:
            if (scanCode.length === 11) {
              Meteor.call('prefFinder', Session.get("poPN"), function(error, result) {
                if (error) {
                  bootbox.alert('Cannot find mono bag prefix');
                } else {
                  //===================================================================================
                  if (result.length > 0 && result[0].mono === scanCode.substr(0, 2)) {
                    Meteor.call("checkFoilEmpty", scanCode, function(error, result) {
                      if (error)
                        bootbox.alert("error", error);
                      else {
                        if (result.length < 1)
                          bootbox.alert(" Foil bag Empty");
                        else
                          entrybar[1] = scanCode;
                      }
                    });
                    tmpl.find('#inputBarcode').value = "";
                  }
                  //===================================================================================
                  else {
                    bootbox.alert("Product does not match. Scan a mono bag!");
                  }
                }
              }); // Meteor.call('prefFinder'

            } else {
              bootbox.alert("Invalid barcode");
            }
            break;
          case 2:

            var strScanCode = is.startWith(scanCode, Session.get("poPN"));
            // if (scanCode.length != 17 || scanCode.substring(0,9) == partNumber ) {
            if (!strScanCode) {
              console.log(strScanCode + "  /  " + scanCode);
              bootbox.alert("WARNING: Carton barcode incorrect!");
            } else {
              finder = Indiboxes.find({
                foil: scanCode
              }).count();
              if (finder < 1) {
                entrybar[2] = scanCode.toUpperCase();
                Indiboxes.insert({
                  foil: entrybar[2],
                  date: new Date()
                });
                Meteor.call("aggregateIndibox", entrybar[2], [entrybar[0], entrybar[1]], function(error, result) {
                  if (error) {
                    console.log("error", error);
                  }
                  if (result) {
                    console.log("indi saved");
                  }
                });
                entrybar.length = 0;
                goodUPC = false;
                tmpl.find('#inputBarcode').value = "";

              } else {
                console.log("error 2")
                bootbox.alert("Indibox duplicate");
              }

            }
            break;
        } //switch

      }; //if (goodUPC)
    }; //if (evt.keyCode === 13
  },

  "click .glyphicon-trash": function() {
    Meteor.call("deleteIndibox", Indiboxes.findOne(this._id).foil, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        bootbox.alert("done");
      }
    });
    Indiboxes.remove(this._id);
  }
});
