import React from 'react';
import PriceTrackersButtonGroup from './PriceTrackersButtonGroup';
import {
  momentDateTimeToLocalFormatConversion,
  digitСonversion
} from '../../../../../helpers/utility';

export class ListingsTableDetail extends React.Component {
    render() {
        const { option, internationalConfig } = this.props;
        const ASIN = option.asin;
        const NAME = option.name;
        return (
            <tr className="child">
            <td className="child" colSpan="7">
                <div className="row">
                <div className="col-md-5">
                    <p>
                        <strong>Min Price:</strong>
                        {digitСonversion(
                            option.minPrice,
                            "currency",
                            internationalConfig.currency_code
                        )}
                    </p>
                    <p>
                        <strong>Max Price:</strong>
                        {digitСonversion(
                            option.maxPrice,
                            "currency",
                            internationalConfig.currency_code
                        )}
                    </p>
                    <p><strong>ShippingTemplate:</strong> {option.shippingTemplate}</p>
                </div>
                <div className="col-md-4">                    
                    <p><strong>Tax Code:</strong> {option.taxCode}</p>
                    <p><strong>Purchased:</strong> {!!option.datePurchased ? momentDateTimeToLocalFormatConversion(option.datePurchased) : 'N/A'}</p>
                    <PriceTrackersButtonGroup
                        ASIN={ASIN}
                        itemName={NAME}
                        amazonUrl={internationalConfig.amazon_url}
                        camelCamelCamelBaseUrl={internationalConfig.camelcamelcamel_url}
                        rootClassName="mt-3"
                    />
                </div>
                <div className="col-md-3">
                    <p className="mb-0"><strong>Notes:</strong></p>
                    <p className="notes">{!!option.note ? option.note : 'N/A'}</p>
                </div>
                </div>                
            </td>
            </tr>
        )
    }
};

export default ListingsTableDetail;
