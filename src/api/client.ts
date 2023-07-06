import {
  AssemblyChildRecord,
  AssemblyRecord,
  EmployeeRecord,
  ContractorRecord,
  ContractorRateRecord,
  // EquipmentEventRecord,
  // EquipmentPartKitRecord,
  EquipmentRecord,
  EventRecord,
  // FleetOrderEventRecord,
  // FleetOrderGlCodeRecord,
  // FleetOrderPartKitRecord,
  // FleetOrderRecord,
  // FleetOrderTaskRecord,
  // FleetOrderTransactionRecord,
  // FleetOrderModificationRecord,
  // FuelCodeRecord,
  FercAccountRecord,
  // LUT_Model,
  // LUT_ServiceRequestType,
  // LUT_Unit,
  ListCodeRecord,
  DistrictRecord,
  BudgetRecord,
  // MaintenanceStatus,
  // PartKitRecord,
  StockConstructionUnitRecord,
  StockRecord,
  // StockTransactionRecord,
  StockWarehouseRecord,
  SubassemblyChildRecord,
  SubassemblyRecord,
  // TaskListChildRecord,
  // TaskListRecord,
  // TaskRecord,
  UnitOfMeasureRecord,
  // UnitOfMeasureTypeRecord,
  WarehouseRecord,
  WarehouseStockRecord,
  WorkOrderRecord,
  WorkOrderFinancialSummaryRecord,
  WorkOrderEstimateRecord,
  WorkOrderEstimateSummaryRecord,
  WorkOrderEstimateToActualSummaryRecord,
  WorkOrderEstimateToActualDetailRecord,
  WorkOrderEstimateConstructionUnitRecord,
  ProjectDataCPS,
} from './models';
import { axiosInstance } from './fetch';

export interface PaginationParams {
  limit?: number;
  page?: number;
}

export type QueryParams = PaginationParams & { [key: string]: any };

/**
 * Utility function to create methods that GET paginated records
 *
 * @param path The path to fetch, ex. '/stock'
 */
const makeGetPaginatedRecords =
  <RecordType>(path: string) =>
  async ({ limit = 10, page = 1, ...params }: QueryParams = {}) =>
    axiosInstance.get<RecordType[]>(path, {
      params: {
        'PagingParams.limit': limit,
        'PagingParams.page': page,
        ...params,
      },
    });

/**
 * Utility function that creates a method to create (POST) a record
 *
 * @param path The path to fetch, ex. for creating a particular stock, use '/stock'
 */
const makeCreateRecord =
  <RecordType>(path: string) =>
  (data: Partial<RecordType>, params: { [key: string]: any } = {}) =>
    axiosInstance.post<void>(path, data, { params });

/**
 * Utility function that creates a method to GET a record
 *
 * @param path The path to fetch, ex. for retrieving a particular stock, use '/stock'
 */
const makeGetRecord =
  <RecordType, IDType>(path: string) =>
  (itemId: IDType, params: { [key: string]: any } = {}) =>
    axiosInstance.get<RecordType>(`${path}/${itemId}`, { params });

/**
 * Utility function that creates a method to update (PUT) a record
 *
 * @param path The path to fetch, ex. for updating a particular stock, use '/stock'
 */
const makeUpdateRecord =
  <RecordType, IDType>(path: string) =>
  (
    itemId: IDType,
    data: Partial<RecordType>,
    params: { [key: string]: any } = {}
  ) =>
    axiosInstance.put<void>(`${path}/${itemId}`, data, { params });

/**
 * Utility function that creates a method to DELETE a record
 *
 * @param path The path to fetch, ex. for deleting a particular stock, use '/stock'
 */
const makeDeleteRecord =
  <IDType>(path: string) =>
  (itemId: IDType) =>
    axiosInstance.delete<void>(`${path}/${itemId}`);

/**
 * Generate all methods for a particular record
 *
 * GET /{record} - get all records
 * POST /{record} - create a record
 * GET /{record}/:id - get a particular record
 * PUT /{record}/:id - update a particular record
 * DELETE /{record}/:id - delete a particular record
 *
 * @param path Path prefix for the record
 */
const makeAllMethods = <RecordType, IDType = number>(path: string) =>
  [
    makeGetPaginatedRecords<RecordType>(path),
    makeCreateRecord<RecordType>(path),
    makeGetRecord<RecordType, IDType>(path),
    makeUpdateRecord<RecordType, IDType>(path),
    makeDeleteRecord<IDType>(path),
  ] as const;


/**
 * Project CPS
 */
