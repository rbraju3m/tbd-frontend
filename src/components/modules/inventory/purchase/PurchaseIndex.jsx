import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _PurchaseTable from "./_PurchaseTable.jsx";

function PurchaseIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const insertType = useSelector((state) => state.crudSlice.insertType)

    const progress = getLoadingProgress()

    // Use the getConfigData hook
    const configData = getConfigData()



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
                                pageTitle={t('ManagePurchase')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData?.zero_stock}
                                currancySymbol={configData?.currency?.symbol}
                            />
                            <Box p={'8'}>
                                <_PurchaseTable
                                    allowZeroPercentage={configData?.zero_stock}
                                    currancySymbol={configData?.currency?.symbol}
                                />
                            </Box>

                        </>
                    }
                </Box>
            }
        </>
    );
}

export default PurchaseIndex;
