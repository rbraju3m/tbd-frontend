import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Text, Title, Alert, List, Stack, Tooltip, ActionIcon,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconPercentage, IconPlusMinus, IconUsersGroup
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { setEntityNewData, setFetching, setValidationData, storeEntityData } from "../../../../store/core/crudSlice.js";

import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import CustomerGroupDrawer from "./CustomerGroupDrawer.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";


function CustomerForm(props) {
    const { locationDropdown, customerGroupDropdownData, executiveDropdown } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);

    const form = useForm({
        initialValues: {
            name: '',
            customer_group_id: '',
            credit_limit: '',
            reference_id: '',
            mobile: '',
            alternative_mobile: '',
            email: '',
            location_id: '',
            marketing_id: '',
            address: '',
            discount_percent : ''
        },
        validate: {
            name: hasLength({ min: 2, max: 20 }),
            customer_group_id : isNotEmpty(),
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
                // if (!/^\d{13}$/.test(value)) return t('MobileValidationDigitCount');
                // return null;
            },
            email: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return true;
                }
                return null;
            },
            credit_limit: (value) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
            discount_percent : (value) => {
                if (value) {
                    const validFormat = /^(?:[0-9]|[1-9][0-9])(\.\d{1,2})?$/.test(value);
                    if (!validFormat) {
                        return true;
                    }
                }
                return null;
            }
        }
    });

    const [groupDrawer, setGroupDrawer] = useState(false)

    useHotkeys([['alt+n', () => {
        !groupDrawer && document.getElementById('customer_group_id').click()
    }]], []);


    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        !groupDrawer && document.getElementById('EntityFormSubmit').click()
    }]], []);

    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => { 
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        // console.log(values)
                        const value = {
                            url: 'core/customer',
                            data: values
                        }
                        dispatch(storeEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });
                        setTimeout(() => {
                            customerDataStoreIntoLocalStorage()
                            form.reset()
                            setMarketingExeData(null)
                            setCustomerGroupData(null)
                            setLocationData(null)
                            dispatch(setEntityNewData([]))
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Grid columns={9} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box bg={"white"} >
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('CreateCustomer')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        !saveCreateLoading && isOnline &&
                                                        <Button
                                                            size="xs"
                                                            className={'btnPrimaryBg'}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16} />}>
                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}> {t("CreateAndSave")}</Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </>
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box>
                                            <Box>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={11} >
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('ChooseCustomerGroup')}
                                                                label={t('CustomerGroup')}
                                                                placeholder={t('ChooseCustomerGroup')}
                                                                required={true}
                                                                nextField={'name'}
                                                                name={'customer_group_id'}
                                                                form={form}
                                                                dropdownValue={customerGroupDropdownData}
                                                                mt={8}
                                                                id={'customer_group_id'}
                                                                searchable={false}
                                                                value={customerGroupData}
                                                                changeValue={setCustomerGroupData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{ crossAxis: '-110', mainAxis: '5' }}
                                                                withArrow
                                                                transitionProps={{ duration: 200 }}
                                                                label={t('QuickCustomerGroup')}
                                                            >
                                                                <ActionIcon variant="outline" bg={'white'} size={'lg'} color="red.5" mt={'1'} aria-label="Settings" onClick={() => {
                                                                    setGroupDrawer(true)
                                                                }}>
                                                                    <IconUsersGroup style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>

                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('NameValidateMessage')}
                                                    label={t('Name')}
                                                    placeholder={t('Name')}
                                                    required={true}
                                                    nextField={'mobile'}
                                                    name={'name'}
                                                    form={form}
                                                    mt={0}
                                                    id={'name'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6} >
                                                        <Box>
                                                            <PhoneNumber
                                                                tooltip={form.errors.mobile ? form.errors.mobile : t('MobileValidateMessage')}
                                                                label={t('Mobile')}
                                                                placeholder={t('Mobile')}
                                                                required={true}
                                                                nextField={'alternative_mobile'}
                                                                name={'mobile'}
                                                                form={form}
                                                                mt={8}
                                                                id={'mobile'} />

                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Box>
                                                            <PhoneNumber
                                                                tooltip={form.errors.alternative_mobile ? form.errors.alternative_mobile : t('MobileValidateMessage')}
                                                                label={t('AlternativeMobile')}
                                                                placeholder={t('AlternativeMobile')}
                                                                required={false}
                                                                nextField={'email'}
                                                                name={'alternative_mobile'}
                                                                form={form}
                                                                mt={8}
                                                                id={'alternative_mobile'}
                                                            />
                                                        </Box>

                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    tooltip={t('InvalidEmail')}
                                                    label={t('Email')}
                                                    placeholder={t('Email')}
                                                    required={false}
                                                    nextField={'discount_percent'}
                                                    name={'email'}
                                                    form={form}
                                                    mt={8}
                                                    id={'email'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <InputForm
                                                    type={'number'}
                                                    leftSection={(
                                                        <IconPercentage size={16} opacity={0.5} />
                                                    )}
                                                    tooltip={t('DiscountPercentValidateMessage')}
                                                    label={t('DiscountPercent')}
                                                    placeholder={t('DiscountPercent')}
                                                    required={false}
                                                    nextField={'credit_limit'}
                                                    name={'discount_percent'}
                                                    form={form}
                                                    mt={8}
                                                    id={'discount_percent'}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 6 }}>
                                                    <Grid.Col span={6} >
                                                        <Box >
                                                            <InputForm
                                                                type={'number'}
                                                                leftSection={(
                                                                    <IconPlusMinus size={16} opacity={0.5} />
                                                                )}
                                                                tooltip={t('CreditLimitValidationMessage')}
                                                                label={t('CreditLimit')}
                                                                placeholder={t('CreditLimit')}
                                                                required={false}
                                                                nextField={'reference_id'}
                                                                name={'credit_limit'}
                                                                form={form}
                                                                mt={8}
                                                                id={'credit_limit'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Box>
                                                            <InputForm
                                                                tooltip={t('OLDReferenceNoValidateMessage')}
                                                                label={t('OLDReferenceNo')}
                                                                placeholder={t('OLDReferenceNo')}
                                                                required={false}
                                                                nextField={'location_id'}
                                                                name={'reference_id'}
                                                                form={form}
                                                                mt={8}
                                                                id={'reference_id'}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('Location')}
                                                    label={t('Location')}
                                                    placeholder={t('ChooseLocation')}
                                                    required={false}
                                                    nextField={'marketing_id'}
                                                    name={'location_id'}
                                                    id={'location_id'}
                                                    form={form}
                                                    dropdownValue={locationDropdown}
                                                    mt={8}
                                                    searchable={true}
                                                    value={locationData}
                                                    changeValue={setLocationData}
                                                />
                                            </Box>
                                            <Box mt={'xs'}>
                                                <SelectForm
                                                    tooltip={t('MarketingExecutive')}
                                                    label={t('MarketingExecutive')}
                                                    placeholder={t('ChooseMarketingExecutive')}
                                                    required={false}
                                                    nextField={'address'}
                                                    name={'marketing_id'}
                                                    form={form}
                                                    dropdownValue={executiveDropdown}
                                                    id={'marketing_id'}
                                                    searchable={true}
                                                    value={marketingExeData}
                                                    changeValue={setMarketingExeData}
                                                />
                                            </Box>
                                            <Box mt={'xs'} mb={'xs'}>
                                                <TextAreaForm
                                                    tooltip={t('AddressValidateMessage')}
                                                    label={t('Address')}
                                                    placeholder={t('Address')}
                                                    required={false}
                                                    nextField={'EntityFormSubmit'}
                                                    name={'address'}
                                                    form={form}
                                                    mt={8}
                                                    id={'address'}
                                                />
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1} >
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'customer_group_id'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
            {groupDrawer &&
                <CustomerGroupDrawer groupDrawer={groupDrawer} setGroupDrawer={setGroupDrawer} saveId={'EntityDrawerSubmit'} />
            }
        </Box>
    );
}

export default CustomerForm;