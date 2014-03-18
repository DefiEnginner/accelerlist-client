export const currentWorkingListingDataSelector = (state) => state.Batch.get('currentWorkingListingData');
export const batchMetadataSelector = (state) => state.Batch.get('batchMetadata');
export const batchIdSelector = (state) => {
    const batchMetadata = state.Batch.get('batchMetadata');
    if (batchMetadata) {
        return batchMetadata.id;
    }
    return null;
};
export const shipmentIdToCurrentBoxMappingSelector = (state) => state.Batch.get('shipmentIdToCurrentBoxMapping');
export const shipmentIdToBoxCountMappingSelector = (state) => state.Batch.get('shipmentIdToBoxCountMapping');
export const batchListingDefaultsSelector = (state) => state.Batch.get('batchListingDefaults');
export const productsSelector = (state) => state.Batch.get('products');
export const existingShipmentsSelector = (state) => state.Batch.get('existingShipments');
export const currentListingWorkflowOptionsSelector = (state) => state.Batch.get('currentListingWorkflowOptions');