Session.setDefault("prodorderPN","");


Template.productionRun.helpers({

	prodorderList: function () {
		return ProductionOrders.find({status: {$in:['open','production']}},{fields: {prodorder: 1}});
	},

	partnumText: function () {
		if (Session.get('prodorderPN') === "") {
			Session.set("poPN","no PN");
			return " No Prod. Order Selected";
		} else {
			var cur1 = ProductionOrders.findOne({ prodorder: Session.get('prodorderPN') },
																					{ fields: {
																											partnumber: 1
																										}
																					});
			Session.set("poPN",cur1.partnumber);
			return cur1.partnumber;
		}
	},

	orderqtyText: function () {
		if (Session.get('prodorderPN') === "") {
			return 0;
		} else {
			cur2 = ProductionOrders.findOne({	prodorder: Session.get('prodorderPN') },
																			{ fields: { qty: 1 }});
			return cur2.qty;
		}
	},
});


Template.productionRun.events({
	'change #selectProdOrder': function () {
		var userSelect = $('#selectProdOrder').val();

		Session.set('prodorderPN', userSelect);
		Session.set('isProductionRun', false);

		if (Session.get('prodorderPN') ==="")
			Session.set('isProductionRun', false);
	},

	'click #btnProdOrderClose': function () {
		var prodOrderId = ProductionOrders.findOne({ prodorder: Session.get('prodorderPN')})._id;

		bootbox.confirm("Are you sure you want to close this Production Order?", function (result) {
			if (result) {

				Meteor.call("updateProdOrder", prodOrderId, function(error, result){
					if(error){
						bootbox.alert("error", error);
					}
					if(result){
						Session.set('prodorderPN', "");
						Session.set('isProductionRun', false);
					}
				});
			};
		});
	},

	'click .btnRunProd': function () {
		if ( Session.get('prodorderPN' ) !== "" ) {
			Session.set('isProductionRun', true);

			Meteor.call('prefFinder', Session.get("poPN"), function(error, result) {
				if (error) {
					bootbox.alert('Cannot Pallet prefix');
				}
				else {
					if (result.length > 0) {
						Session.set( "insideShipbox", result[0].insideshipbox );
						Session.set( "insideBundlebox", result[0].insidebundlebox );

					}
				}
			});

			if ( Session.get('prodorderPN') === "")
				console.log("no part number selected");

		} // Session.get('prodorderPN') !==""
		else {
			Session.set('isProductionRun', false);
		}
	},

	'click .btnCancelProd': function () {
		Session.set('isProductionRun', false);
		Session.set('prodorderPN', "");
	}
})
