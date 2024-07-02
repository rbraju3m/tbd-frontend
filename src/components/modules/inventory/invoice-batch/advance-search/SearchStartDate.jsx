import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    rem,
    Grid, Tooltip, TextInput, ActionIcon, Select, Button, Flex, Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconBrandOkRu, IconFileTypeXls,
    IconFilter,
    IconInfoCircle, IconPdf,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../../../../store/core/crudSlice.js";
import FilterModel from "../../../filter/FilterModel.jsx";
import { setFetching, setInvoiceBatchFilterData, storeEntityData } from "../../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";


function SearchStartDate(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { isOnline } = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [customerTooltip, setCustomerTooltip] = useState(false)
    const [startDateTooltip, setStartDateTooltip] = useState(false)
    const [endDateTooltip, setEndDateTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const invoiceBatchFilterData = useSelector((state) => state.inventoryCrudSlice.invoiceBatchFilterData)

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
    const [customersDropdownData, setCustomersDropdownData] = useState([])
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false)

    useEffect(() => {
        let coreCustomers = localStorage.getItem('core-customers');
        coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : []
        if (coreCustomers && coreCustomers.length > 0) {
            const transformedData = coreCustomers.map(type => {
                return ({ 'label': type.mobile + ' -- ' + type.name, 'value': String(type.id) })
            });
            setCustomersDropdownData(transformedData);
            setRefreshCustomerDropdown(false)
        }
    }, [refreshCustomerDropdown])
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

    let [resetKey, setResetKey] = useState(0);

    const resetDropDownState = () => setResetKey(prevKey => prevKey + 1);

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );


    return (
        <>
            <Box>
                <Tooltip
                    label={t('StartDate')}
                    opened={startDateTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color="red"
                    withArrow
                    offset={2}
                    zIndex={100}
                    transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
                >
                    <DateInput
                        clearable
                        onChange={(e) => {
                            dispatch(setInvoiceBatchFilterData({ ...invoiceBatchFilterData, ['start_date']: e }))
                            e !== '' ?
                                setStartDateTooltip(false) :
                                (setStartDateTooltip(true),
                                    setTimeout(() => {
                                        setStartDateTooltip(false)
                                    }, 1000))
                        }}
                        value={invoiceBatchFilterData.start_date}
                        placeholder={t('StartDate')}
                    />
                </Tooltip>
            </Box>
        </>
    );
}

export default SearchStartDate;