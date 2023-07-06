import { components } from './swaggerSpec';

type schemas = components['schemas'];

type MakeIdRequired<T extends { id?: unknown }> = T & Required<Pick<T, 'id'>>;

/**
 * TODO: remove "Required<Pick>" typing hacks after API swagger spec is fixed
 */

// Construction Units (Assembly and Subasssembly)
export type AssemblyRecord = MakeIdRequired<schemas['AssemblyModel']>;
export type SubassemblyRecord = MakeIdRequired<schemas['SubassemblyModel']>;
export type CommonAssemblyRecord = SubassemblyRecord | AssemblyRecord;

export type AssemblyChildRecord = MakeIdRequired<schemas['AssemblyChildModel']>;
export type SubassemblyChildRecord = MakeIdRequired<
  schemas['SubassemblyChildModel']
>;

// Employee
export type EmployeeRecord = MakeIdRequired<schemas['EmployeeModel']>;

// Contractor
export type ContractorRecord = MakeIdRequired<schemas['ContractorModel']>;
export type ContractorRateRecord = MakeIdRequired<
  schemas['ContractorRateModel']
>;

// Equipment
export type EquipmentRecord = MakeIdRequired<schemas['EquipmentModel']>;
// export type AssetFindaEquipment = schemas['AssetFindaEquipmentModel'];
// export type EquipmentEventRecord = schemas['EventOverviewEquipmentViewModel'];
// export type EquipmentPartKitRecord = schemas['PartKitEquipmentModel'];

// // Fleet Orders
// export type FleetOrderRecord = schemas['FleetOrderModel'];
// export type FleetOrderTransactionRecord =
//   schemas['FleetOrderTransactionViewModel'];
// export type FleetOrderTaskRecord = schemas['FleetOrderTaskListModel'];
// export type FleetOrderPartKitRecord = schemas['PartKitFleetOrderModel'];
// export type FleetOrderEventRecord = schemas['FleetOrderEventModel'];
// export type FleetOrderModificationRecord =
//   schemas['FleetOrderModificationsModel'];
// export type FleetOrderGlCodeRecord = schemas['GlCodeModel'];

// // Fuel Codes
// export type FuelCodeRecord = schemas['FuelModel'];

// FERC Account
export type FercAccountRecord = MakeIdRequired<schemas['FercAccountModel']>;

// List Code
export type ListCodeRecord = MakeIdRequired<schemas['ListCodeModel']>;

// District
export type DistrictRecord = MakeIdRequired<schemas['DistrictModel']>;

// Budget
export type BudgetRecord = MakeIdRequired<schemas['BudgetModel']>;

// // Look Up Tables
// export type LUT_Model = schemas['LutModelModel'];
// export type LUT_ServiceRequestType = schemas['LutServiceRequestTypeModel'];
// export type LUT_Unit = schemas['LutUnitModel'];

// // Maintenance Status
// export type MaintenanceStatus = schemas['MaintenanceStatusTypeModel'];

// // Part Kit
// export type PartKitRecord = schemas['PartKitModel'];
// export type PartKitChildRecord = schemas['PartKitContentsModel'];

// Stock
export type StockRecord = MakeIdRequired<schemas['StockModel']>;

export type StockWarehouseRecord = schemas['StockWarehouseModel'];
// export type StockTransactionRecord =
//   schemas['StockTransactionHistoryViewModel'];
export type StockConstructionUnitRecord = schemas['StockConstructionUnitModel'];

// // Task
// export type TaskRecord = schemas['TaskModel'];

// // Task List
// export type TaskListRecord = schemas['TaskListModel'];
// export type TaskListChildRecord = schemas['TaskListTaskModel'];

// Unit of Measure
export type UnitOfMeasureRecord = MakeIdRequired<schemas['UnitOfMeasureModel']>;
// export type UnitOfMeasureTypeRecord = schemas['UnitOfMeasureTypeModel'];

// Warehouse
export type WarehouseRecord = MakeIdRequired<schemas['WarehouseModel']>;

export type WarehouseStockRecord = schemas['StockWarehouseModel'];

// Project CPS
export type ProjectDataCPS = schemas['MeetingMinutesModel'];

// Work Order
export type WorkOrderRecord = MakeIdRequired<schemas['WorkOrderModel']>;
export type WorkOrderFinancialSummaryRecord =
  schemas['WorkOrderFinancialSummaryModel'];

export type WorkOrderEstimateRecord = MakeIdRequired<schemas['EstimateModel']>;
export type WorkOrderEstimateSummaryRecord =
  schemas['EstimateSummaryOverviewModel'];
export type WorkOrderEstimateToActualSummaryRecord =
  schemas['EstimateToActualSummaryModel'];
export type WorkOrderEstimateToActualDetailRecord =
  schemas['EstimateToActualDetailModel'];
export type WorkOrderEstimateConstructionUnitRecord =
  schemas['StakingFeatureCalloutModel'];

// Events
export type EventRecord = schemas['EventModel'];

// Image Blob API
// export type ImageBlobData = {
//   blobId: string;
//   entityCategory: string;
//   extension: string;
//   lastUpdated: string;
//   modelId: string;
//   path: string;
//   productId: number;
//   tenantId: string;
// };
