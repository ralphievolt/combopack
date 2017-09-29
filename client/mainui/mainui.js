var ipCheck = new ReactiveVar(0);

Template.body.helpers({
  clientAllow: function(){
    // return ipCheck.get()
    console.log(Fetcher.get("taco"));
    if ( Fetcher.get("taco") == true)
      return true
    else
      return false
  },


});


Template.body.onCreated( function() {


  // Meteor.call("checkIP", function(error, result) {
  //   if(error) {
  //     bootbox.alert("error", error);
  //   }
  //   else
  //     {
  //       ipCheck.set(result);
  //       console.log(result)
  //       }
  // });
  Fetcher.retrieve("taco", "checkIP");
});
