Combopack Release Notes


2015-11-04
  - include check Carton UPC before scanning serialization code to address product mixing


2015-08-07
  - Check indibox barcode against Production Order PN if match, quality improvement
  - Improve UI for barcode scanning session
  - Query improvement to look for the latest bag before aggregating to Indibox
  - Address Caps Lock pressed situation that cause duplicate barcode not detected
  - Include Bundlebox aggregation check, prior pallet aggregation
  - allow only identified IP's to access application


2015-03-25
  - Add Reprint Pallet Label button after rework
  - Increase duplicate check speed by 30%
  - Check empty/unaggregated indibox during scanning
  - Add support package

2015-03-23
  - Auto print shippingbox label based on indibox Sku count
  - Auto print bundlebox label based on shippingbox Sku count
  - Check empty bag before indibox aggregation. Detection on first stage

2015-03-20
  - Fixed highlighting duplicate barcodes affected by previous update

2015-03-19
  - Refactor code to speed up duplicate barcodes checking. It's now
    in seconds than in minutes
