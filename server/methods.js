Meteor.methods({
  insertProdOrder: function(details) {
    return ProductionOrders.insert({
      prodorder: details[0],
      partnumber: details[1],
      qty: details[2],
      shipto: details[3],
      status: 'open',
      statdate: new Date()
    });
  },

  updateProdOrder: function (itemId) {
    ProductionOrders.update({ _id: itemId },
      {	$set: {
        status: 'closed',
        statdate: new Date
      }
    });
  },

  updateSeriesMonitor: function (id) {
    SeriesMonitor.update({_id: id}, {$inc:{ count: 1}});
  },

});
