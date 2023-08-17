import { Box, Button, Divider, FormControl, Input, Select, Stack, Text, WarningOutlineIcon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import AIcon from 'react-native-vector-icons/AntDesign';
import ProfileInfoUpdateModal from '../../components/ProfileInfoUpdateModal';
import { callGetStateApi } from '../../services/getStateApi';

const getYearList = () => {
    const date = new Date
    const year = date.getFullYear()
    const get_years = []
    for (var i = year; i >= 1950; i--) {
        get_years.push(String(i));
    }

    return get_years
}

const BarCouncilInfo = ({ lawyers }) => {

    const [barCouncilInfoEditModal, setBarCouncilInfoEditModal] = useState(false);
    const [practiceCourtData, setPracticeCourtData] = useState([]);


    const { control, handleSubmit, setValue, getValues, watch, trigger, formState: { isValid, errors } } = useForm({
        defaultValues: {

            barCouncilState: '',
            barCouncilIdNo: '',
            barCouncilYear: '',
            selectedState: '',//
            selectedBarAssociation: '',//
            selectedPracticeCourt: '',//

        }
    });

    useEffect(() => {
        callGetStateApi().then((res) => {
            const newData = res?.state.map((item) => ({ ...item, isSelected: false })) //adding isSelected key into the array
            setPracticeCourtData(newData)
            // console.log(res,'resssss----')
        })
    }, [])


    return (
        <>
            <View style={{ display: 'flex', alignSelf: 'flex-end', paddingRight: 15, marginBottom: 10 }} >

                <Text
                    fontSize="md" _light={{
                        color: "violet.500"
                    }} _dark={{
                        color: "violet.400"
                    }} fontWeight="extrabold" ml="-0.5" mt="-1" onPress={() => { setBarCouncilInfoEditModal(true) }}>
                    Edit
                </Text>
            </View>

            {/* <Heading size="md" ml="-1" mb={2}>
                lawyers?.client_name
            </Heading> */}
            <Text fontSize="sm" style={{ marginBottom: 10, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Your Bar Council Registration Number:   {"\n"}<Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyers?.bar_council_id} </Text>
            </Text>

            <Text s fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                State Bar Council: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyers?.bar_council_state} </Text>
            </Text>
            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Name Of Bar Association: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyers?.bar_association_name} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Bar Council Certificate Or ID Card: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyers?.bar_council_certificate_Id} </Text>
            </Text>


            <ProfileInfoUpdateModal isOpen={barCouncilInfoEditModal} mHeader={'Schedule Availability'} onClose={() => { setBarCouncilInfoEditModal(false) }} submitBtnText={'Set Schedule'}
                onSubmitPress={() => { setBarCouncilInfoEditModal(false) }}
                mBody={
                    <>

                        <Box padding={5} marginY={5} maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                            borderColor: "coolGray.600",
                            backgroundColor: "gray.700"
                        }} _web={{
                            shadow: 2,
                            borderWidth: 0
                        }} _light={{
                            backgroundColor: "gray.50"
                        }}>


                            <Stack direction="row" mb="2.5" mt="1.5" space={2}>

                                <FormControl isRequired isInvalid={'barCouncilState' in errors} w="30%" maxW="300px"  >
                                    <FormControl.Label>State</FormControl.Label>


                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input autoCapitalize='none' value={value} maxLength={60} keyboardType='default' variant="underlined" placeholder="WB" onBlur={onBlur} onChangeText={onChange} />
                                        )}
                                        name="barCouncilState"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errors.barCouncilState?.type === 'required' && ` Bar council state is required`}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <Divider bg="muted.800" thickness="2" orientation="vertical" />

                                <FormControl isRequired isInvalid={'barCouncilIdNo' in errors} w="30%" maxW="300px"  >
                                    <FormControl.Label>ID No.</FormControl.Label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input autoCapitalize='none' value={value} maxLength={60} keyboardType='default' variant="underlined" placeholder="002222" onBlur={onBlur} onChangeText={onChange} />
                                        )}
                                        name="barCouncilIdNo"
                                    />

                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errors.barCouncilIdNo?.type === 'required' && ` Bar council id no. is required`}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <Divider bg="muted.800" thickness="2" orientation="vertical" />

                                <FormControl isRequired isReadOnly isInvalid={'barCouncilYear' in errors} w="30%" maxW="300px"  >
                                    <FormControl.Label>Year</FormControl.Label>


                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (

                                            <Select selectedValue={value} placeholder="Select One" _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <AIcon name={`down`} size={15} color='#fff' />
                                            }} mt={1} onValueChange={itemValue => { setValue("barCouncilYear", itemValue), trigger("barCouncilYear") }}
                                            // onValueChange={itemValue => setData({
                                            //     ...formData,
                                            //     barCouncilYear: itemValue
                                            // })} 
                                            >
                                                {getYearList().map((x, i) => {
                                                    return (
                                                        <Select.Item
                                                            key={i}
                                                            label={x}
                                                            value={x}
                                                        />
                                                    )
                                                })}
                                                {/* <Select.Item label="2022" value="2022" /> */}
                                            </Select>

                                        )}
                                        name="barCouncilYear"
                                    />

                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {errors.barCouncilYear?.type === 'required' && `Bar council year is required`}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </Stack>


                            <FormControl isRequired isInvalid={'selectedState' in errors} w="100%" maxW="300px"  >
                                <FormControl.Label>State Bar Council</FormControl.Label>

                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (

                                        <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Please Enter State Bar Council " onChangeText={onChange} onBlur={onBlur} />
                                    )}
                                    name="selectedState"
                                />

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.selectedState?.type === 'required' && `State Bar Council is required`}

                                </FormControl.ErrorMessage>

                            </FormControl>

                            <FormControl isRequired isInvalid={'selectedBarAssociation' in errors} w="100%" maxW="300px"  >
                                <FormControl.Label>Name of Bar Association</FormControl.Label>

                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (

                                        <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Please Enter State Bar Council " onChangeText={onChange} onBlur={onBlur} />
                                    )}
                                    name="selectedBarAssociation"
                                />

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.selectedBarAssociation?.type === 'required' && ` Bar Association is required`}

                                </FormControl.ErrorMessage>

                            </FormControl>


                            <FormControl isRequired isInvalid={'selectedPracticeCourt' in errors} w="100%" maxW="300px"  >
                                <FormControl.Label>Practice Courts</FormControl.Label>

                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (

                                        <SelectDropdown
                                            data={practiceCourtData}
                                            onBlur={onBlur}
                                            onSelect={(selectedItem, index) => {
                                                console.log(selectedItem, index)
                                                setValue("selectedPracticeCourt", selectedItem?.name)
                                                trigger(["selectedPracticeCourt"])

                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                return selectedItem?.name
                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item?.name
                                            }}
                                            renderDropdownIcon={isOpened => {
                                                return <AIcon name={isOpened ? 'up' : `down`} size={21} color='gray' />
                                            }}
                                            dropdownIconPosition={'right'}
                                            defaultButtonText={getValues("selectedPracticeCourt") || 'Select State'}
                                            search
                                            renderSearchInputLeftIcon={() => {
                                                return <AIcon name={`search1`} size={22} color='gray' />
                                            }}
                                        />

                                    )}
                                    name="selectedPracticeCourt"
                                />

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.selectedPracticeCourt?.type === 'required' && `Practice Court is required`}

                                </FormControl.ErrorMessage>

                            </FormControl>




                            <Button
                                style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', backgroundColor:'orange', marginTop:15 }]}
                                onPress={() => { }}
                            >
                                Update
                            </Button>

                        </Box>
                    </>
                }
            />

        </>
    )
}

export default BarCouncilInfo