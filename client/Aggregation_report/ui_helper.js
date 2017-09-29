dupTank1 = [];
dupTank2 = [];
dupIndi = [];
dupFoil1 = [];
dupFoil2 = [];
dupCounter = 0;


Tracker.autorun(function() {
  dupCounter = 0;

  if ( Session.get("isPalletCode") ) {
    if ( Session.get('searching') === true ) {
      dupIndi = _.pluck(PalletReport.find({palletcode: Session.get('query') }, {
        fields: {
          indiboxcode: 1
        }
      }).fetch(), 'indiboxcode');

      dupFoil1 = _.pluck(PalletReport.find({palletcode: Session.get('query') }, {
        fields: {
          foil1: 1
        }
      }).fetch(), 'foil1');

      dupTank1 = _.pluck(PalletReport.find({palletcode: Session.get('query') }, {
        fields: {
          tank1: 1
        }
      }).fetch(), 'tank1');

      dupFoil2 = _.pluck(PalletReport.find({palletcode: Session.get('query') }, {
        fields: {
          foil2: 1
        }
      }).fetch(), 'foil2');

      dupTank2 = _.pluck(PalletReport.find({palletcode: Session.get('query') }, {
        fields: {
          tank2: 1
        }
      }).fetch(), 'tank2');
    }
  };

  if ( Session.get("isBundleCode") ) {
    if ( Session.get('searching') === true ) {
      dupIndi = _.pluck(BundleboxReport.find({bundlecode: Session.get('query') }, {
        fields: {
          indiboxcode: 1
        }
      }).fetch(), 'indiboxcode');

      dupFoil1 = _.pluck(BundleboxReport.find({bundlecode: Session.get('query') }, {
        fields: {
          foil1: 1
        }
      }).fetch(), 'foil1');

      dupTank1 = _.pluck(BundleboxReport.find({bundlecode: Session.get('query') }, {
        fields: {
          tank1: 1
        }
      }).fetch(), 'tank1');

      dupFoil2 = _.pluck(BundleboxReport.find({bundlecode: Session.get('query') }, {
        fields: {
          foil2: 1
        }
      }).fetch(), 'foil2');

      dupTank2 = _.pluck(BundleboxReport.find({bundlecode: Session.get('query') }, {
        fields: {
          tank2: 1
        }
      }).fetch(), 'tank2');
    }
  };





});

Template.registerHelper('checkDupIndi', function(value) {

  if ( dupIndi.indexOf(value) != dupIndi.lastIndexOf(value, -1) ) {
    Session.set("duplicateFounder", true);
    dupCounter ++;
    return true
  }
  else
    return false

});


Template.registerHelper('checkDupF1', function(value) {

  if ( dupFoil1.indexOf(value) != dupFoil1.lastIndexOf(value, -1) ) {
    Session.set("duplicateFounder", true);
    dupCounter ++;
    return true
  }
  else
    return false
});

Template.registerHelper('checkDupT1', function(value) {

  if ( dupTank1.indexOf(value) != dupTank1.lastIndexOf(value, -1) ) {
    Session.set("duplicateFounder", true);
    dupCounter ++;
    return true
  }
  else
    return false
});


Template.registerHelper('checkDupF2', function(value) {

  if ( dupFoil2.indexOf(value) != dupFoil2.lastIndexOf(value, -1) ) {
    Session.set("duplicateFounder", true);
    dupCounter ++;
    return true
  }
  else {
    return false
  }
});

Template.registerHelper('checkDupT2', function(value) {

  if ( dupTank2.indexOf(value) != dupTank2.lastIndexOf(value, -1) ) {
    Session.set("duplicateFounder", true);
    dupCounter ++;
    return true
  }
  else
    return false
});
