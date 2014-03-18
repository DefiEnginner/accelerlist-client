import { Map } from "immutable";
import moment from "moment";
import "moment/min/locales";
import LogRocket from "logrocket";

export function clearToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getToken() {
  try {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    return new Map({ access_token, refresh_token });
  } catch (err) {
    clearToken();
    return new Map();
  }
}

export function openInNewTab(url) {
  let win = window.open(url);
  win.focus();
}


export function openInNewTabExtended(url, tabName, focus=false) {
	let win = window.open(url, tabName);
	if(focus){
		win.focus();
	}
}

export function digitСonversion(data, style, currency, maximumFractionDigits=2) {
  const lng = navigator.language || navigator.userLanguage;
  let number = Number(data);
  let settings = { style: "decimal", maximumFractionDigits: maximumFractionDigits };

  function transformNumberToAbbreviated(number, decPlaces) {
    decPlaces = Math.pow(10,decPlaces);
    const abbrev = [ "k", "M", "b", "t" ];
      for (let i=abbrev.length-1; i>=0; i--) {
        const size = Math.pow(10,(i+1)*3);
        if (size <= number) {
          number = Math.round(number*decPlaces/size)/decPlaces;
          number += abbrev[i];
          break;
        }
      }
    return number;
  }

  if (style) {
    switch (style) {
      case "decimal":
        settings = { style: "decimal", maximumFractionDigits: maximumFractionDigits };
        break;
      case "percent":
        settings = { style: "percent", maximumFractionDigits: maximumFractionDigits };
        number = number / 100;
        break;
      case "currency":
        settings = {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        };
        break;
      case "rank":
        return transformNumberToAbbreviated(data, 1);

      default:
        settings = { style: "decimal", maximumFractionDigits: maximumFractionDigits };
    }
  }

  const formatter = new Intl.NumberFormat(lng, settings);
  return formatter.format(number);
}

export const validateFloatInput = (isFinal, allowEmpty, precision = 2) => e => {
  const { value } = e.target;
  let regex = /(\d*(\.)?(\d+)?)/;
  if (isFinal) {
    regex = /(\d*(\.\d+)?)/;
  }
  const result = value.match(regex);
  if (result && result.length > 1) {
    if (isFinal) {
      e.target.value = parseFloat(result[0]).toFixed(precision);
    } else {
      e.target.value = result[0];
    }
  } else {
    if (allowEmpty) {
      return null;
    } else {
      e.target.value = 0;
    }
  }
  return e.target.value;
};

export const getPage = (pageNo, pageSize) => (element, index) => {
  if ((pageNo - 1) * pageSize <= index && pageNo * pageSize > index) {
    return true;
  }
  return false;
}

export const getPaginatorOptions = (current, total, withNextAndPrev) => {
  let delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i < right)) {
      range.push(i);
    }
  }

  if (withNextAndPrev && total > 1 && current !== 1) {
    rangeWithDots.push('-')
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  if (withNextAndPrev && total > 1 && current !== total) {
    rangeWithDots.push('+')
  }

  return rangeWithDots;
};


export const momentDateToLocalFormatConversion = (date, convertToLocalTime) => {
  const lng = navigator.language || navigator.userLanguage;
  moment.locale(lng);
  if (convertToLocalTime) {
    if (date){
      if (momentDateIsValid(date)){
        return moment.utc(date).local().format("L");
      } else {
        return null;
      }
    } else {
      return moment.utc().local().format("L");
    }
  } else {
    if (date){
      if (momentDateIsValid(date)){
        return moment(date).format("L");
      } else {
        return null;
      }
    } else {
      return moment().format("L");
    }
  }
}

export const momentDateTimeToLocalFormatConversion = (date, convertToLocalTime) => {
  const lng = navigator.language || navigator.userLanguage;
  moment.locale(lng);
  if (convertToLocalTime) {
    if (date){
      if (momentDateIsValid(date)){
        return moment.utc(date).local().format("L LT");
      } else {
        return null;
      }
    } else {
      return moment.utc().local().format("L LT");
    }
  } else {
    if (date){
      if (momentDateIsValid(date)){
        return moment(date).format("L LT");
      } else {
        return null;
      }
    } else {
      return moment().format("L LT");
    }
  }
}

export const momentDateToISOFormatConversion = (date) => {
  if (date) {
    return moment(date).format()
  } else {
    return moment().format()
  }
}

export const momentDateToISOFormatConversioniWithFormat = (date, format) => {
  if (date) {
    return moment(date).format(format)
  } else {
    return moment().format(format)
  }

}

export const momentDateIsValid = (date) => {
  return moment(date).isValid()
}

export const secureProtocolImgURL = (url) => {

  if(url && url.match("^http://ecx.images-amazon.com/")) {
   return url.replace("http://ecx.images-amazon.com/","https://images-na.ssl-images-amazon.com/");
  }

  return url;
}

export const logError = (error, data) => {
  LogRocket.captureException(error, data);
}

export const logDebug = (message, data) => {
  LogRocket.captureMessage(message, data);
}

export const convertInToPixels = (data) => {
  const pixels = Math.round(Number(data) * 96, 10);
  return pixels;
}

export function numberFormatterToK(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" },
    { value: 1E12, symbol: "Q" },
    { value: 1E15, symbol: "Q" },
    { value: 1E18, symbol: "S" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export const get_marketplace_mapping = (as_array=false, by_value=null) => {
	const mapping = {
		"A2EUQ1WTGCTBG2":
			{ value: 'CA', label: 'Amazon.ca', flag: "CA", marketplaceID: "A2EUQ1WTGCTBG2" },
		"ATVPDKIKX0DER":
			{ value: 'US', label: 'Amazon.com', flag: "US", marketplaceID: "ATVPDKIKX0DER" },
        "A1F83G8C2ARO7P":
		    { value: 'GB', label: 'Amazon.uk', flag: "GB", marketplaceID: "A1F83G8C2ARO7P" },
	}
	if(as_array){
		const array = Object.keys(mapping).map(function(key){
		    return mapping[key];
		});
		return array;
	}
	if(by_value){
		return mapping[by_value] || null;
	}
	return mapping;
}

export function sanitize_filename(fn, replace_char="", replace_spaces=false){
	const to_remove = ["/", "?", "<", ">", "\\", ":", "*", "|", '"', "'"];
	let res = "";
	to_remove.forEach(r => {
		res = fn.replace(r, replace_char);
	});
	if(replace_spaces){
		res = fn.replace(" ", replace_char);
	}
	return res;
}