export const [
  getProjectsCPS,
  createProjectCPS,
  getProjectCPSById,
  updateProjectById,
  deleteProjectById,
] = makeAllMethods<ProjectDataCPS>('test');

/**
 * Work Order
 */
export const [
  getWorkOrders,
  createWorkOrder,
  getWorkOrderById,
  updateWorkOrderById,
  deleteWorkOrderById,
] = makeAllMethods<WorkOrderRecord>('/workorder');

/**
 * GET /workorder/:id/history
 *
 * @param workOrderId ID of the workorder
 * @param params Query parameters
 */
export const getWorkOrderHistory = (
  workOrderId: number,
  params: QueryParams = {}
) =>
  makeGetPaginatedRecords<EventRecord>(`/workorder/${workOrderId}/history`)(
    params
  );

/**
 * GET /workorder/:id/financialsummary
 *
 * @param workOrderId ID of the workorder
 * @param params Query parameters
 */
export const getWorkOrderFinancialSummary = (
  workOrderId: number,
  params: QueryParams = {}
) =>
  axiosInstance.get<WorkOrderFinancialSummaryRecord>(
    `/workorder/${workOrderId}/financialsummary`,
    { params }
  );

/**
 * GET /workorder/:id/estimate
 *
 * @param workOrderId ID of the workorder
 * @param params Query parameters
 */
export const getWorkOrderEstimates = (
  workOrderId: number,
  params: QueryParams = {}
) =>
  makeGetPaginatedRecords<WorkOrderEstimateRecord>(
    `/workorder/${workOrderId}/estimate`
  )(params);

/**
 * GET /workorder/:id/estimate/:estimateId/summary
 *
 * @param workOrderId ID of the workorder
 * @param estimateId ID of the estimate
 * @param params Query parameters
 */
export const getWorkOrderEstimateSummary = (
  workOrderId: number,
  estimateId: number,
  params: QueryParams = {}
) =>
  axiosInstance.get<WorkOrderEstimateSummaryRecord>(
    `/workorder/${workOrderId}/estimate/${estimateId}/summary`,
    { params }
  );

/**
 * GET /workorder/:id/estimate/:estimateId/constructionunit
 *
 * @param workOrderId ID of the workorder
 * @param estimateId ID of the estimate
 * @param params Query parameters
 */
export const getWorkOrderEstimateConstructionUnit = (
  workOrderId: number,
  estimateId: number,
  params: QueryParams = {}
) =>
  axiosInstance.get<WorkOrderEstimateConstructionUnitRecord[]>(
    `/workorder/${workOrderId}/estimate/${estimateId}/constructionunit`,
    { params }
  );

/**
 * GET /workorder/:id/estimatetoactualsummary
 *
 * @param workOrderId ID of the workorder
 * @param params Query parameters
 */
export const getWorkOrderEstimateToActualSummary = (
  workOrderId: number,
  params: QueryParams = {}
) =>
  axiosInstance.get<WorkOrderEstimateToActualSummaryRecord>(
    `/workorder/${workOrderId}/estimatetoactualsummary`,
    { params }
  );

/**
 * GET /workorder/:id/estimatetoactualdetail
 *
 * @param workOrderId ID of the workorder
 * @param params Query parameters
 */
export const getWorkOrderEstimateToActualDetail = (
  workOrderId: number,
  params: QueryParams = {}
) =>
  axiosInstance.get<WorkOrderEstimateToActualDetailRecord[]>(
    `/workorder/${workOrderId}/estimatetoactualdetail`,
    { params }
  );

/**
 * Estimate
 */
export const [
  getEstimates,
  createEstimate,
  getEstimateById,
  updateEstimateById,
  deleteEstimateById,
] = makeAllMethods<WorkOrderEstimateRecord>('/estimate');

// /**
//  * Fleet Order
//  */
// export const [
//   getFleetOrders,
//   createFleetOrder,
//   getFleetOrderById,
//   updateFleetOrderById,
//   deleteFleetOrderById,
// ] = makeAllMethods<FleetOrderRecord>('/fleetorder');

