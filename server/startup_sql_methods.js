var db;
var mysqlSettings = {
  host: '10.104.36.37',
  user: 'riligan',
  password: '1EUvYgaU',
  database: 'FCI_CEB_SRLDB'
};

Meteor.startup(function() {
  db = mysql.createConnection(mysqlSettings);
  db.connect();
  db.initUpdateTable("updates22");

  if (ScannerSettings.find().count() < 4) {
    ScannerSettings.insert({
      scanner: 1,
      openport: false
    });
    ScannerSettings.insert({
      scanner: 2,
      openport: false
    });
    ScannerSettings.insert({
      scanner: 3,
      openport: false
    });
    ScannerSettings.insert({
      scanner: 4,
      openport: false
    });
  };

  if (SeriesMonitor.find().count() < 1) {
    SeriesMonitor.insert({
      count: 1,
      date: new Date()
    })
  };

  // reset series monitor every month

  var onceEveryMonth = new Cron(function() {
    SeriesMonitor.update({
      _id: SeriesMonitor.findOne()._id
    }, {
      $set: {
        count: 1,
        date: new Date()
      }
    });
    console.log("counter reset on " + new Date());
  }, {
    minute: 0,
    hour: 1,
    day: 1
  }); // reset series monitor
}); //startup

Meteor.methods({
  aggregateIndibox: function(indiCode, fdata) {
    return db.queryEx(function(esc, escId) {
      var tank1 = db.queryEx(function(esc, escId) {

        return 'select tank from FoilTank where bag= ' + esc(fdata[0]) + 'order by mdatetime desc limit 0,1 ';
      });
      if (tank1.length > 0)
        tankA = tank1[0].tank;
      else
        tankA = '*empty*';

      var tank2 = db.queryEx(function(esc, escId) {

        return 'select tank from FoilTank where bag= ' + esc(fdata[1]) + 'order by mdatetime desc limit 0,1 ';
      });
      if (tank2.length > 0)
        tankB = tank2[0].tank;
      else
        tankB = '*empty*';


      return 'insert into Indiboxes (indiboxcode, foil1, tank1, foil2, tank2, entrydate) values (' +
        esc(indiCode) + ',' +
        esc(fdata[0]) + ',' +
        esc(tankA) + ',' +
        esc(fdata[1]) + ',' +
        esc(tankB) + ',' +
        esc(new Date()) + ')';
    });
  },

  checkFoilEmpty: function(foil) {
    return db.queryEx(function(esc, escId) {
      return 'select tank from FoilTank where bag= ' + esc(foil);
    });
  },

  checkIndiboxEmpty: function(indiCode) {
    return db.queryEx(function(esc, escId) {
      return 'select indiboxcode from Indiboxes where indiboxcode= ' + esc(indiCode);
    });
  },

  deleteIndibox: function(indiCode) {
    return db.queryEx(function(esc, escId) {
      return 'delete from Indiboxes where indiboxcode=' + esc(indiCode);
    });
  },

  aggregateShipbox: function(shipboxcode, indiboxcode) {
    return db.queryEx(function(esc, escId) {
      return 'insert into Shippingboxes (shipboxcode, indiboxcode, entrydate) values (' + esc(shipboxcode) + ',' +
        esc(indiboxcode) + ',' +
        esc(new Date()) + ')';
    });
  },

  aggregateBundlebox: function(bundleboxcode, shipboxcode) {
    return db.queryEx(function(esc, escId) {
      return 'insert into Bundleboxes (bundleboxcode, shipboxcode, entrydate) values (' + esc(bundleboxcode) + ',' +
        esc(shipboxcode) + ',' +
        esc(new Date()) + ')';
    });
  },

  deleteBundlebox: function(palletCode, bundleCode) {
    return db.queryEx(function(esc, escId) {
      return 'delete from Pallet where bundlecode=' + esc(bundleCode) + ' and palletcode=' + esc(palletCode);
    });
  },

  aggregatePallet: function(palletdetail, bundleboxcode) {
    return db.queryEx(function(esc, escId) {
      return 'insert into Pallet (partnumber, palletcode, bundlecode, entrydate) values (' + esc(palletdetail[0]) + ',' +
        esc(palletdetail[1]) + ',' +
        esc(bundleboxcode) + ',' +
        esc(new Date()) + ')';
    });
  },

  prefFinder: function(name) {
    return db.queryEx(function(esc, escId) {
      return 'select * from Sku where partnumber= ' + esc(name);
    });
  },

  upcFinder: function(pname) {
    return db.queryEx(function(esc, escId) {
      return 'select upc from Sku where partnumber= ' + esc(pname);
    });
  },

  'palletIndiCounter': function ( palletcode ) {
    return db.queryEx ( function ( esc, escId ) {
      return 'SELECT count(*) as indicount ' +
      'FROM Pallet P, Bundleboxes B, Shippingboxes S, Indiboxes I ' +
      'WHERE  P.bundlecode = B.bundleboxcode and ' +
      'B.shipboxcode = S.shipboxcode and ' +
      'S.indiboxcode = I.indiboxcode and ' +
      'P.palletcode =' + esc(palletcode);
    });
  },


  checkIP: function() {
    var ip = this.connection.clientAddress;
    var queryIp = db.queryEx(function(esc, escId) {
      return 'select client_ip from IP_Address where client_ip= ' + esc(ip);
    });

    console.log(ip + " access on " + moment().format("MMM-D-YYYY, h:mm:ss a"));

    if (queryIp.length === 0)
      return false
    else
      return true
  },

});

