import { View, Text, ScrollView, Dimensions, BackHandler, FlatList } from 'react-native'
import { Box, Button, CheckIcon, Divider, FormControl, HStack, Heading, Icon, Input, Modal, Radio, Select, Spacer, Stack, VStack, WarningOutlineIcon } from "native-base";
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import { useDispatch, useSelector } from 'react-redux';

import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { callGetStateApi } from '../services/getStateApi';
import { callGetCityApi } from '../services/getCityApi';
import { callGetLocalityApi } from '../services/getLocalityApi';
import { onUpdateLawyerProfileSubmit } from '../redux/slicers/updateLawyerProfileSlicer';
import Spinner from '../components/Spinner';
import { TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('screen');

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

    const [formData, setData] = useState({});
    const [gender, setGender] = useState();
    const [errors, setErrors] = useState({});
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [localityData, setLocalityData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [showLocalityModal, setShowLocalityModal] = useState(false);
    const [searchText, setSearchText] = useState("");

    const updateProfileInfo = useSelector(state => state.updateLawyerProfileReducer.data);

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
        if (formData?.pinCode?.length > 5) {
            callGetLocalityApi(formData?.pinCode).then((res) => {
                const newData = res?.location.map((item) => ({ ...item, isSelected: false }))
                setLocalityData(newData)
                // console.log(res,'resssss----')
            })
        }
    }, [formData?.pinCode])


    const submitProfileUpdateFrom = () => {

        const dataSet = {

            "_ptoken": "Development",
            "first_name": formData.fName,
            "last_name": formData.lName,
            "gender": gender,
            "email": formData.email,
            "new_password": formData.password,
            "bar_council_no": `${formData.barCouncilState}/${formData.barCouncilIdNo}/${formData.barCouncilYear}`,
            "state_id": formData.stateId,
            "city_id": formData.cityId,
            "zip_id": formData.pinCode,
            "court_id": 0,
            "referrer_id": 0,
        }
        // console.log(dataSet,'Clicked -->');
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

    const onSelectFlatListItem = (dataSet, itemId) => {
        const tempData = [];
        dataSet.map((item, index) => {
            if (item.id == itemId) {
                tempData.push({ ...item, isSelected: true })
            } else {
                tempData.push({ ...item, isSelected: false })
            }

        });
        return tempData
    }

    const validateFromInput = () => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/; //8 letter password, with at least a symbol, upper and lower case letters and a number


        if (formData.fName === undefined) {
            setErrors({
                ...errors,
                fName: 'First name is required',
            });
            return false;
        }
        if (formData.lName === undefined) {
            setErrors({
                ...errors,
                lName: 'Last name is required',
            });
            return false;
        }

        if (gender === undefined) {
            setErrors({
                ...errors,
                gender: 'Gender is required',
            });
            return false;
        }

        if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: 'Email is required',
            });
            return false;
        }  else if (emailRegex.test(formData.email) === false) {
            setErrors({
                ...errors,
                email: 'Please enter valid email',
            });
            return false;
        }

        if (formData.password === undefined) {
            setErrors({
                ...errors,
                password: 'Password is required',
            });
            return false;
        } else if (passwordRegex.test(formData.password) === false) {
            setErrors({
                ...errors,
                password: 'Password should be minimum 8 characters with at least a symbol, upper and lower case letters and a number',
            });
            return false;
        }

        if (formData.barCouncilState === undefined) {
            setErrors({
                ...errors,
                barCouncilState: 'Bar council state is required',
            });
            return false;
        }

        if (formData.barCouncilIdNo === undefined) {
            setErrors({
                ...errors,
                barCouncilIdNo: 'Bar council id no is required',
            });
            return false;
        }

        if (formData.barCouncilYear === undefined) {
            setErrors({
                ...errors,
                barCouncilYear: 'Bar council year is required',
            });
            return false;
        }

        if (formData.selectedState === undefined) {
            setErrors({
                ...errors,
                selectedState: 'State is required',
            });
            return false;
        }

        if (formData.selectedCity === '') {
            setErrors({
                ...errors,
                selectedCity: 'City is required',
            });
            return false;
        }
        if (formData.pinCode === undefined) {
            setErrors({
                ...errors,
                pinCode: 'Pin Code is required',
            });
            return false;
        }

        if (formData.selectedLocality === '') {
            setErrors({
                ...errors,
                selectedLocality: 'Locality is required',
            });
            return false;
        }

        return true;
    }

    return (
        <>

            <ScrollView style={{ flex: 1, backgroundColor: '#ffffff', marginTop: 10 }}
                showsVerticalScrollIndicator={false}>

                <Text style={{ color: '#4632A1', fontSize: 25, textAlign: 'center' }}>Thank you! Please complete your Registration</Text>

                <View style={{ padding: 40 }}>

                    {/*From input  */}
                    <View style={{ marginTop: 5 }}>


                        <FormControl isInvalid={'fName' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>First Name</FormControl.Label>

                            <Input maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter First Name" onChangeText={value => setData({
                                ...formData,
                                fName: value
                            })} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.fName}
                            </FormControl.ErrorMessage>

                        </FormControl>

                        <FormControl mt={5} isInvalid={'lName' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Last Name</FormControl.Label>

                            <Input maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter Last Name" onChangeText={value => setData({
                                ...formData,
                                lName: value
                            })} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.lName}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl mt={5} isInvalid={'gender' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Gender</FormControl.Label>

                            <Radio.Group name="myRadioGroup" accessibilityLabel="Gender" value={gender} onChange={nextValue => {
                                setGender(nextValue)
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

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.gender}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl mt={5} isInvalid={'email' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Email</FormControl.Label>

                            <Input maxLength={100} keyboardType='email-address' variant="underlined" placeholder="Enter Email" onChangeText={value => setData({
                                ...formData,
                                email: value
                            })} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.email}
                            </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl mt={5} isInvalid={'password' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Password</FormControl.Label>

                            <Input maxLength={30} type={"password"} keyboardType='default' variant="underlined" placeholder="Enter Password" onChangeText={value => setData({
                                ...formData,
                                password: value
                            })} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.password}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl.Label mt={5}>Bar Council Id</FormControl.Label>

                        <Stack direction="row" mb="2.5" mt="1.5" space={2.5}>

                            <FormControl isInvalid={'barCouncilState' in errors} w="30%" maxW="300px"  >
                                <FormControl.Label>State</FormControl.Label>

                                <Input maxLength={60} keyboardType='default' variant="underlined" placeholder="WB" onChangeText={value => setData({
                                    ...formData,
                                    barCouncilState: value
                                })} />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.barCouncilState}
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <Divider bg="muted.800" thickness="2" orientation="vertical" />

                            <FormControl isInvalid={'barCouncilIdNo' in errors} w="30%" maxW="300px"  >
                                <FormControl.Label>ID No.</FormControl.Label>

                                <Input maxLength={60} keyboardType='default' variant="underlined" placeholder="002222" onChangeText={value => setData({
                                    ...formData,
                                    barCouncilIdNo: value
                                })} />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.barCouncilIdNo}
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <Divider bg="muted.800" thickness="2" orientation="vertical" />

                            <FormControl isReadOnly isInvalid={'barCouncilYear' in errors} w="30%" maxW="300px"  >
                                <FormControl.Label>Year</FormControl.Label>

                                {/* <Input keyboardType='default' variant="underlined" placeholder="002222" onChangeText={value => setData({
                                ...formData,
                                idNo: value
                            })} /> */}
                                <Select selectedValue={formData.barCouncilYear} minWidth="100" placeholder="Select One" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <AIcon name={`down`} size={15} color='#fff' />
                                    // }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                                }} mt={1} onValueChange={itemValue => setData({
                                    ...formData,
                                    barCouncilYear: itemValue
                                })} >
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

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.barCouncilYear}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Stack>


                        <FormControl isReadOnly mt={5} isInvalid={'selectedState' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>State</FormControl.Label>

                            <Button variant="outline" _text={{ color: "gray.400" }} endIcon={<AIcon name={`down`} size={21} color='gray' />} onPress={() => setShowStateModal(true)}>{formData?.selectedState || 'Select State'}</Button>

                            {/* <Select selectedValue={formData.stateId} minWidth="100" placeholder="Select State" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <AIcon name={`down`} size={15} color='#fff' />
                                // }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                            }} mt={1} onValueChange={itemValue => setData({
                                ...formData,
                                stateId: itemValue
                            })} >
                                {stateData.map(x => {
                                    return (
                                        <Select.Item
                                            key={x.id}
                                            label={x.name}
                                            value={x.id}
                                        />
                                    );
                                })}
                            </Select> */}

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.selectedState}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isReadOnly mt={5} isInvalid={'selectedCity' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>City</FormControl.Label>

                            <Button variant="outline" _text={{ color: "gray.400" }} endIcon={<AIcon name={`down`} size={21} color='gray' />} onPress={() => setShowCityModal(true)}>{formData?.selectedCity || 'Select City'}</Button>

                            {/* <Input keyboardType='default' variant="underlined" placeholder="Enter City" onChangeText={value => setData({
                                ...formData,
                                city: value
                            })} /> */}
                            {/* <Select selectedValue={formData.cityId} minWidth="100" placeholder="Select City" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <AIcon name={`down`} size={15} color='#fff' />
                                // }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                            }} mt={1} onValueChange={itemValue => setData({
                                ...formData,
                                cityId: itemValue
                            })} >
                                {cityData.map(x => {
                                    return (
                                        <Select.Item
                                            key={x.id}
                                            label={x.name}
                                            value={x.id}
                                        />
                                    );
                                })}
                            </Select> */}

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.selectedCity}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl mt={5} isInvalid={'pinCode' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Pin Code</FormControl.Label>

                            <Input maxLength={6} keyboardType='number-pad' variant="underlined" placeholder="Enter Pin Code" onChangeText={value => setData({
                                ...formData,
                                pinCode: value,
                                localityId: '',
                                selectedLocality: ''
                            })} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.pinCode}
                            </FormControl.ErrorMessage>
                        </FormControl>


                        <FormControl isReadOnly mt={5} isInvalid={'selectedLocality' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Locality</FormControl.Label>

                            <Button variant="outline" _text={{ color: "gray.400" }} endIcon={<AIcon name={`down`} size={21} color='gray' />} onPress={() => setShowLocalityModal(true)}>{formData?.selectedLocality || 'Select Locality'}</Button>

                            {/* <Input keyboardType='default' variant="underlined" placeholder="Enter City" onChangeText={value => setData({
                                ...formData,
                                city: value
                            })} /> */}
                            {/* <Select selectedValue={formData.localityId} minWidth="100" placeholder="Select Locality" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <AIcon name={`down`} size={15} color='#fff' />
                            }} mt={1} onValueChange={itemValue => setData({
                                ...formData,
                                localityId: itemValue
                            })} >
                                {localityData.map(x => {
                                    return (
                                        <Select.Item
                                            key={x.id}
                                            label={x.name}
                                            value={x.id}
                                        />
                                    );
                                })}
                            </Select> */}

                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.selectedLocality}
                            </FormControl.ErrorMessage>
                        </FormControl>


                    </View>

                    {updateProfileInfo?.success == false && <Text style={{ color: 'red', marginTop: 15 }}>{updateProfileInfo?.message}</Text>}

                    {/*Register Profile button*/}
                    <Button isDisabled={false} onPress={() => { validateFromInput() ? submitProfileUpdateFrom() : null }} rounded={20} style={{ shadowColor: '#00acee', alignSelf: 'center', backgroundColor: '#4632A1', width: width / 2, justifyContent: 'center', marginTop: 80 }}>
                        <Text style={{ color: '#fff', }}>Next</Text>
                    </Button>


                    <Text onPress={() => logout()} style={{ fontWeight: 'bold', marginTop: 10, color: '#ff6600', fontSize: 19, textAlign: 'center' }}>  {`Logout >`} </Text>
                </View>


            </ScrollView>

            <Modal isOpen={showStateModal} onClose={() => { setShowStateModal(false), setSearchText('') }}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <VStack p={6} >
                        <Input my={7} placeholder="Search by state name..." width="100%" borderRadius="4" py="3" px="3" fontSize="14" InputLeftElement={<AIcon name={`search1`} size={22} color='gray' />} onChangeText={value => setSearchText(value)} />

                        <Heading fontSize="lg">Select your State</Heading>
                        <FlatList data={stateData.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase()))} renderItem={({ item, index }) => <Box borderBottomWidth="1" _dark={{
                            borderColor: "gray.600"
                        }} borderColor="coolGray.200" py="2"  >
                            <TouchableOpacity
                                style={{ backgroundColor: item.isSelected == true ? 'green' : '', padding: 5, }}
                                // onPress={() => onPressList(item, index)}
                                onPress={() => {
                                    setData({
                                        ...formData,
                                        stateId: item.id,
                                        selectedState: item.name,
                                        cityId: '',
                                        selectedCity: ''
                                    }),
                                        setShowStateModal(false)
                                    setSearchText('')
                                    setStateData(onSelectFlatListItem(stateData, item.id))
                                }}
                            >
                                <HStack mb={2} justifyContent="space-between" style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <Text style={{ color: item.isSelected == true ? '#fff' : 'gray', fontWeight: 'bold' }} >
                                        {item?.name}
                                    </Text>
                                </HStack>
                            </TouchableOpacity>
                        </Box>} keyExtractor={item => item.id} />

                    </VStack>
                </Modal.Content>
            </Modal>



            <Modal isOpen={showCityModal} onClose={() => { setShowCityModal(false), setSearchText('') }}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <VStack p={6} >
                        <Input my={7} placeholder="Search by state name..." width="100%" borderRadius="4" py="3" px="3" fontSize="14" InputLeftElement={<AIcon name={`search1`} size={22} color='gray' />} onChangeText={value => setSearchText(value)} />

                        <Heading fontSize="lg">Select your City</Heading>
                        <FlatList data={cityData.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase()))} renderItem={({ item, index }) => <Box borderBottomWidth="1" _dark={{
                            borderColor: "gray.600"
                        }} borderColor="coolGray.200" py="2"  >
                            <TouchableOpacity
                                style={{ backgroundColor: item.isSelected == true ? 'green' : '', padding: 5, }}
                                // onPress={() => onPressList(item, index)}
                                onPress={() => {
                                    setData({
                                        ...formData,
                                        cityId: item.id,
                                        selectedCity: item.name
                                    }),
                                        setShowCityModal(false)
                                    setSearchText('')
                                    setCityData(onSelectFlatListItem(cityData, item.id))
                                }}
                            >
                                <HStack mb={2} justifyContent="space-between" style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <Text style={{ color: item.isSelected == true ? '#fff' : 'gray', fontWeight: 'bold' }} >
                                        {item?.name}
                                    </Text>
                                </HStack>
                            </TouchableOpacity>
                        </Box>} keyExtractor={item => item.id} />

                    </VStack>
                </Modal.Content>
            </Modal>


            <Modal isOpen={showLocalityModal} onClose={() => { setShowLocalityModal(false), setSearchText('') }}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <VStack p={6} >
                        <Input my={7} placeholder="Search by locality name..." width="100%" borderRadius="4" py="3" px="3" fontSize="14" InputLeftElement={<AIcon name={`search1`} size={22} color='gray' />} onChangeText={value => setSearchText(value)} />

                        <Heading fontSize="lg">Select your Locality</Heading>
                        <FlatList data={localityData.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase()))} renderItem={({ item, index }) => <Box borderBottomWidth="1" _dark={{
                            borderColor: "gray.600"
                        }} borderColor="coolGray.200" py="2"  >
                            <TouchableOpacity
                                style={{ backgroundColor: item.isSelected == true ? 'green' : '', padding: 5, }}
                                onPress={() => {
                                    setData({
                                        ...formData,
                                        localityId: item.id,
                                        selectedLocality: item.name
                                    }),
                                        setShowLocalityModal(false)
                                    setSearchText('')
                                    setLocalityData(onSelectFlatListItem(localityData, item.id))
                                }}
                            >
                                <HStack mb={2} justifyContent="space-between" style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <Text style={{ color: item.isSelected == true ? '#fff' : 'gray', fontWeight: 'bold' }} >
                                        {item?.name}
                                    </Text>
                                </HStack>
                            </TouchableOpacity>
                        </Box>} keyExtractor={item => item.id} />

                    </VStack>
                </Modal.Content>
            </Modal>


            <Spinner visible={isLoading} />
        </>
    )
}

export default RegisterProfileScreen