Template.productionOrder.events({
  "click #btnProdOrderSubmit": function(event, template){

    var arrnull = [template.find('#inputProdOrder').value,
                   template.find('#inputPartNumber').value,
                   template.find('#inputQuantity').value,
                   template.find('#inputShipToLocation').value];

    if (_.contains(arrnull, '')) {
      bootbox.alert('Some fields are empty.Please check!');
    }
    else
      {
        Meteor.call("insertProdOrder", arrnull, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            template.find('#inputProdOrder').value = "";
            template.find('#inputPartNumber').value = "";
            template.find('#inputQuantity').value = "";
            template.find('#inputShipToLocation').value = "";
          }
        });
      }
  }
});
