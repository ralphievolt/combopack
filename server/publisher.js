Meteor.publish("ProdOrders", function(){
  return ProductionOrders.find();

});

Meteor.publish("SeriesCounter", function(){
  return SeriesMonitor.find();
});
