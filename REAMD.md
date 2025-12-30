# Transport management system

### Tables

transport
  id - add fuel
vehicle type
  id - vehible name - capacity
material 
  id - material code (Foreign key) - material name - category
shipment
  id - source(can be multiple values) - destination (can be multiple values) - material code (Materials foreigh key) - order no (auto increment) - weight - volume - quantity - group id (Which will be poplulated form excel for future groups) - vehicle type - total weight (These all are going to choose from UI) - total volume (This will be choosed from UI)


Node JS application

folder structure
Route
shipment routes - It will have middleware to validate the request has all the required data
Controller
ShipmentController - It will call the shipment service and grab the data
lib
ShipmentService -  This is where it will going to query the db
Presenter
It will decide which are all the fields going to give to UI

