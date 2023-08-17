import { Button, Divider, FormControl, Input, Radio, Select, Stack, WarningOutlineIcon } from "native-base";
import { BackHandler, Dimensions, ScrollView, Text, View } from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';

import React, { useContext, useEffect, useRef, useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import Spinner from '../components/Spinner';
import { AuthContext } from '../context/AuthContext';
import { onUpdateLawyerProfileSubmit } from '../redux/slicers/updateLawyerProfileSlicer';
import { callGetCityApi } from '../services/getCityApi';
import { callGetLocalityApi } from '../services/getLocalityApi';
import { callGetStateApi } from '../services/getStateApi';
const { width, height } = Dimensions.get('screen');

import { Controller, useForm } from "react-hook-form";

const getYearList = () => {
    const date = new Date
    const year = date.getFullYear()
    const get_years = []
    for (var i = year; i >= 1950; i--) {
        get_years.push(String(i));
    }

    return get_years
}

const RegisterProfileScreen = ({ navigation }) => {
    const { logout, test } = useContext(AuthContext);
    const dispatch = useDispatch();
    const selectCityDropdownRef = useRef({});
    const selectLocalityDropdownRef = useRef({});

    const [formData, setData] = useState({});
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [localityData, setLocalityData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isNextBtnClick, setIsNextBtnClick] = useState(false);

    const updateProfileInfo = useSelector(state => state.updateLawyerProfileReducer.data);


    const { control, handleSubmit, setValue, getValues, watch, trigger, formState: { isValid, errors } } = useForm({
        defaultValues: {
            fName: '',
            lName: '',
            gender: '',
            email: '',
            password: '',
            barCouncilState: '',
            barCouncilIdNo: '',
            barCouncilYear: '',
            selectedState: '',//
            selectedCity: '',//
            // stateId: '',
            // cityId: '',
            pinCode: '',
            selectedLocality: '',//
        }
    });
    const onSubmit = data => {
        setData({
            ...data,
            ...formData,
        }),
            console.log(data, 'onSubmit---')
    };

    console.log(errors, 'errors--->');

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    useEffect(() => {
        callGetStateApi().then((res) => {
            const newData = res?.state.map((item) => ({ ...item, isSelected: false })) //adding isSelected key into the array
            setStateData(newData)
            // setStateData(res.state)
            // console.log(res,'resssss----')
        })
    }, [])

    useEffect(() => {
        if (formData?.stateId) {
            callGetCityApi({ "state_id": formData.stateId }).then((res) => {
                const newData = res?.city.map((item) => ({ ...item, isSelected: false }))
                setCityData(newData)
                // console.log(res,'resssss----')
            })
        }
    }, [formData?.stateId])

    useEffect(() => {
        setValue("selectedLocality", '')
        selectLocalityDropdownRef.current.reset()
        if (getValues("pinCode").length > 5) {
            trigger("selectedLocality")
            callGetLocalityApi(getValues("pinCode")).then((res) => {
                const newData = res?.location.map((item) => ({ ...item, isSelected: false }))
                setLocalityData(newData)
            })
        }
    }, [watch("pinCode")])


    const submitProfileUpdateFrom = () => {

        const dataSet = {

            "_ptoken": "Development",
            "first_name": formData.fName,
            "last_name": formData.lName,
            "gender": formData.gender,
            "email": getValues("email"),
            "new_password": formData.password,
            "bar_council_no": `${getValues("barCouncilState")}/${getValues("barCouncilIdNo")}/${getValues("barCouncilYear")}`,
            "state_id": formData.stateId,
            "city_id": formData.cityId,
            "zip_id": formData.pinCode,
            "court_id": 0,
            "referrer_id": 0,
        }
        // console.log(dataSet, 'Clicked -->');
        dispatch(onUpdateLawyerProfileSubmit(dataSet))
        setIsLoading(true)
    }


    useEffect(() => {
        console.log(updateProfileInfo, 'updateProfileInfo screen <<< -->');
        if (updateProfileInfo?.success) {
            navigation.navigate('Home')
            setIsLoading(false)
        } else if (updateProfileInfo?.success == false) {
            setIsLoading(false)
        }
    }, [updateProfileInfo])

    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsLoading(false)
    //     }, 10000)
    // }, [isLoading])


    const BarCouncilFormView = () => {
        return (
            <>

                <FormControl.Label mt={5}>Bar Council Id</FormControl.Label>

                <Stack direction="row" mb="2.5" mt="1.5" space={2.5}>

                    <FormControl isRequired isInvalid={'barCouncilState' in errors} w="30%" maxW="300px"  >
                        <FormControl.Label>State</FormControl.Label>

                        {/* <Input value={formData.barCouncilState} maxLength={60} keyboardType='default' variant="underlined" placeholder="WB" onChangeText={value => setData({
                            ...formData,
                            barCouncilState: value
                        })} /> */}
                        <Controller
                            control={control}
                            rules={{
                                required: isNextBtnClick && true,
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
                                required: isNextBtnClick && true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input autoCapitalize='none' value={value} maxLength={60} keyboardType='default' variant="underlined" placeholder="002222" onBlur={onBlur} onChangeText={onChange} />
                            )}
                            name="barCouncilIdNo"
                        />
                        {/* <Input value={formData.barCouncilIdNo} maxLength={60} keyboardType='default' variant="underlined" placeholder="002222" onChangeText={value => setData({
                            ...formData,
                            barCouncilIdNo: value
                        })} /> */}
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            {errors.barCouncilIdNo?.type === 'required' && ` Bar council id no. is required`}
                        </FormControl.ErrorMessage>
                    </FormControl>
                    <Divider bg="muted.800" thickness="2" orientation="vertical" />

                    <FormControl isRequired isReadOnly isInvalid={'barCouncilYear' in errors} w="30%" maxW="300px"  >
                        <FormControl.Label>Year</FormControl.Label>

                        {/* <Input keyboardType='default' variant="underlined" placeholder="002222" onChangeText={value => setData({
                                ...formData,
                                idNo: value
                            })} /> */}

                        <Controller
                            control={control}
                            rules={{
                                required: isNextBtnClick && true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <Select selectedValue={value} minWidth="100" placeholder="Select One" _selectedItem={{
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

            </>
        )
    }

    const handelNextBtnFunc = () => {
        if (!isNextBtnClick) {
            setIsNextBtnClick(true)
        } else if (isNextBtnClick) {
            submitProfileUpdateFrom()
        }
    }

    console.log(isValid, 'isValid--->');
    // console.log(formData,'formData state--->');

    return (
        <>

            <ScrollView style={{ flex: 1, backgroundColor: '#ffffff', marginTop: 10 }}
                showsVerticalScrollIndicator={false}>

                <Text style={{ color: '#4632A1', fontSize: 25, textAlign: 'center' }}>Thank you! Please complete your Registration</Text>

                <View style={{ padding: 40 }}>

                    {/*From input  */}
                    {!isNextBtnClick ? <View style={{ marginTop: 5 }}>


                        <FormControl isRequired isInvalid={'fName' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>First Name</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter First Name" onChangeText={onChange} onBlur={onBlur} />
                                )}
                                name="fName"
                            />
                            {/* <Input value={formData.fName} maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter First Name" onChangeText={value => setData({
                                ...formData,
                                fName: value
                            })} /> */}
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.fName?.type === 'required' && `First name is required`}

                            </FormControl.ErrorMessage>

                        </FormControl>

                        <FormControl isRequired mt={5} isInvalid={'lName' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Last Name</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter Last Name" onBlur={onBlur} onChangeText={onChange} />

                                )}
                                name="lName"
                            />
                            {/* <Input value={formData.lName} maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter Last Name" onChangeText={value => setData({
                                        ...formData,
                                        lName: value
                                    })} /> */}
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.lName?.type === 'required' && `Last name is required`}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isRequired mt={5} isInvalid={'gender' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Gender</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Radio.Group name="myRadioGroup" accessibilityLabel="Gender" value={value} onChange={nextValue => {
                                        setValue("gender", nextValue)
                                        trigger("gender")
                                    }} style={{ display: "flex", flexDirection: "row", justifyContent: 'space-evenly' }}>
                                        <Radio value="M" my={1}>
                                            Male
                                        </Radio>
                                        <Radio value="F" my={1}>
                                            Female
                                        </Radio>
                                        <Radio value="O" my={1}>
                                            Others
                                        </Radio>
                                    </Radio.Group>
                                )}
                                name="gender"
                            />

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.gender?.type === 'required' && `Gender is required`}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isRequired mt={5} isInvalid={'email' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Email</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input autoCapitalize='none' value={value} maxLength={100} keyboardType='email-address' variant="underlined" placeholder="Enter Email" onBlur={onBlur} onChangeText={onChange} />
                                )}
                                name="email"
                            />
                            {/* <Input value={formData.email} maxLength={100} keyboardType='email-address' variant="underlined" placeholder="Enter Email" onChangeText={value => setData({
                                ...formData,
                                email: value
                            })} /> */}
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.email?.type === 'required' && `Email is required`}
                                {errors.email?.type === 'pattern' && `Please enter valid email`}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isRequired mt={5} isInvalid={'password' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Password</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={30} type={"password"} keyboardType='default' variant="underlined" placeholder="Enter Password" onBlur={onBlur} onChangeText={onChange} />
                                )}
                                name="password"
                            />
                            {/* <Input value={formData.password} maxLength={30} type={"password"} keyboardType='default' variant="underlined" placeholder="Enter Password" onChangeText={value => setData({
                                ...formData,
                                password: value
                            })} /> */}
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.password?.type === 'required' && `Password is required`}
                                {errors.password?.type === 'pattern' && `Password should be minimum 8 characters with at least a symbol, upper and lower case letters and a number`}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isRequired isReadOnly mt={5} isInvalid={'selectedState' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>State</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <SelectDropdown
                                        data={stateData}
                                        onBlur={onBlur}
                                        onSelect={(selectedItem, index) => {
                                            console.log(selectedItem, index)
                                            setValue("selectedState", selectedItem?.name)
                                            setValue("selectedCity", '')
                                            selectCityDropdownRef.current.reset()
                                            trigger(["selectedState", "selectedCity"])
                                            setData({
                                                ...formData,
                                                stateId: selectedItem.id,
                                                // selectedState: item.name,
                                                cityId: '',
                                                // selectedCity: ''
                                            })
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
                                        defaultButtonText={getValues("selectedState") || 'Select State'}
                                        search
                                        renderSearchInputLeftIcon={() => {
                                            return <AIcon name={`search1`} size={22} color='gray' />
                                        }}
                                    />
                                )}
                                name="selectedState"
                            />

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.selectedState?.type === 'required' && `State is required`}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isRequired isReadOnly mt={5} isInvalid={'selectedCity' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>City</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <SelectDropdown
                                        data={cityData}
                                        ref={selectCityDropdownRef}
                                        onBlur={onBlur}
                                        onSelect={(selectedItem, index) => {
                                            console.log(selectedItem, index)
                                            setValue("selectedCity", selectedItem?.name)
                                            trigger("selectedCity")
                                            setData({
                                                ...formData,
                                                cityId: selectedItem.id,
                                                // selectedCity: item.name,
                                            })
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem?.name
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item?.name
                                        }}
                                        renderDropdownIcon={isOpened => {
                                            return <AIcon name={isOpened ? 'up' : `down`} size={21} color='gray' />
                                        }}
                                        dropdownIconPosition={'right'}
                                        defaultButtonText={getValues("selectedCity") || 'Select City'}
                                        search
                                        renderSearchInputLeftIcon={() => {
                                            return <AIcon name={`search1`} size={22} color='gray' />
                                        }}
                                    />
                                )}
                                name="selectedCity"
                            />

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.selectedCity?.type === 'required' && `City is required`}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isRequired mt={5} isInvalid={'pinCode' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Pin Code</FormControl.Label>

                            {/* <Input value={formData.pinCode} maxLength={6} keyboardType='number-pad' variant="underlined" placeholder="Enter Pin Code" onChangeText={value => setData({
                                ...formData,
                                pinCode: value,
                                localityId: '',
                                selectedLocality: ''
                            })} /> */}
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input autoCapitalize='none' value={value} maxLength={6} keyboardType='number-pad' variant="underlined" placeholder="Enter Pin Code" onBlur={onBlur} onChangeText={onChange} />
                                )}
                                name="pinCode"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.pinCode?.type === 'required' && `PinCode is required`}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isRequired isReadOnly mt={5} isInvalid={'selectedLocality' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Locality</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <SelectDropdown
                                        data={localityData}
                                        ref={selectLocalityDropdownRef}
                                        onBlur={onBlur}
                                        onSelect={(selectedItem, index) => {
                                            console.log(selectedItem, index)
                                            setValue("selectedLocality", selectedItem?.name)
                                            trigger("selectedLocality")
                                            setData({
                                                ...formData,
                                                localityId: selectedItem.id,
                                                // selectedLocality: item.name,
                                            })
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem?.name
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item?.name
                                        }}
                                        renderDropdownIcon={isOpened => {
                                            return <AIcon name={isOpened ? 'up' : `down`} size={21} color='gray' />
                                        }}
                                        dropdownIconPosition={'right'}
                                        defaultButtonText={getValues("selectedLocality") || 'Select Locality'}
                                        search
                                        renderSearchInputLeftIcon={() => {
                                            return <AIcon name={`search1`} size={22} color='gray' />
                                        }}
                                    />
                                )}
                                name="selectedLocality"
                            />

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.selectedLocality?.type === 'required' && `Locality is required`}

                            </FormControl.ErrorMessage>
                        </FormControl>



                    </View>


                        : BarCouncilFormView()
                    }

                    {updateProfileInfo?.success == false && <Text style={{ color: 'red', marginTop: 15 }}>{updateProfileInfo?.message}</Text>}

                    {/*Register Profile button*/}
                    <View style={{ marginTop: 80, display: 'flex', flexDirection: 'row', justifyContent: isNextBtnClick ? 'space-between' : 'center', marginBottom: 17 }}>
                        {isNextBtnClick && <Button isDisabled={false} onPress={() => { setIsNextBtnClick(false) }} rounded={20} style={{ shadowColor: '#00acee', alignSelf: 'center', backgroundColor: '#4632A1', width: width / 3 }}>
                            <Text style={{ color: '#fff', }}>Back</Text>
                        </Button>}
                        <Button isDisabled={false} onPress={handleSubmit((d) => { onSubmit(d), handelNextBtnFunc(), console.log(d, '___124**') })} rounded={20} style={{ shadowColor: '#00acee', alignSelf: 'center', backgroundColor: '#4632A1', width: width / 3 }}>
                            <Text style={{ color: '#fff', }}>{isNextBtnClick ? 'Submit' : 'Next'}</Text>
                        </Button>
                    </View>


                    <Text onPress={() => logout()} style={{ fontWeight: 'bold', marginTop: 10, color: '#ff6600', fontSize: 19, textAlign: 'center' }}>  {`Logout >`} </Text>
                </View>


            </ScrollView>


            <Spinner visible={isLoading} />
        </>
    )
}

export default RegisterProfileScreen