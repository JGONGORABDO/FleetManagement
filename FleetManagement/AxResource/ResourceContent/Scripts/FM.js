function main(metadataService, dataService, cacheService, $q) {

	// Business logic initialization event handlers
	var workspaceInitialization = function (appMetadata) {
		/* Workspace configuration */
		//metadataService.configureWorkspace({design: handlers.getReservationWorkspaceDesign()});	               
		metadataService.hideNavigation(
			pageNames.CustomerRentals, 
			pageNames.ReservationDiscounts, 
			pageNames.DiscountDetails, 
			pageNames.ReservationCharges
		);
		
	    //Changes needed after moving to workspace api - Start

		//Rental List page	
		metadataService.configureControl("reservationList", 'rentalList', { detailsPageId: 'reservationDetails' });
		metadataService.configureControl("reservationList", 'FMRental_FMCustomer_customerFullName', { ReferencePageId: 'customerDetails' });
		metadataService.configureControl("reservationList", 'FMRental_FMVehicle_vehicleDescription', { ReferencePageId: 'DB049AAA-BC47-45AB-A81C-5622FF8F03ED' });
		metadataService.configureControl("reservationList", "FMRental_FMCustomer_customerImage", { imageStyle: 'circular' });

		metadataService.configureControl("reservationList", 'FMRental_recId', { hidden: true });
		metadataService.configureControl("reservationList", 'FMRental_FMCustomer_recId', { hidden: true });
		metadataService.configureControl("reservationList", 'FMRental_FMVehicle_recId', { hidden: true });
		metadataService.configureControl("reservationList", "FMRental_FMVehicle_vehicleImage", { hidden: true });
		metadataService.configureControl("reservationList", "FMRental_FMVehicle_vehicleVIN", { hidden: true });
	
	    //All vehicle list
        //We are still utlizing the old vehicle details page
		metadataService.configureControl("vehicleList", 'vehicleList', { detailsPageId: 'DB049AAA-BC47-45AB-A81C-5622FF8F03ED' });
		metadataService.configureControl("vehicleList", "FMVehicle_recId", { hidden: true });		
		
		//Reservation details page
		metadataService.configureControl("reservationDetails", 'FMRental_FMCustomer_recId', { hidden: true });
		metadataService.configureControl("reservationDetails", 'FMRental_recId', { hidden: true });
		metadataService.configureControl("reservationDetails", 'FMRental_FMVehicle_recId', { hidden: true });
		metadataService.configureControl("reservationDetails", 'FMRental_FMRentalCharge_recId', { hidden: true });

		metadataService.configureControl("reservationDetails", 'FMRental_rentalChargeList', { detailsPageId: 'rentalChargeDetails' });

	    //Active reservation list page
		metadataService.configureControl("activeReservationList", 'FMRental_recId', { hidden: true });
		metadataService.configureControl("activeReservationList", 'FMRental_FMCustomer_recId', { hidden: true });
		metadataService.configureControl("activeReservationList", "FMRental_FMCustomer_customerImage", { imageStyle: 'circular' });

	    //Create reservation action
		metadataService.configureControl("createReservation", 'FMRental_recId', { hidden: true });
				
		//Customer list page
		metadataService.configureControl("customerList", 'customerList', { detailsPageId: 'customerDetails' });
		metadataService.configureControl("customerList", "FMCustomer_customerImage", { imageStyle: 'circular' });		
		metadataService.configureControl("customerList", 'FMCustomer_recId', { hidden: true });
		
		//Customer details page		
		metadataService.configureControl("customerDetails", "FMCustomer_customerImage", { imageStyle: 'circular' });		
		metadataService.configureControl("customerDetails", 'FMCustomer_recId', { hidden: true });
				
		//Edit customer details action
		metadataService.configureControl("updateCustomer", 'FMCustomer_recId', { hidden: true });
		
		//Create customer action
		metadataService.configureControl("addCustomer", 'FMCustomer_recId', { hidden: true });
		
		//Configuratio needed after moving to workspace api - EndDate
		
		/** Page configurations **/
		metadataService.configureControl(pageNames.ActiveReservations, controlNames.CustomerImage, { imageStyle: 'circular' });
		metadataService.configurePage(pageNames.ReservationDetails, { onDataLoaded: handlers.reservationDetailsLoaded });
		metadataService.configurePage('Reservation-details', {design: handlers.getReservationDetailsDesign()});			
		metadataService.configureControl(pageNames.AllCustomers, controlNames.CustomerRecId, { hidden: true });
		metadataService.configureControl(pageNames.AllCustomers, controlNames.CustomerImage, { imageStyle: 'circular' });
		metadataService.addLink(pageNames.CustomerDetails, pageNames.CustomerRentals, controlNames.CustomerRentals, 'Rentals', true);
		metadataService.configureControl(pageNames.CustomerDetails, controlNames.CustomerImage, { imageStyle: 'circular' });
		metadataService.configureControl(pageNames.AllVehicles, controlNames.VehicleRecId, { hidden: true });

		/** Action configurations **/
		// (With KB 3216943, these lookups are now configrued in static metadata. Configuration via business logic is optional) 
		// metadataService.configureLookup('Add-Reservation', 'FMRental_Customer', { lookupPage: 'All-Customers', valueField: 'FMCustomer_RecId', displayField: 'FMCustomer_FullName', showLookupPage: true });			
		// metadataService.configureLookup('Add-Reservation', 'FMRental_Vehicle', { lookupPage: 'All-Vehicles', valueField: 'FMVehicle_RecId', displayField: 'FMVehicle_FullDescription', showLookupPage: true });
		metadataService.configureAction(actionNames.ReservationEdit, {isIdempotent: true});
		metadataService.configureControl(actionNames.CustomerEdit, controlNames.CustomerCellPhone, { hidden: true });
		metadataService.configureControl(actionNames.CustomerEdit, controlNames.CustomerLicense, {extType: "Barcode"});
		metadataService.configureAction(actionNames.CustomerEdit, {isIdempotent: true});
		// (ver 1.3.0) metadataService.configureAction(actionNames.CustomerEdit, { onSubmit: validateEntity(entities.FMCustomer.entityName, actionNames.CustomerEdit) });
		metadataService.configureControl(actionNames.CustomerPhotoUpdate, controlNames.CustomerPhotoUpload, { boundField: entities.FMCustomer.Image.propertyName });
		metadataService.configureControl(actionNames.CustomerLicenseUpdate, controlNames.CustomerLicenseUpload, { boundField: entities.FMCustomer.LicenseImage.propertyName });
		// (ver 1.3.0) metadataService.configureAction(actionNames.CustomerNew, { onSubmit: validateEntity(entities.FMCustomer.entityName, actionNames.CustomerNew) });
		metadataService.configureAction(actionNames.CustomerNew, { onComplete: handlers.newCustomerClosed });
		metadataService.configureControl(actionNames.CustomerNew, controlNames.CustomerAddress2, { hidden: true });
		metadataService.configureControl(actionNames.CustomerNew, controlNames.CustomerLicense, {extType: "Barcode"});
		
		// Initialize all actions on Reservation Details to be hidden initially.
		metadataService.configureAction(actionNames.ReservationEdit, { hidden: true });
		metadataService.configureAction(actionNames.ReservationComplete, { hidden: true });
		metadataService.configureAction(actionNames.ReservationChargeAdd, { hidden: true });
		metadataService.configureAction(actionNames.ReservationDelete, { hidden: true });
		metadataService.configureAction(actionNames.ReservationStart, { hidden: true });
	};
	var pageInitialization = function (pageMetadata, context) {
		/** Page state-based configurations **/
		/* Reservation details */
		if (pageMetadata.Name === pageNames.ReservationDetails) {
			metadataService.configurePage(pageNames.ReservationDetails, { onDataLoaded: handlers.configureReservationDetails_RentalStatusBehavior });
		}
	};
	var actionInitialization = function (taskMetadata, context, taskData) {
		if (taskMetadata.Name === actionNames.ReservationNew) {
			taskData.setDefaultControlValue(controlNames.ReservationStartDate, new Date());
		}
		else if (taskMetadata.Name === actionNames.ReservationComplete) {
			handlers.configureCompleteRental_MileageBehavior(context, taskData);				
		}
	};    
	// Tables and fields:
	var entities = {
		// Storing entity and field names for the potion of the FM data model used by the business logic
		// This just makes it easy to reference the names while writing business logic
		// We hope to have a tool in future updates which can generate automatically from the mobile workspace metadata
		FMRental : {
			entityName : "FMRental",
			Comments : {propertyName: "Comments"},
			Customer : {propertyName: "Customer"},
			EndDate : {propertyName: "EndDate"},
			EndMileage : {propertyName: "EndMileage"},
			RecId : {propertyName: "RecId"},
			RentalId : {propertyName: "RentalId"},
			StartDate : {propertyName: "StartDate"},
			State : {propertyName: "State"},
			Vehicle : {propertyName: "Vehicle"},
			VehicleRatePerday : {propertyName: "VehicleRatePerday"},
			VehicleRatePerWeek : {propertyName: "VehicleRatePerWeek"},
			VehicleRateTotal : {propertyName: "VehicleRateTotal"}
		},
		FMCustomer : {
			entityName : "FMCustomer",
			CellPhone : {propertyName: "CellPhone"},
			DriverLicense : {propertyName: "DriverLicense"},
			Email : {propertyName: "Email"},
			FirstName : {propertyName: "FirstName"},
			LastName : {propertyName: "LastName"},
			Image: {propertyName: "Image"},
			LicenseImage : {propertyName: "LicenseImage"}
		},
		FMVehicle : {
			entityName : "FMVehicle",
			Description : {propertyName: "Description"},
			Mileage : {propertyName: "Mileage"},
			MPG : {propertyName: "MPG"},
			Status : {propertyName: "Status"},
			VehicleId : {propertyName: "VehicleId"},
			VehicleModel : {propertyName: "VehicleModel"},
			VIN : {propertyName: "VIN"}
		},
		FMVehicleModel : {
			entityName : "FMVehicleModel",
			Image : {propertyName: "Image"},
		},
		FMRentalCharge : {
			ChargeType : {propertyName: "ChargeType"},
			DefaultDescription : {propertyName: "DefaultDescription"},
			ExtendedAmount : {propertyName: "ExtendedAmount"},
			PerUnitAmount : {propertyName: "PerUnitAmount"},
			Quantity : {propertyName: "Quantity"},
			RentalId : {propertyName: "RentalId"}
		}
	};
	// Pages:
	var pageNames = {
		AllReservations: "All-Reservations",
		ReservationDetails: "Reservation-details",
		AllCustomers: "All-Customers",
		CustomerDetails: "Customer-details",
		CustomerRentals: "Customer-rentals",
		AllVehicles: "All-Vehicles",
		ActiveReservations:  "All-Active-Reservations",
		ReservationDiscounts: "Reservation-discounts",
		DiscountDetails: "Discount-details",
		ReservationCharges:"Rental-charges",
	};
	// Actions:
	var actionNames = {
		ReservationNew: "Add-Reservation",
		ReservationComplete: "Complete-rental",
		ReservationStart: "Start-rental",
		ReservationEdit: "Edit-Reservation",
		ReservationDelete: "Delete-reservation",
		ReservationChargeAdd: "Add-charge",
		CustomerEdit: "Update-Customer-Details",
		CustomerPhotoUpdate:  "Update-picture",
		CustomerLicenseUpdate:  "Update-license-picture",
		CustomerNew: "New-customer",
		CustomerDelete: "Delete-Customer-1",
	};
	// Controls:
	var controlNames = {
		ReservationList: "RentalsGrid",
		ReservationId: "FMRental_RentalId",
		ReservationStartDate: "FMRental_StartDate",
		ReservationEndDate: "FMRental_EndDate",
		ReservationState: "FMRental_State",
		CustomerList: "FMCustomers",
		CustomerRecId: "FMCustomer_RecId",
		CustomerFirstName: "FMCustomer_FirstName",
		CustomerLastName: "FMCustomer_LastName",
		CustomerFullName: "FMCustomer_FullName",
		CustomerCellPhone: "FMCustomer_CellPhone",
		CustomerEmail: "FMCustomer_Email",	
		CustomerAddress1: "FMAddressTable_AddressLine1Copy2",
		CustomerAddress2: "FMAddressTable_AddressLine2Copy2",
		CustomerLicense: "FMCustomer_DriverLicense",
		CustomerImage: "FMCustomer_Image",
		CustomerPhotoUpload: "FMCustomer_UploadPhoto",
		CustomerLicenseUpload: "FMCustomer_UploadLicense",
		CustomerRentals: "FMCustomer_RentalsNavigation",
		VehicleList: "FMVehicles",
		VehicleRecId: "FMVehicle_RecId",
		VehicleImage: "FMVehicleModel_Image",
		VehicleDescription: "FMVehicle_FullDescription",
		VehicleVIN: "FMVehicle_VIN",
		VehicleMileage: "FMVehicle_Mileage",
		VehicleRatePerDay: "FMRental_VehicleRatePerDay",
		VehicleRateTotal: "FMRental_VehicleRateTotal",
		ReservationChargeList: "FMRentalCharge",
		ReservationChargeDescription: "FMRentalCharge_Description",
		ReservationChargeType: "FMRentalCharge_ChargeType",
		ReservationChargePerUnitAmount: "FMRentalCharge_PerUnitAmount",
		ReservationChargeQuantity: "FMRentalCharge_Quantity",
		ReservationTotal: "FMRentalCharge_Quantity",
	};
	// Entity data change handlers
	var validateEntity = function(entityName, actionName){

		if(entityName == entities.FMCustomer.entityName){
			// Determine which fields to validate based on the action used to change the data			
			var validateFirst, validateLast, validatePhone, validateEmail, validateLicense;
			if(actionName == actionNames.CustomerNew){
				validateFirst = validateLast = validatePhone = validateEmail = validateLicense = true;
			}
			else if(actionName == actionNames.CustomerEdit){
				validateLicense = validateEmail = true;
			}
			// Return the onSubmit handler
			return function (dataWrapper, submitArgs){
				var first = dataWrapper.getControlValue(controlNames.CustomerFirstName);
				var last = dataWrapper.getControlValue(controlNames.CustomerLastName);
				var license = dataWrapper.getControlValue(controlNames.CustomerLicense);
				var phone = dataWrapper.getControlValue(controlNames.CustomerCellPhone);
				var email = dataWrapper.getControlValue(controlNames.CustomerEmail);			

				// Check to see if control exists, and if so, valiate that it is not empty
				if(validateFirst && !first){
					submitArgs.addMessage("A first name must be provided for the customer.", messageCode.error);
					submitArgs.cancel();
				}
				if(validateLast && !last){
					submitArgs.addMessage("A last name must be provided for the customer.", messageCode.error);
					submitArgs.cancel();
				}
				if(validateLicense && !license){
					submitArgs.addMessage("A driver's license number must be provided for the customer.", messageCode.error);
					submitArgs.cancel();
				}
				if((validatePhone && !phone) && (validateEmail && !email)){
					submitArgs.addMessage("You must provide either a phone number or email address for the customer.", messageCode.error);
					submitArgs.cancel();
				}
				else {
					if(validatePhone && phone){
						!validateField.phone(phone, submitArgs) && submitArgs.cancel();
					}
					if(validateEmail && email){					
						if(validateField.email(email, submitArgs)){
							// Perform first-chance check against local data to see if the email is already in use
							// This check may pass during onSubmit, but server may fail the check when it compares against the wider data set 
							/* dataService.findEntityData API requires version 1.3.0 
							var customer = dataService.findEntityData(names.FMCustomer.entityName, names.FMCustomer.Email.propertyName, email, true);
							if(customer != null && customer.getPropertyValue(names.FMCustomer.Email.propertyName) == email){
								submitArgs.addMessage("This email address is in use by another customer. Please provide a different email address.");
								submitArgs.cancel();
							}
							*/		
						}
						else {
							submitArgs.cancel();
						}
					};
				};
			}
		}
	};
	// Business logic event handlers
	var handlers = {
		getNewReservationListDesign: function() {
			return {
				"flexFlow":"column nowrap",
				"flexSize":"1",
				"allowScroll": true,
				"items":[
					{
						// List with reservations
						"name":"rentalList",
						"design":{
							// Override of default list design
							"items":[
								"Reservation_Customer_customerFullName"
							]
						}
					}
				]	
			}						
		},
		
		// Design for Reservation details page
		getReservationDetailsDesign: function () { 
			return {
				// Page root container
				"flexFlow":"column nowrap",
				"items":[
					// Upper third of page, contains 4 rows
					{
						"flexFlow":"column nowrap",
						"background":"theme",
						"color":"light",
						"fontSize":"small",
						"border": "none",
						"padding":"small",
						"items":[
							// Row 1/4 with customer image and name
							{
								"flexFlow":"row nowrap",
								"alignItems":"center",
								"justifyItems":"center",
								"labelStyle":"hidden",
								"fontSize":"large",
								"fontWeight":"bold",
								"items":[
									{
										// Customer image
										"name":"FMCustomer_Image",
										"imageStyle":"circular",
										height:3,
										width:3
									},
									{
										// Customer name
										name: "FMCustomer_FullName",
										padding: "none"
									}
								]
							},
							// Row 2/4 with vehicle description
							{
								"justifyItems":"center",
								"items":[
									{
										"name":"FMVehicle_FullDescription",
										"fontSize":"medium",
										"labelStyle":"hidden"
									}
								]
							},
							// Row 3/4 with reservation's detail fields
							{
								"flexFlow":"row nowrap",
								"labelStyle":"inline",
								"items":[
									{
										// Column 1
										"flexSize":"1",
										"flexFlow":"column nowrap",
										"alignItems":"flex-start",
										"items":[
											{
												// Status
												"name":"FMRental_State",
												"label":"Status"
											},
											// Start date
											"FMRental_StartDate",
										]
									},
									{
										// Column 2
										"flexSize":"1",
										"flexFlow":"column nowrap",
										"alignItems":"flex-end",
										"items":[
											{
												// Rental Id
												"name":"FMRental_RentalId",
												"label":"Id"
											},
											// Dnd date
											"FMRental_EndDate"
										]
									}
								]
							},
							{
								// Row 4/4 with the actions
								"flexFlow":"row nowrap",
								"justifyItems": "space-around",
								"fontSize":"small",

								"items":
								[
									{
										"type":"Image",
										icon:"trash-b"
									},
									{
										"type":"Navigation",
										label: "Complete",
																		"labelPosition": "inline",
										style: "button",
										icon: "checkmark",
										"background": "lightGreen",
										target:"Complete-rental",
									},
									{
										"type":"Navigation",
										label: "Delete",
										style: "button",
										icon: "trash-b",
										"background": "negative",
										target:"Delete-reservation",
									},
									{
										"type":"Navigation",
										label: "Edit",
										style: "button",
										icon: "edit",
										"background": "neutral",
										target:"Edit-Reservation",
									}
								]
							}
						]
					},
					{
						// Middle thrid of page, contains list
						"flexSize":"1",
						"fontWeight":"bold",
						"allowScroll": true,
						"items":[
							{
								// List with rental charges
								"name":"FMRentalCharge",
								"alignItems":"stretch",
								"itemBorder": true,
								"color":"theme",
								"design":{
									// Override of default list design
									"flexFlow":"row nowrap",
									"justifyItems":"space-between",
									"labelStyle":"hidden",
									border: "none",
									"items":[
										"FMRentalCharge_ChargeType",
										{
											name:"FMRentalCharge_PerUnitAmount",
											"fontWeight":"normal",
										}
									]
								}
							}
						]
					},
					{
						// Navigation to action for adding charge lines - floating under the scrollable lines list
						"type":"Navigation",
						label: "Add charge",
						"icon":"plus",
						target:"Add-charge",
						"fontWeight":"bold",
					},
					{
						// Lower third of page
						"flexFlow":"row nowrap",
						border:"solid",
						labelStyle:"inline",
						"fontWeight": "normal",
						items:[
							{
								// Total of vehicle rate for reservation period
								name:"FMRental_VehicleRateTotal",
								label:"Vehicle",
								"flexSize":"1"
							},
							{
								// Total of vehicle rate and retal charges
								name:"CalculatedTotal",
								label:"Sub-total",
								"flexSize":"1"
							}
						]
					}

				]
			}
		},
		// Design for Reservation Management workspace
		getReservationWorkspaceDesign: function () { 
			return {
				flexFlow:"column nowrap",
				items: [
					// uppper half, black bg, content height - show tiles to pages
					{
						"flexFlow":"row nowrap",
						"background":"dark",
						"color":"light",
						"fontSize":"large",
						"border": "none",
						"justifyItems": "space-around",
						"items":
						[
							{
								"type":"Navigation",
								label: "Customers",
								style: "button",
								showCount: true,
								target:"All-Customers",
								excludeContext: true,
							},
							{
								"type":"Navigation",
								label: "Reservations",
								style: "button",
								showCount: true,
								target:"All-Reservations",
								excludeContext: true,
							},
							{
								"type":"Navigation",
								label: "Vehicles",
								style: "button",
								showCount: true,
								target:"All-Vehicles",
								excludeContext: true,
							}
						]
					},
					// lower half - grow or shrink
					{
						"flexSize":"1",
						"allowScroll": true,
						items:
						[
							// Part to include all active reservationa
							{
								"type":"Part",
								target: "All-Active-Reservations",
								design:
								{
									// page
									"flexFlow":"column nowrap",
									"items":
									[
										{
											"name":"RentalsGrid",
											"flexSize":"1",
											"hideSearchBar": true,
											"itemBorder": true,
											"padding":"small",
											"design":
											{
												"flexFlow":"column nowrap",
												"justifyItems": "flex-start",
												"border":"none",
												"items":
												[
													// name and total
													{
														"flexFlow":"row nowrap",
														"flexSize":"0",
														"justifyItems":"space-between",
														"labelStyle":"hidden",
														"items":
														[
															"FMCustomer_FullName",
															"FMRental_VehicleRateTotal"
														]
													},
													// image and vehicle
													{
														"flexFlow":"row nowrap",
														"flexSize":"0",
														"justifyItems":"flex-start",
														"alignItems":"center",
														"labelStyle":"hidden",
														"fontWeight":"700",
														"items":
														[
															{
																"name":"FMCustomer_Image",
																"imageStyle":"circular",
																height:3,
																width:3,
															},
															{
																"name": "FMVehicle_FullDescription",
																"fontWeight":"100",
															}
														]
													},
													// dates
													{
														"flexFlow":"row nowrap",
														"flexSize":"0",
														"justifyItems":"space-between",
														"labelStyle":"inline",
														"items":
														[
															"FMRental_StartDate",
															"FMRental_EndDate"
														]
													}
												]
											}
										}
									]
								}
							}
						],
					},
					// Bottom part fixed - show link to create reservation
					{
						"type":"Navigation",
						icon: "plus",
						label: "Create reservation",
						target:"Add-Reservation",
					},
				],
			}
		},
		// Handler for Reservation Details action data loaded
		reservationDetailsLoaded: function (pageInstance, dataWrapper) {
			var vin = dataWrapper.getControlValue(controlNames.VehicleVIN);
			var vehicleDes = dataWrapper.getControlValue(controlNames.VehicleDescription);
			if (vin) {
				dataWrapper.setControlValue(controlNames.VehicleDescription, vehicleDes + "--" + vin);
			};
		},	
		// Handler for New customer action closing
		newCustomerClosed: function(navigation) {
			navigation.params.pageId = metadataService.findPage("Customer-details").Id;
		},		
		// Update the visibility of Actions on the Reservation details Page based on the state of the Reservation
		configureReservationDetails_RentalStatusBehavior: function (pageInstance, dataWrapper) {
			var rentalState = dataWrapper.getControlValue(controlNames.ReservationState);
			if (rentalState === "1" || rentalState == "0" /*Ready for pickup or New*/) {
				pageInstance.getAction(actionNames.ReservationDelete).hidden = false;
				pageInstance.getAction(actionNames.ReservationEdit).hidden = false;
				pageInstance.getAction(actionNames.ReservationChargeAdd).hidden = false;
				pageInstance.getAction(actionNames.ReservationStart).hidden = false;
			}
			else if (rentalState === "2" /*In progress*/) {
				pageInstance.getAction(actionNames.ReservationComplete).hidden = false;
			}
			else if (rentalState === "3" /*Complete*/) {
				pageInstance.getAction(actionNames.ReservationDelete).hidden = false;
			}
		},
		// Set the default value on the mileage field, based on the previous mileage
		configureCompleteRental_MileageBehavior: function (context, taskData){
			if (context.pageContext) {
				var entityType, entityId = context.pageContext.split(':');
				if (contextParts && contextParts.length === 2) {

					var entityType = contextParts[0];
					var entityId = contextParts[1];
					if (entityType && entityId) {
						
						var entityDataWrapper = dataService.getEntityData(entityType, entityId);
						if (entityDataWrapper) {
							
							var vehicleMileage = entityDataWrapper.getPropertyValue('FMVehicle/Mileage');
							if (vehicleMileage && vehicleMileage.$ref) {
								taskData.setDefaultControlValue('FMRental_EndMileage', parseInt(vehicleMileage.value) + 1);
							}
						}
					}
				}
			}
		},
	};	
	// Helpers for validating data types
	var validateField = {
		email: function(email, submitArgs){
			var emailRegEx = /^[a-zA-Z][\.\w]*@\w[-\.\w]*\w\.[a-z]*/;
			if(!emailRegEx.exec(email)){
				submitArgs.addMessage("Please enter a valid email address.", messageCode.error);
				return false;
			}	
			return true;
		},
		phone: function(phone, submitArgs){		
			var phoneRegEx = /^\({0,1}\d{3}\){0,1}(-|\s){0,1}\d{3}(-|\s){0,1}\d{4}$/;
			if(!phoneRegEx.exec(phone)){
				submitArgs.addMessage("Please enter a 10-digit phone number in the format (###) ###-#### or ##########.", messageCode.error);
				return false;				
			}
			return true;
		}
	};

	var messageCode = {error: 1};

	return {
        appInit: workspaceInitialization,
		pageInit: pageInitialization,
		taskInit: actionInitialization
	};
}
// SIG // Begin signature block
// SIG // MIInOAYJKoZIhvcNAQcCoIInKTCCJyUCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // JxadqL39n6pixF8OP3cA04xZpFZa+aQv1V+kiClMlKCg
// SIG // ggzJMIIGBDCCA+ygAwIBAgITMwAAAhz6zcWb6C9+xAAA
// SIG // AAACHDANBgkqhkiG9w0BAQsFADBXMQswCQYDVQQGEwJV
// SIG // UzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDI0MB4XDTI2MDQxNjE4NTk0MVoXDTI3MDQx
// SIG // NTE4NTk0MVowdDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEeMBwG
// SIG // A1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMIIBIjAN
// SIG // BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1bGX4Dip
// SIG // jN9Rz36FjqDRIsNEpQoiMVDAtCPTTFm7nCjsP3vZT6AK
// SIG // HoUFbukhuuVeBD862LJwZxTzaIuPx6DnY4c9apKxLeCO
// SIG // rRHMV1OqDnmPcxr3gv94gXroS2MTNzPz5HFKHmxfjXnZ
// SIG // 5vDpHUj6A7vIplYhz0Kv/AkFLtFkUeKxPnTEX66Van5j
// SIG // Ytqlgl/eE+DLHqYoxlZMBP/7SYNK8gImHR09+C0p5Rv0
// SIG // UgWZkERlmeYPI6pyo0T2q0qjH7dYL47lE1YLVjWX4HCx
// SIG // UiuVmtJsq6vDj3IExhrEYLp/rZ0kviMQ08VbADx9Ts7z
// SIG // 48KJoLgcoVHvznL1DdA+Vpqe8QIDAQABo4IBqjCCAaYw
// SIG // DgYDVR0PAQH/BAQDAgeAMB8GA1UdJQQYMBYGCisGAQQB
// SIG // gjdMCAEGCCsGAQUFBwMDMB0GA1UdDgQWBBTaB+2tmA4z
// SIG // ksKZKegx3JlEuyftMjBUBgNVHREETTBLpEkwRzEtMCsG
// SIG // A1UECxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9u
// SIG // cyBMaW1pdGVkMRYwFAYDVQQFEw0yMzAwMTIrNTA3NTY5
// SIG // MB8GA1UdIwQYMBaAFH9ZP1Qh2q1P7wXl5qPXLQaUEggx
// SIG // MGAGA1UdHwRZMFcwVaBToFGGT2h0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01pY3Jvc29mdCUy
// SIG // MENvZGUlMjBTaWduaW5nJTIwUENBJTIwMjAyNC5jcmww
// SIG // bQYIKwYBBQUHAQEEYTBfMF0GCCsGAQUFBzAChlFodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRz
// SIG // L01pY3Jvc29mdCUyMENvZGUlMjBTaWduaW5nJTIwUENB
// SIG // JTIwMjAyNC5jcnQwDAYDVR0TAQH/BAIwADANBgkqhkiG
// SIG // 9w0BAQsFAAOCAgEAFJxKoWkV3tE94SCY73UBKxJKwP+2
// SIG // wco5+reSAKzg5JEY85GMLSjHNsmI9qrmjay7rVsNmGXJ
// SIG // 4Cj8tW+9WMgyUE8uDQ0cGkofU8ObYa5NzZnD6wB4mub7
// SIG // XASdQoLSiu5kGyHENtnfzd/Nd2sggwxXsLtfo7GZl/q/
// SIG // 2kxKmjjOE1cVbUUpLgsvJwFyrgoTii4v8wOF7h/IhGKi
// SIG // LI9mKDWnksVZnhohEV6SnaN3Q5mItJDucNg/FUuHN/vY
// SIG // eoBJWAWgAIP3WBKwYNu6k9779M0QyYSbn7wjcpQPEu//
// SIG // vB+RPz1eXJ4Op2vVVf8PTld6rrjQ+s3RmthF9/BpaedB
// SIG // fQCEJN6dsV5nL6Kw3jOFye1JVmAYuoPNCdUkjkJyJwmB
// SIG // RJrH1DZ9/tQGkySkiS/N6rigK02nNqSobtGM88686Oh6
// SIG // 7EYkCs6Z0QW9f3TGuj94c++V2zEQXLTbBYWQtO1gpoxM
// SIG // XS4Nnh1ubldE2PA+fusKMyX+7xd/lh5GDzvOWfgQulOB
// SIG // ZDW2DcnGfXBOI9bV0Xcgwn5penNB1jx4zVQzm67/ZSrd
// SIG // 6lKhaV9/FQqlQsjTjtVHF30IlYycN9lNllCmY7f53iSh
// SIG // xAbJvZBbC7ls5EOd/qnGkmsrZrAp5NoDoJa5Q+Xd5Csr
// SIG // 7wMPq85tJU/Ct/D+jy8X2UB4buFvHVewL/DdmZgwgga9
// SIG // MIIEpaADAgECAhMzAAAAOTu2Nxm/Bh1nAAAAAAA5MA0G
// SIG // CSqGSIb3DQEBDAUAMIGIMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHkgMjAxMTAeFw0yNDA4MDgyMDU0
// SIG // MThaFw0zNjAzMjIyMjEzMDRaMFcxCzAJBgNVBAYTAlVT
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // KDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcg
// SIG // UENBIDIwMjQwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAw
// SIG // ggIKAoICAQDYAZwe4zjHqpUWBzWtuub+CGPXx/EyoXph
// SIG // 3zyDXtYKS2ld3YYN9uFsB9Oi3B26Z7AbpAgzYra8qNHb
// SIG // UvxFuiP8hC/2y0mPISqW30LlrrAT6/ams2HA8Qlv6p42
// SIG // +SbCNbPGzToN21QE70FS+LXH9N2k8nLM/EHgnTNJf8h0
// SIG // TmyfUKmszNa+lTxDieyy/rhBG+98OkArobPPWtbr9c3q
// SIG // zmDJ7J3kUcAm6cltdSHIIFNHESgw6taY1ScyGyBevqIl
// SIG // 120XjrIHiPM7tRckHytH1ZGsmvEplR0P7Tn9t5meFvZN
// SIG // EYttkFvad1IEguTlA5LSscXAphi+rVy3zhklhyCFeGK0
// SIG // yU0+jzbcuURKIxybmRwK5BfVZx0xEVqE4wM3yN5D/uW+
// SIG // GpVHYYAGe7bTrtW1Z13x2qj2Jdqz7NtI4tNyzlVrIf62
// SIG // nYBNe3rOYS/repVdHlR61YbLLETlibs9jFzAre4sO5RT
// SIG // xvS1yho7JqJ59oKLRnRyLhIOSZyTCVZosXeS0ZZJoGEW
// SIG // Ss4cUgsMqBiKtD4WgO2PlT3LeaQh5Io3CCA5tJ5ZCvtC
// SIG // snqaJXKhptE/xmEETIRyZRjjplUKKd+sFFVGJJVMvvrw
// SIG // 1nhIBKOLO4cTepiG39jEiEP4iHzGYCcQuvaLpDFFwqzg
// SIG // t0pBP8SJIKX5dtjDNYrZGd+ZzV5DKJVNZQIDAQABo4IB
// SIG // TjCCAUowDgYDVR0PAQH/BAQDAgGGMBAGCSsGAQQBgjcV
// SIG // AQQDAgEAMB0GA1UdDgQWBBR/WT9UIdqtT+8F5eaj1y0G
// SIG // lBIIMTAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTAP
// SIG // BgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFHItOgIx
// SIG // kEO5FAVO4eqnxzHRI4k0MFoGA1UdHwRTMFEwT6BNoEuG
// SIG // SWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8w
// SIG // M18yMi5jcmwwXgYIKwYBBQUHAQEEUjBQME4GCCsGAQUF
// SIG // BzAChkJodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // L2NlcnRzL01pY1Jvb0NlckF1dDIwMTFfMjAxMV8wM18y
// SIG // Mi5jcnQwDQYJKoZIhvcNAQEMBQADggIBABSUHzgoT+6J
// SIG // 5+nyyDCq0pTdVmCsAxYAHXcpjlDtxazPHewf1v4kOg8V
// SIG // 7A5+w+VuMDMGHi8rLXBKn5I8+DVEUYGs8jLuckc0IeC6
// SIG // owOLUrU3CYdaKRMaO55+T7jwWJ27tPkx0rlR03tFU0z1
// SIG // YYpcv6Yhaw6N2sUPT+AvjpecnrftoE33pCAkucUvnGH0
// SIG // iL4J9CZLFQVTGFSOUBbv6oZy4bBBRFMxvH779IY4JDvp
// SIG // ZKVfbcuhpDeL3Z3e8mukOmkfct+GojNapsWsQYujlJ8j
// SIG // Zen5Lrp/3YkxZ2Ay06aTpK/5oOVknwog1TDQsbY+MDyg
// SIG // uTph5tQ0CLfzDaJG2x91BrBT9UG87C6HLkqiwrx9PSKN
// SIG // 3wz05rHEfWO+RuKl+0U1/AHQT6NCOjhKI39/c7hWbdKj
// SIG // h5uuWFkBOvXGTNrnhNTAdOXTTYByvYExO8yryv34PAdq
// SIG // o1vPDE/1heVebr2RramvRUi9kWswKwPqwz7n+iRmM+B6
// SIG // YDGRweEurM1kimAb9FYrAs38YHlPnarl1vW3dGrmJTge
// SIG // fAz3DmCnXN0nveIPsS+KXBIWweeCToAJMGE7v/XS3h9q
// SIG // Q6niWQAAVQ1kUAml3zuS4MisCgi2F6YoK2WAo1EgXK/l
// SIG // XvDxVjIVU0JdL+KvCfwFJkDeVuJ9dNXGNi+AOxk0BtYd
// SIG // 9hxwL30BElj9MYIZxzCCGcMCAQEwbjBXMQswCQYDVQQG
// SIG // EwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWdu
// SIG // aW5nIFBDQSAyMDI0AhMzAAACHPrNxZvoL37EAAAAAAIc
// SIG // MA0GCWCGSAFlAwQCAQUAoIGQMBkGCSqGSIb3DQEJAzEM
// SIG // BgorBgEEAYI3AgEEMC8GCSqGSIb3DQEJBDEiBCDUZvXR
// SIG // cT6fHUqKPYwB+VCeVVYa7Vd0wvq4jjM92XXEjjBCBgor
// SIG // BgEEAYI3AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBm
// SIG // AHShGoAYaHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0G
// SIG // CSqGSIb3DQEBAQUABIIBAIw21quCT5NCOwwt9YHulSif
// SIG // bBfUqsc8s+3FpprC8xAF0bwFP2dRL/pFnkzpTEZ1LEIP
// SIG // 8KeVTYA8u2L/N6HAiBicoa4fN1p7vb6kXWHL0mkE1ne6
// SIG // 54Ol5ukP0NurUObbRDIkKBm1pdEAbvodn0RYHyYeeQE2
// SIG // yvUwJMP7lsEaxRVA+dyGnCrEXREq9CX0Jvo38rZGv/t8
// SIG // T3ikjIl9NA+MdJJOJE0Q2DnsYqBtcD6w6iQT2ywTXbha
// SIG // m2LLHzJLm2efY20Tkh3NQFuo3D9eg9enOwbLP4BspEnJ
// SIG // RqD/Xz+WFALV/l8Ivp07/jY2D1O0dkY5ly7gkiNaaMzJ
// SIG // UvgxeGhCwl6hgheXMIIXkwYKKwYBBAGCNwMDATGCF4Mw
// SIG // ghd/BgkqhkiG9w0BBwKgghdwMIIXbAIBAzEPMA0GCWCG
// SIG // SAFlAwQCAQUAMIIBUgYLKoZIhvcNAQkQAQSgggFBBIIB
// SIG // PTCCATkCAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQME
// SIG // AgEFAAQgS9iBSNFvJdum+i5ybTE20zn+jmZ4PoW5uR6X
// SIG // lwqxkkkCBmqqarzL1RgTMjAyNjEwMTMyMTEwMTQuNjEy
// SIG // WjAEgAIB9KCB0aSBzjCByzELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEnMCUGA1UECxMeblNoaWVsZCBUU1MgRVNO
// SIG // Ojk2MDAtMDVFMC1EOTQ3MSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIR7TCCByAwggUI
// SIG // oAMCAQICEzMAAAImNbQ+Z0OT9h8AAQAAAiYwDQYJKoZI
// SIG // hvcNAQELBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwHhcNMjYwMjE5MTk0MDAyWhcNMjcwNTE3MTk0MDAy
// SIG // WjCByzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMGA1UECxMc
// SIG // TWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9uczEnMCUG
// SIG // A1UECxMeblNoaWVsZCBUU1MgRVNOOjk2MDAtMDVFMC1E
// SIG // OTQ3MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBTZXJ2aWNlMIICIjANBgkqhkiG9w0BAQEFAAOCAg8A
// SIG // MIICCgKCAgEAv/8PmWSC+URRaVSPA92crjbvCM3ABDg9
// SIG // 9Di2I4d9+6143KyJTks6SXOGXlMRMpYusehes5uDUfHW
// SIG // z2/XYg6f4TlMx1hsYgNWd0VygW/+Bf6I8rzeN0hBlqkn
// SIG // 1XNyNwZbGE9+XnFQCfZFX/dGDr9vbRYyQQWZGL60/w8M
// SIG // MkS7HDsj+Kfvf5ciYw/lC7N2FwYVa32fjG0AfgWCi6kb
// SIG // wSm4/8EfWpDazMUCDaBmg+Y2Tvzf50rJhtj9c7/3L+IE
// SIG // qDAZ1nkCAZI3diOcNQ3l7qadr0ojZkebANmZASt8okFm
// SIG // ib0cTg5ZH4sh5PTJJP062E45ozwm4XvrqoRzUcvFJWzr
// SIG // 1rAqtLUbVMpB79/Q4KgHyTaxPDkrfN+awcw6a63AIcJo
// SIG // H4aFYuACnqsIpGNJ1GuPCtEMvNF0+H4hANxMRGTWkRaP
// SIG // TavxsG34KiqhpnPcYSrkRXI7bmuCh2b5wL6VoBBUjgpK
// SIG // L17PwXC55BBzPcWfIlGoOQsoTal2GBP89KXF3WGjSJEO
// SIG // vBFprry5u4PaKH1drzpuRlTaIIZ5Fhupxj6PycBIJgPa
// SIG // EktBH7xUTFjwP4KUrxd7IQKyh52hKVUkotwzW8ormIhL
// SIG // PSqNCJGXPMShXkEWqhkcawftq/+wd1/NU6bPfSoRcIPs
// SIG // A/O6HdthdjFINce7cLd4GlZxZNCGSMFDwhsCAwEAAaOC
// SIG // AUkwggFFMB0GA1UdDgQWBBRd4Z/X2CTdmP2fS1WwTyMQ
// SIG // M1x7EDAfBgNVHSMEGDAWgBSfpxVdAF5iXYP05dJlpxtT
// SIG // NRnpcjBfBgNVHR8EWDBWMFSgUqBQhk5odHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3Nv
// SIG // ZnQlMjBUaW1lLVN0YW1wJTIwUENBJTIwMjAxMCgxKS5j
// SIG // cmwwbAYIKwYBBQUHAQEEYDBeMFwGCCsGAQUFBzAChlBo
// SIG // dHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2Nl
// SIG // cnRzL01pY3Jvc29mdCUyMFRpbWUtU3RhbXAlMjBQQ0El
// SIG // MjAyMDEwKDEpLmNydDAMBgNVHRMBAf8EAjAAMBYGA1Ud
// SIG // JQEB/wQMMAoGCCsGAQUFBwMIMA4GA1UdDwEB/wQEAwIH
// SIG // gDANBgkqhkiG9w0BAQsFAAOCAgEANlMdLa/bGAo7KtBU
// SIG // colacdeTrqzV7+kJO4l/gK1T5c98OLao3EzZtXbd7U7m
// SIG // tsCTKSYTx/J+1F4Zk/fHeQ7uOC5eGnZ7HuEkH1YN0C+m
// SIG // kZFx5yVJ/MvYn7Qfz8ttp/cZ8DxX490JQzkoC7h5Xrve
// SIG // 1NIh9mWpbmGm1lyYoXYmKSvHDxxZamTgIqLdPhg/HT/k
// SIG // TLr6cbfxdi5mHpaaGcK4ohTlJpcRFFe8SR8mWZQ6rrJH
// SIG // srqtNQ07/dTeKjPHHzz4Zf9qXOB3jH/53dh6LonyWw0B
// SIG // TXeFj4S859Est7tWYd/kt7Y0HajfncsOtEWlfkVwqDi4
// SIG // BWdzAIPxqA5fn72+Ycv9Wu9XLV/MBGndT3+nXn9qan5d
// SIG // 8BXPvoZBfA1102aHyTeGFWjdyJ8GwBkAw5DSuJannAos
// SIG // cZkisInT8pxnhOTrbzaCtaZC7Jv4vBdUYxnM2f5EhdlQ
// SIG // 5KhvOuokPo1WxjkOg7t3sshXBSmaAyeAeZhAEvWk9kiq
// SIG // pZS3smzm6B+q+u7IkeQf9h57u/imLmGctARGnbQOp4Bu
// SIG // HJ0kfSbK5IYbCpm9dbo6sICcjcfdjLKBhsDYDdWiNECA
// SIG // /ArIwhcKX5jM5QOOMRymL94Zo8XqgUuLlOa0HogJ1YKS
// SIG // XmlRipv5czw7Z6aRlfu14UaeW9WcU/2e18XPiOx+/4wr
// SIG // UA2aGmUwggdxMIIFWaADAgECAhMzAAAAFcXna54Cm0mZ
// SIG // AAAAAAAVMA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9v
// SIG // dCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgMjAxMDAeFw0y
// SIG // MTA5MzAxODIyMjVaFw0zMDA5MzAxODMyMjVaMHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwMIICIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAg8AMIICCgKCAgEA5OGmTOe0ciELeaLL
// SIG // 1yR5vQ7VgtP97pwHB9KpbE51yMo1V/YBf2xK4OK9uT4X
// SIG // YDP/XE/HZveVU3Fa4n5KWv64NmeFRiMMtY0Tz3cywBAY
// SIG // 6GB9alKDRLemjkZrBxTzxXb1hlDcwUTIcVxRMTegCjhu
// SIG // je3XD9gmU3w5YQJ6xKr9cmmvHaus9ja+NSZk2pg7uhp7
// SIG // M62AW36MEBydUv626GIl3GoPz130/o5Tz9bshVZN7928
// SIG // jaTjkY+yOSxRnOlwaQ3KNi1wjjHINSi947SHJMPgyY9+
// SIG // tVSP3PoFVZhtaDuaRr3tpK56KTesy+uDRedGbsoy1cCG
// SIG // MFxPLOJiss254o2I5JasAUq7vnGpF1tnYN74kpEeHT39
// SIG // IM9zfUGaRnXNxF803RKJ1v2lIH1+/NmeRd+2ci/bfV+A
// SIG // utuqfjbsNkz2K26oElHovwUDo9Fzpk03dJQcNIIP8BDy
// SIG // t0cY7afomXw/TNuvXsLz1dhzPUNOwTM5TI4CvEJoLhDq
// SIG // hFFG4tG9ahhaYQFzymeiXtcodgLiMxhy16cg8ML6EgrX
// SIG // Y28MyTZki1ugpoMhXV8wdJGUlNi5UPkLiWHzNgY1GIRH
// SIG // 29wb0f2y1BzFa/ZcUlFdEtsluq9QBXpsxREdcu+N+VLE
// SIG // hReTwDwV2xo3xwgVGD94q0W29R6HXtqPnhZyacaue7e3
// SIG // PmriLq0CAwEAAaOCAd0wggHZMBIGCSsGAQQBgjcVAQQF
// SIG // AgMBAAEwIwYJKwYBBAGCNxUCBBYEFCqnUv5kxJq+gpE8
// SIG // RjUpzxD/LwTuMB0GA1UdDgQWBBSfpxVdAF5iXYP05dJl
// SIG // pxtTNRnpcjBcBgNVHSAEVTBTMFEGDCsGAQQBgjdMg30B
// SIG // ATBBMD8GCCsGAQUFBwIBFjNodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpb3BzL0RvY3MvUmVwb3NpdG9yeS5o
// SIG // dG0wEwYDVR0lBAwwCgYIKwYBBQUHAwgwGQYJKwYBBAGC
// SIG // NxQCBAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8G
// SIG // A1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAU1fZWy4/o
// SIG // olxiaNE9lJBb186aGMQwVgYDVR0fBE8wTTBLoEmgR4ZF
// SIG // aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwv
// SIG // cHJvZHVjdHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMu
// SIG // Y3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0
// SIG // cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcnQwDQYJ
// SIG // KoZIhvcNAQELBQADggIBAJ1VffwqreEsH2cBMSRb4Z5y
// SIG // S/ypb+pcFLY+TkdkeLEGk5c9MTO1OdfCcTY/2mRsfNB1
// SIG // OW27DzHkwo/7bNGhlBgi7ulmZzpTTd2YurYeeNg2Lpyp
// SIG // glYAA7AFvonoaeC6Ce5732pvvinLbtg/SHUB2RjebYIM
// SIG // 9W0jVOR4U3UkV7ndn/OOPcbzaN9l9qRWqveVtihVJ9Ak
// SIG // vUCgvxm2EhIRXT0n4ECWOKz3+SmJw7wXsFSFQrP8DJ6L
// SIG // GYnn8AtqgcKBGUIZUnWKNsIdw2FzLixre24/LAl4FOmR
// SIG // sqlb30mjdAy87JGA0j3mSj5mO0+7hvoyGtmW9I/2kQH2
// SIG // zsZ0/fZMcm8Qq3UwxTSwethQ/gpY3UA8x1RtnWN0SCyx
// SIG // TkctwRQEcb9k+SS+c23Kjgm9swFXSVRk2XPXfx5bRAGO
// SIG // WhmRaw2fpCjcZxkoJLo4S5pu+yFUa2pFEUep8beuyOiJ
// SIG // Xk+d0tBMdrVXVAmxaQFEfnyhYWxz/gq77EFmPWn9y8FB
// SIG // SX5+k77L+DvktxW/tM4+pTFRhLy/AsGConsXHRWJjXD+
// SIG // 57XQKBqJC4822rpM+Zv/Cuk0+CQ1ZyvgDbjmjJnW4SLq
// SIG // 8CdCPSWU5nR0W2rRnj7tfqAxM328y+l7vzhwRNGQ8cir
// SIG // Ooo6CGJ/2XBjU02N7oJtpQUQwXEGahC0HVUzWLOhcGby
// SIG // oYIDUDCCAjgCAQEwgfmhgdGkgc4wgcsxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29mdCBBbWVy
// SIG // aWNhIE9wZXJhdGlvbnMxJzAlBgNVBAsTHm5TaGllbGQg
// SIG // VFNTIEVTTjo5NjAwLTA1RTAtRDk0NzElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZaIjCgEB
// SIG // MAcGBSsOAwIaAxUAov3zMRbZKq+1zF3bEcllNJUih2eg
// SIG // gYMwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDANBgkqhkiG9w0BAQsFAAIFAO54fUYwIhgPMjAyNjEw
// SIG // MTMwOTQ5NThaGA8yMDI2MTAxNDA5NDk1OFowdzA9Bgor
// SIG // BgEEAYRZCgQBMS8wLTAKAgUA7nh9RgIBADAKAgEAAgIY
// SIG // MQIB/zAHAgEAAgISxDAKAgUA7nnOxgIBADA2BgorBgEE
// SIG // AYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAID
// SIG // B6EgoQowCAIBAAIDAYagMA0GCSqGSIb3DQEBCwUAA4IB
// SIG // AQBDTEk0E8sTDWYz/8ah14avMcYhUyQTyIBNoGE0iRrq
// SIG // Z4FlAiKd7QsIsQgZNPfeZrGEZmvnxeXTyETubLNCYPnJ
// SIG // HcF4bKPsjkdQ8jFNiBJ6TgFxueiVgK9zSq6fRc2s1IeZ
// SIG // RPhXoj9WQB3g6u4lLCWboPZY3hxoJq0K7prYefvRoMg/
// SIG // kBdhp9yRNnMXPTy4FDHN0KqElsD/lRgneZh6zs02ulfG
// SIG // XfWRO5AO59zkqiMLPU1mzauqlJ5SIGfvfOz450gTAjFd
// SIG // 02g7vkDLO9OzIQTaj04fB9nx9DERLsso+/cKd62osT/T
// SIG // jV+NDLNmA2V2aUue6cDqskh7a7Lw73FrukXkMYIEDTCC
// SIG // BAkCAQEwgZMwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTACEzMAAAImNbQ+Z0OT9h8AAQAAAiYwDQYJYIZIAWUD
// SIG // BAIBBQCgggFKMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0B
// SIG // CRABBDAvBgkqhkiG9w0BCQQxIgQg4Q/ZUUyLM6SvAgLm
// SIG // bl1ywW8oDuAWY/5UGpUZ4h30jcUwgfoGCyqGSIb3DQEJ
// SIG // EAIvMYHqMIHnMIHkMIG9BCDMMlxhZ0zbGUQa7OhjfwW1
// SIG // dKJGjT91QWKixY1LBZ24KjCBmDCBgKR+MHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwAhMzAAACJjW0PmdDk/Yf
// SIG // AAEAAAImMCIEIKkzah03kYFofFxHxxXjnGL/WESRdmiO
// SIG // SKqBMNWA65deMA0GCSqGSIb3DQEBCwUABIICAIUoyhxh
// SIG // otCK1IhFiaSkV2PrMTvpcDw0S8ekzdr9C9gvHdvJbBZU
// SIG // GqPsl0UQDbvzOiIDb1aRfR5pOB13eFnI5GCvofTwBEh6
// SIG // rUCLpwTmFRGfGbjCJESCMQLBa8dgFCpVpKf0OAvV5yX7
// SIG // hul5Nq4eWltd9eTEQqc48xaOYe8uZeVvQgxSy9RrVf4r
// SIG // 2s7FuZhJKEeYVsSvuZH0XOx4UCK2sNFkveOj3Itr4XUa
// SIG // wanlsQDimXz4fLqtSXt7Hnw5ffDBMu8IMc6UcnurehTH
// SIG // 85cnwoHEOnxLnbLqWRs+AIKTBfqWyerI8z2THLs2PKVQ
// SIG // lvXgRRrnGGzZo8ZnjhbtWMlVR2/8pkHY3OfbVjcA1qi0
// SIG // eCJpncbX2DtJFh/E35MB6F5Dl7oChNH3HWkD7EpCuesw
// SIG // rSZ6Wr2ALAhfLH4xE9qId/ROSsirLRYPNNL30AJTsYcx
// SIG // zxuQsxluqo7GccleB8Z0Crw2jUGeIxRgx0Wl89GJrg07
// SIG // 3tGTBBC1dbOklWZHjX/HtRNOM/GgU2duK1AY7+RySA11
// SIG // DuoSwOKLiQIIb1LUIhgRDg+9UMXD/g/OMXJZK0FudDIC
// SIG // VHo6lSuZSZgo5lnyhg0z55eGUykZnzcjB9OnBMVdeeF2
// SIG // 2PFvnwhIRUPtUIj7NCrtsBoMe0MzqL8coYBWJapqCv9f
// SIG // p6f/iJIK1CZ79Uja
// SIG // End signature block
