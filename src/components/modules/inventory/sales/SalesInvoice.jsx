import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";
import _WholeSaleGenericInvoiceForm from "./whole-sale/_GenericInvoiceForm.jsx";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _GenericPosForm from "./_GenericPosForm";
import __GenericPosSalesForm from "./__GenericPosSalesForm";

function SalesInvoice() {

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)
    const progress = getLoadingProgress()
    const {configData,fetchData} = getConfigData()
    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"sm"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {
                        configData &&
                        <>
                            <_SalesPurchaseHeaderNavbar
                                pageTitle={t('SalesInvoice')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData?.zero_stock}
                                currencySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                {
                                    insertType === 'create' && configData?.business_model?.slug === 'general' &&
                                    <_GenericPosForm
                                        allowZeroPercentage={configData?.zero_stock}
                                        currencySymbol={configData?.currency?.symbol}
                                        domainId={configData?.domain_id}
                                        isSMSActive={configData?.is_active_sms}
                                        isZeroReceiveAllow={configData?.is_zero_receive_allow}
                                        isWarehouse={configData?.sku_warehouse}
                                    />
                                }
                                {
                                    insertType === 'create' && configData?.business_model?.slug === 'distribution' &&
                                    <_WholeSaleGenericInvoiceForm
                                        allowZeroPercentage={configData?.zero_stock}
                                        currencySymbol={configData?.currency?.symbol}
                                        domainId={configData?.domain_id}
                                        isSMSActive={configData?.is_active_sms}
                                        isZeroReceiveAllow={configData?.is_zero_receive_allow}
                                    />
                                }
                            </Box>
                        </>
                    }

                </Box>
            }
        </>
    );
}

export default SalesInvoice;
