
Template.scannersView.helpers({
  productionrun: function(){
   return Session.get('isProductionRun');
 },
 isBagIndi: function(){
   return Session.get('isBagIndi');
 },
 isIndiShip: function(){
   return Session.get('isIndiShip');
 },
 isShipBundle: function(){
   return Session.get('isShipBundle');
 },
 isBundlePal: function(){
   return Session.get('isBundlePal');
 },
 partNumberSelect: function(){
   return Session.get("poPN");
 }

});

Template.scannersView.events({
  "click #btnBagIndi": function(event, template){

    Session.set("isBagIndi", true);
    Session.set("isIndiShip", false);
    Session.set("isShipBundle", false);
    Session.set("isBundlePal", false);
  },
  "click #btnIndiShip": function(event, template){

    Session.set("isIndiShip", true);
    Session.set("isBagIndi", false);
    Session.set("isShipBundle", false);
    Session.set("isBundlePal", false);
  },
  "click #btnShipBundle": function(event, template){

    Session.set("isShipBundle", true);
    Session.set("isBagIndi", false);
    Session.set("isIndiShip", false);
    Session.set("isBundlePal", false);

  },
  "click #btnBundlePal": function(event, template){

    Session.set("isBundlePal", true);
    Session.set("isBagIndi", false);
    Session.set("isIndiShip", false);
    Session.set("isShipBundle", false);
  },


});
