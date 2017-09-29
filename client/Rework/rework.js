Template.palletRemove.events({
  "click #btnRemoveBox": function(event, template){


    Meteor.call("deleteBundlebox", template.find('#inputPalletBarcode').value, template.find('#inputBundleboxBarcode').value, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        bootbox.alert( "Delete successful");
      }
    });
    template.find('#inputBundleboxBarcode').value = "";
    template.find('#inputPalletBarcode').value = "";
  }
});

Template.palletAddition.events({
  "click #btnAddBox": function(event, template){
    if(template.find('#inputBundleboxBarcode').value != "" && template.find('#inputPalletBarcode').value != "") {
      Meteor.call("aggregatePallet", [Session.get("poPN"), template.find('#inputPalletBarcode').value],
                                    template.find('#inputBundleboxBarcode').value, function(error, result){
                                      if(error){
                                        console.log("error", error);
                                      }
                                      if(result){
                                        bootbox.alert( "Bundlebox Addition successful");

                                      }
      });
      template.find('#inputBundleboxBarcode').value = "";
      template.find('#inputPalletBarcode').value = "";
    }
    else {
      bootbox.alert(" Cannot add empty fields");
    }

  }
});
