const printerActions = {
    
    SET_QZ_TRAY_CONNECTION_STATUS: "SET_QZ_TRAY_CONNECTION_STATUS",
    SET_NP_PRINTER_CONNECTION_STATUS: "SET_NP_PRINTER_CONNECTION_STATUS",
    SET_QZ_AVALIBLE_PRINTERS_LIST: "SET_QZ_AVALIBLE_PRINTERS_LIST",

    SET_AL_PRINT_SYSTEM_EDIT_MODE: "SET_AL_PRINT_SYSTEM_EDIT_MODE",
    SET_PRINTER_SERVICE_IS_PROCESSING: "SET_PRINTER_SERVICE_IS_PROCESSING",

    ADD_TO_PRINT_QUEUE: "ADD_TO_PRINT_QUEUE",
    DEL_JOB_FROM_PRINT_QUEUE: "DEL_JOB_FROM_PRINT_QUEUE",
    CLEAR_PRINT_JOB_QUEUE: "CLEAR_PRINT_JOB_QUEUE",
    
    setALPrintSystemEditMode: mode => ({
      type: printerActions.SET_AL_PRINT_SYSTEM_EDIT_MODE,
      mode
    }),

    setQzTrayConnectionStatus: status => ({
      type: printerActions.SET_QZ_TRAY_CONNECTION_STATUS,
      status
    }),

    setNPPrinterConnectionStatus: status => ({
      type: printerActions.SET_NP_PRINTER_CONNECTION_STATUS,
      status
    }),

    setQzAvaliblePrintersList: printersArray => ({
      type: printerActions.SET_QZ_AVALIBLE_PRINTERS_LIST,
      printersArray
    }),

    print: (data, copies) => ({
      type: printerActions.ADD_TO_PRINT_QUEUE,
      data,
      copies
    }),

    printJobSuccess: () => ({
      type: printerActions.DEL_JOB_FROM_PRINT_QUEUE,
    }),

    setPrinterServiceIsProcessing: (status) => ({
      type: printerActions.SET_PRINTER_SERVICE_IS_PROCESSING,
      status
    }),

    clearPrintJobQueue: () => ({
      type: printerActions.CLEAR_PRINT_JOB_QUEUE,
    }),
}

export default printerActions;
  