Meteor.publish('palletSearch', function(query) {
  var self = this;
  try {
    var response = db.queryEx(function(esc, escId) {
      return 'select P.partnumber, P.bundlecode, P.entrydate, B.shipboxcode,' +
        ' S.indiboxcode, I.foil1, I.tank1, I.foil2, I.tank2 ' +
        ' from Pallet P, Bundleboxes B, Shippingboxes S, Indiboxes I ' +
        ' Where P.bundlecode = B.bundleboxcode and ' +
        ' B.shipboxcode = S.shipboxcode and' +
        ' S.indiboxcode = I.indiboxcode and' +
        ' P.palletcode =' + esc(query);
    });
    // console.log(response);
    _.each(response, function(item) {
      var doc = {
        partnumber: item.partnumber,
        palletcode: query,
        bundlecode: item.bundlecode,
        shipboxcode: item.shipboxcode,
        indiboxcode: item.indiboxcode,
        foil1: item.foil1,
        tank1: item.tank1,
        foil2: item.foil2,
        tank2: item.tank2,
        date: item.entrydate
      };

      //palletreport comes from client declaration of PalletReport = new Mongo.Collection('palletreport');
      self.added('palletreport', Random.id(), doc);
    });
    self.ready();
  } catch (error) {
    console.log(error);
  }
});


Meteor.publish('bundleSearch', function(query) {
  var self = this;
  try {
    var response = db.queryEx(function(esc, escId) {
      return 'select B.bundleboxcode, B.entrydate, B.shipboxcode,' +
        ' S.indiboxcode, I.foil1, I.tank1, I.foil2, I.tank2 ' +
        ' from Bundleboxes B, Shippingboxes S, Indiboxes I ' +
        ' Where B.shipboxcode = S.shipboxcode and' +
        ' S.indiboxcode = I.indiboxcode and' +
        ' B.bundleboxcode =' + esc(query);
    });
    // console.log(response);
    _.each(response, function(item) {
      var doc = {
        bundlecode: item.bundleboxcode,
        shipboxcode: item.shipboxcode,
        indiboxcode: item.indiboxcode,
        foil1: item.foil1,
        tank1: item.tank1,
        foil2: item.foil2,
        tank2: item.tank2,
        date: item.entrydate
      };

      //palletreport comes from client declaration of PalletReport = new Mongo.Collection('palletreport');
      self.added('bundleboxreport', Random.id(), doc);
    });
    self.ready();
  } catch (error) {
    console.log(error);
  }
});




// select username, course_id, max(ldate) as date
// from tbl
// where username='user1'
// group by course_id
//source: http://stackoverflow.com/questions/16979136/mysql-select-distinct-records-from-latest-dates-only


// select
// a.shipboxcode, b.foil1, b.foil2, b.entrydate
// from
// Shippingboxes a, Indiboxes b
// where
// a.indiboxcode = b.indiboxcode
// and a.indiboxcode = '6JAJUDTYKWNX6ENSQ'
// and b.foil1 = (select foil1 from Indiboxes where indiboxcode = a.indiboxcode order by entrydate desc limit 0,1)
// and b.foil2 = (select foil2 from Indiboxes where indiboxcode = a.indiboxcode order by entrydate desc limit 0,1)
