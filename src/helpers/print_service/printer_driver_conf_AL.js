const isMac = navigator.platform.toUpperCase().match("MAC") ? true : false;

const printerDriverConfigPreset = {
  dymo_lw_450_series_300X600dpi: {
    tag: "dymo",
    name: "Dymo LW 450series 300X600dpi (Best, default value)",
    density: 600,
    transform_scale: isMac ? "1" : "0.5"
  },
  dymo_lw_450_series_300X300dpi: {
    tag: "dymo",
    name: "Dymo LW450series 300X300dpi (Normal)",
    density: 300,
    transform_scale: "1"
  },
  zebra_series_203dpi: {
    tag: "zebra",
    name: "Zebra 203dpi",
    density: 203
  }
}

export default printerDriverConfigPreset;