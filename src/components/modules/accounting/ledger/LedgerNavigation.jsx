import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLoadingProgress} from "../../../global-hook/loading-progress/getLoadingProgress";
import {
    Progress,
    Box,
    Grid,
    Table, Text, ScrollArea,Accordion,NavLink
} from "@mantine/core";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import {IconChevronRight, IconGauge, IconHome2, IconShoppingBagDiscount,IconScale,IconBuildingFactory,IconReportMoney,IconShoppingCart,IconArchive,IconReport} from "@tabler/icons-react";

export default function LedgerNavigation(props) {
    const progress = getLoadingProgress();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight-48;
    const entries = Object.entries(props.grouped);
    return (
        <>
            <Box className={"boxBackground borderRadiusAll"}>
                <Text pt={'xs'} pl={'md'} pb={'xs'}>{t("ManageReports")}</Text>
            </Box>
            <ScrollArea h={height}
                scrollbarSize={2}
                scrollbars="y"
                type="never"
                bg={'white'}>
                <Box ml={'4'} mr={'4'} mt={'4'}>
                    <Accordion
                        chevronIconSize={20}
                        variant="default"
                        defaultValue="item-0"
                        transitionDuration={1000}
                    >
                        {entries.map(([groupName, children], index) => {
                           // const Icon = getGroupIcon(groupName);

                            return (
                                <Accordion.Item key={groupName} value={`item-${index}`}>
                                    <Accordion.Control

                                    >
                                        {t(groupName)}
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        {children.map((item) => (
                                            <NavLink
                                                key={item.id}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setLedgerDetails(item)
                                                }}
                                                label={item.name}/>
                                                    ))}
                                            </Accordion.Panel>
                                            </Accordion.Item>
                                            );
                                            })}
                    </Accordion>

                </Box>
            </ScrollArea>
        </>
    );
}