// /**
//  * GET /fleetorder/:id/transaction
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const getFleetOrderTransactions = (
//   fleetOrderId: number,
//   params: QueryParams & { transactionGroup?: string } = {}
// ) =>
//   makeGetPaginatedRecords<FleetOrderTransactionRecord>(
//     `/fleetorder/${fleetOrderId}/transaction`
//   )(params);

// /**
//  * POST /fleetorder/:id/transaction
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const createFleetOrderTransactions = (
//   fleetOrderId: number,
//   data: Partial<FleetOrderTransactionRecord>[],
//   params: { [key: string]: any } = {}
// ) =>
//   axiosInstance.post<void>(`/fleetorder/${fleetOrderId}/transaction`, data, {
//     params,
//   });

// /**
//  * GET /fleetorder/:id/advancestatus
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const advanceFleetOrderStatus = (
//   fleetOrderId: number,
//   params: { [key: string]: any } = {}
// ) => axiosInstance.get(`/fleetorder/${fleetOrderId}/advancestatus`, { params });

// /**
//  * GET /fleetorder/:id/reversestatus
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const reverseFleetOrderStatus = (
//   fleetOrderId: number,
//   params: { [key: string]: any } = {}
// ) => axiosInstance.get(`/fleetorder/${fleetOrderId}/reversestatus`, { params });

// /**
//  * GET /fleetorder/:id/tasklist
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const getFleetOrderTaskList = (
//   fleetOrderId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<FleetOrderTaskRecord>(
//     `/fleetorder/${fleetOrderId}/tasklist`
//   )(params);

// /**
//  * PUT /fleetorder/:id/tasklist/:fleetOrderTaskId
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const updateFleetOrderTask = (
//   fleetOrderId: number,
//   fleetOrderTaskId: number,
//   data: Partial<FleetOrderTaskRecord>,
//   params: { [key: string]: any } = {}
// ) =>
//   makeUpdateRecord<FleetOrderTaskRecord, number>(
//     `/fleetorder/${fleetOrderId}/tasklist`
//   )(fleetOrderTaskId, data, params);

// /**
//  * GET /fleetorder/:id/partkit
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const getFleetOrderPartKit = (
//   fleetOrderId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<FleetOrderPartKitRecord>(
//     `/fleetorder/${fleetOrderId}/partkit`
//   )(params);

// /**
//  * GET /fleetorder/:id/glcode
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const getFleetOrderGlCodes = (
//   fleetOrderId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<FleetOrderGlCodeRecord>(
//     `/fleetorder/${fleetOrderId}/glcode`
//   )(params);

// /**
//  * GET /fleetorder/:id/event
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const getFleetOrderEvents = (
//   fleetOrderId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<FleetOrderEventRecord>(
//     `/fleetorder/${fleetOrderId}/event`
//   )(params);

// /**
//  * GET /fleetorder/:id/modification
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const getFleetOrderModifications = (
//   fleetOrderId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<FleetOrderModificationRecord>(
//     `/fleetorder/${fleetOrderId}/modification`
//   )(params);

// /**
//  * POST /fleetorder/:id/modification
//  *
//  * @param fleetOrderId ID of the fleet order
//  * @param params Query parameters
//  */
// export const updateFleetOrderModifications = (
//   fleetOrderId: number,
//   data: Partial<FleetOrderModificationRecord>[],
//   params: { [key: string]: any } = {}
// ) =>
//   axiosInstance.post<void>(`/fleetorder/${fleetOrderId}/modification`, data, {
//     params,
//   });

/**
 * Equipment
 */
export const [
  getEquipment,
  createEquipment,
  getEquipmentById,
  updateEquipmentById,
  deleteEquipmentById,
] = makeAllMethods<EquipmentRecord>('/equipment');

// /**
//  * GET /equipment/:id/event
//  *
//  * @param equipmentId ID of the equipment
//  * @param params Query parameters
//  */
// export const getEquipmentEvents = (
//   equipmentId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<EquipmentEventRecord>(
//     `/equipment/${equipmentId}/event`
//   )(params);

// /**
//  * GET /equipment/:id/partkit
//  *
//  * @param equipmentId ID of the equipment
//  * @param params Query parameters
//  */
// export const getEquipmentPartKits = (
//   equipmentId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<EquipmentPartKitRecord>(
//     `/equipment/${equipmentId}/partkit`
//   )(params);

/**
 * Stock
 */
export const [
  getStock,
  createStock,
  getStockById,
  updateStockById,
  deleteStockById,
] = makeAllMethods<StockRecord>('/stock');

/**
 * GET /stock/:id/warehouse
 *
 * @param stockId ID of the stock
 * @param params Query parameters
 */
export const getStockWarehouses = (stockId: number, params: QueryParams = {}) =>
  makeGetPaginatedRecords<StockWarehouseRecord>(`/stock/${stockId}/warehouse`)(
    params
  );

/**
 * GET /stock/:id/constructionunit
 *
 * @param stockId ID of the stock
 * @param params Query parameters
 */
export const getStockConstructionUnits = (
  stockId: number,
  params: QueryParams = {}
) =>
  makeGetPaginatedRecords<StockConstructionUnitRecord>(
    `/stock/${stockId}/constructionunit`
  )(params);

// /**
//  * GET /stock/:id/transaction
//  *
//  * @param stockId ID of the stock
//  * @param params Query parameters
//  */
// export const getStockTransactions = (
//   stockId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<StockTransactionRecord>(
//     `/stock/${stockId}/transaction`
//   )(params);

// /**
//  * POST /stock/:id/transaction
//  *
//  * @param stockId ID of the stock
//  * @param params Query parameters
//  */
// export const createStockTransaction = (
//   stockId: number,
//   data: Partial<StockTransactionRecord>,
//   params: { [key: string]: any } = {}
// ) =>
//   axiosInstance.post<void>(`/stock/${stockId}/transaction`, data, { params });

/**
 * Construction Units
 */
export const [getConstructionUnits, , getConstructionUnitById, , ,] =
  makeAllMethods<AssemblyRecord>('/constructionunit');

/**
 * Assemblies
 */
export const [
  getAssemblies,
  createAssembly,
  getAssemblyById,
  updateAssemblyById,
  deleteAssemblyById,
] = makeAllMethods<AssemblyRecord>('/assembly');

/**
 * GET /assembly/:id/child
 *
 * @param id ID of the assembly
 * @param params Query parameters
 */
export const getAssemblyChildren = (id: number, params: QueryParams = {}) =>
  makeGetPaginatedRecords<AssemblyChildRecord>(`/assembly/${id}/child`)(params);

/**
 * Subassemblies
 */
export const [
  getSubassemblies,
  createSubassembly,
  getSubassemblyById,
  updateSubassemblyById,
  deleteSubassemblyById,
] = makeAllMethods<SubassemblyRecord>('/subassembly');

/**
 * GET /subassembly/:id/child
 * @param id ID of the subassembly
 * @param params Query parameters
 */
export const getSubassemblyChildren = (id: number, params: QueryParams = {}) =>
  makeGetPaginatedRecords<SubassemblyChildRecord>(`/subassembly/${id}/child`)(
    params
  );

/**
 * List Codes
 */
export const [
  getListCodes,
  createListCode,
  getListCodeById,
  updateListCodeById,
  deleteListCodeById,
] = makeAllMethods<ListCodeRecord>('/test');

/**
 * Districts
 */
export const [
  getDistricts,
  createDistrict,
  getDistrictById,
  updateDistrictById,
  deleteDistrictById,
] = makeAllMethods<DistrictRecord>('/district');

/**
 * Budgets
 */
export const [
  getBudgets,
  createBudget,
  getBudgetById,
  updateBudgetById,
  deleteBudgetById,
] = makeAllMethods<BudgetRecord>('/budget');

/**
 * Unit of Measure
 */
export const [
  getUnitOfMeasures,
  createUnitOfMeasure,
  getUnitOfMeasureById,
  updateUnitOfMeasureById,
  deleteUnitOfMeasureById,
] = makeAllMethods<UnitOfMeasureRecord>('/unitofmeasure');

// /**
//  * Unit of Measure Types
//  */
// export const [getUnitOfMeasureTypes, , getUnitOfMeasureTypeById, , ,] =
//   makeAllMethods<UnitOfMeasureTypeRecord>('/unitofmeasuretype');

/**
 * FERC Accounts
 */
export const [
  getFercAccounts,
  createFercAccount,
  getFercAccountById,
  updateFercAccountById,
  deleteFercAccountById,
] = makeAllMethods<FercAccountRecord>('/fercaccount');

/**
 * Warehouse
 */
export const [
  getWarehouses,
  createWarehouse,
  getWarehouseById,
  updateWarehouseById,
  deleteWarehouseById,
] = makeAllMethods<WarehouseRecord>('/warehouse');

/**
 * GET /warehouse/:id/stock
 *
 * @param warehouseId ID of the warehouse
 * @param params Query parameters
 */
export const getWarehouseStock = (
  warehouseId: number,
  params: QueryParams = {}
) =>
  makeGetPaginatedRecords<WarehouseStockRecord>(
    `/warehouse/${warehouseId}/stock`
  )(params);

// /**
//  * Fuel Code
//  */
// export const [
//   getFuelCodes,
//   createFuelCode,
//   getFuelCodeById,
//   updateFuelCodeById,
//   deleteFuelCodeById,
// ] = makeAllMethods<FuelCodeRecord>('/fuelcode');

// /**
//  * Tasks
//  */
// export const [
//   getTasks,
//   createTask,
//   getTaskById,
//   updateTaskById,
//   deleteTaskById,
// ] = makeAllMethods<TaskRecord>('/task');

// /**
//  * Task Lists
//  */
// export const [
//   getTaskLists,
//   createTaskList,
//   getTaskListById,
//   updateTaskListById,
//   deleteTaskListById,
// ] = makeAllMethods<TaskListRecord>('/tasklist');

// /**
//  * GET /tasklist/:id/child
//  *
//  * @param taskListId ID of the task list
//  * @param params Query parameters
//  */
// export const getTaskListChildren = (
//   taskListId: number,
//   params: QueryParams = {}
// ) =>
//   makeGetPaginatedRecords<TaskListChildRecord>(`/tasklist/${taskListId}/child`)(
//     params
//   );

// /**
//  * Part Kits (now known as "Service Kits")
//  */
// export const [
//   getPartKits,
//   createPartKit,
//   getPartKitById,
//   updatePartKitById,
//   deletePartKitById,
// ] = makeAllMethods<PartKitRecord>('/partkit');

// /**
//  * Look Up Tables
//  */

// // Service request types
// export const getLUTServiceRequestTypes = (
//   params: { [key: string]: any } = {}
// ) =>
//   axiosInstance.get<LUT_ServiceRequestType[]>('/lut_servicerequesttype', {
//     params,
//   });

// // Models
// export const getLUTModels = (params: { [key: string]: any } = {}) =>
//   axiosInstance.get<LUT_Model[]>('/lut_model', {
//     params,
//   });

// // Units
// export const getLUTUnits = (params: { [key: string]: any } = {}) =>
//   axiosInstance.get<LUT_Unit[]>('/lut_unit', {
//     params,
//   });

// /**
//  * Maintenance Status
//  */

// export const getMaintenanceStatuses = (params: { [key: string]: any } = {}) =>
//   axiosInstance.get<MaintenanceStatus[]>('/maintenancestatustype', {
//     params,
//   });

/**
 * Employee
 */
export const [
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
] = makeAllMethods<EmployeeRecord>('/employee');

/**
 * Contractor
 */
export const [
  getContractors,
  createContractor,
  getContractorById,
  updateContractorById,
  deleteContractorById,
] = makeAllMethods<ContractorRecord>('/contractor');

/**
 * GET /contractor/:id/rate
 *
 * @param contractorId ID of the contractor
 * @param params Query parameters
 */
export const getContractorRates = (
  contractorId: number,
  params: QueryParams = {}
) =>
  makeGetPaginatedRecords<ContractorRateRecord>(
    `/contractor/${contractorId}/rate`
  )(params);

// /**
//  * Image Blob Controller in Unity Tenants API
//  */

// // TODO: move elsewhere
// const PRODUCT_ID = 1;
// const TENANT_ID = 'f86a9b7c-bab0-4281-89a2-52b4caf89fab';
// const ENTITY_CATEGORY = 'Assets';

// /**
//  * Get image by modelId
//  *
//  * @param modelId
//  * @returns Axios response
//  */
// export const getImageByModelId = (modelId: string) =>
//   axiosInstance.get(
//     `${process.env.REACT_APP_TENANTS_API_BASE}/imageblob/product/${PRODUCT_ID}/tenant/${TENANT_ID}/entitycategory/${ENTITY_CATEGORY}/model/${modelId}`
//   );

// /**
//  * Update image by modelId
//  *
//  * @param modelId ModelId to update
//  * @param file Blob data of image
//  * @returns Axios response
//  */
// export const updateImageByModelId = (modelId: string, file: Blob) => {
//   const formData = new FormData();

//   formData.append('uploadImage', file);
//   formData.append('TenantId', TENANT_ID);
//   formData.append('ProductId', PRODUCT_ID.toString());
//   formData.append('EntityCategory', ENTITY_CATEGORY);
//   formData.append('ModelId', modelId);

//   return axiosInstance.post(
//     `${process.env.REACT_APP_TENANTS_API_BASE}/imageblob`,
//     formData,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   );
// };

// /**
//  * Get image by blobId
//  *
//  * @param blobId ID of the image
//  * @returns Axios response
//  */
// export const getImageByBlobId = (blobId: string) =>
//   axiosInstance.get(
//     `${process.env.REACT_APP_TENANTS_API_BASE}/imageblob/${blobId}`
//   );

// /**
//  * Delete image by blobId
//  *
//  * @param blobId ID of the image
//  * @returns Axios response
//  */
// export const deleteImageByBlobId = (blobId: string) =>
//   axiosInstance.delete(
//     `${process.env.REACT_APP_TENANTS_API_BASE}/imageblob/${blobId}`
//   );
