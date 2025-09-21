import React from "react";
import {Box, Grid, Progress} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuraton/_SalesPurchaseHeaderNavbar.jsx";
import _SalesReturnTable from "./_SalesReturnTable.jsx";
import Navigation from "../common/Navigation.jsx";
export default function SalesReturnIndex() {
    const { t, i18n } = useTranslation();
    const progress = getLoadingProgress()

    // Use the useConfigData hook

    const domainConfigData = JSON.parse(
        localStorage.getItem("domain-config-data")
    );
    let configData = domainConfigData?.inventory_config

  return (
      <>
          {progress !== 100 &&
              <Progress color='var(--theme-primary-color-6)' size={"sm"} striped animated value={progress} transitionDuration={200} />}
          {progress === 100 &&
              <Box>
                  {
                      configData &&
                      <>
                          <_SalesPurchaseHeaderNavbar
                              pageTitle={t('SalesReturn')}
                              roles={t('Roles')}
                              configData={configData}
                              allowZeroPercentage={configData?.zero_stock}
                              currancySymbol={configData?.currency?.symbol}
                          />
                          <Box p={'8'}>
                              <Grid columns={24} gutter={{ base: 8 }}>
                                  <Grid.Col span={1} ><Navigation module={"SalesReturn"}/></Grid.Col>
                                  <Grid.Col span={23} >
                                      <_SalesReturnTable
                                          allowZeroPercentage={configData?.zero_stock}
                                          currancySymbol={configData?.currency?.symbol}
                                          isWarehouse={configData?.sku_warehouse}
                                      />
                                  </Grid.Col>
                              </Grid>

                          </Box>

                      </>
                  }
              </Box>
          }
      </>
  );
}
