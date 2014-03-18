import {
    Map
} from 'immutable/dist/immutable';
import actions from './actions';

const initState = new Map({
  qzTrayConnectionStatus: false,
  npPrinterConnectionStatus: false,
  alPrintSystemEditMode: false,
  qzAvaliblePrinters: [],
  printQueue: [],
  printerServiceIsProcessing: false
})

export default function printerHelperQzReducer(state = initState, action) {
    switch (action.type) {

      case actions.SET_QZ_TRAY_CONNECTION_STATUS:
        return state
          .set('qzTrayConnectionStatus', action.status);

      case actions.SET_PRINTER_SERVICE_IS_PROCESSING:
          return state
            .set('printerServiceIsProcessing', action.status);
          
      case actions.SET_AL_PRINT_SYSTEM_EDIT_MODE:
        return state
          .set('alPrintSystemEditMode', action.mode);
          
      case actions.SET_NP_PRINTER_CONNECTION_STATUS:
        return state
          .set('npPrinterConnectionStatus', action.status);

      case actions.SET_QZ_AVALIBLE_PRINTERS_LIST:
        return state
          .set('qzAvaliblePrinters', action.printersArray);

      case actions.ADD_TO_PRINT_QUEUE:
        return state
        .update('printQueue', (printQueue) => {
          const data = action.data;
          const copies = action.copies;
          const buffData = {
            data: data,
            copies: copies || 1,
            id: Math.floor(Math.random() * (10000))
          }
          return [...printQueue.concat(buffData)]
      });

      case actions.DEL_JOB_FROM_PRINT_QUEUE:
        return state
        .update('printQueue', (printQueue) => {
          const buffData = [...printQueue];
          if (buffData && buffData.length > 0) {
            return [...buffData.slice(1, buffData.length)]
          } else {
            return printQueue;
          }
      });

      case actions.CLEAR_PRINT_JOB_QUEUE:
        return state.set('printQueue', initState.get("printQueue"));
      
      default:
        return state
    }
}