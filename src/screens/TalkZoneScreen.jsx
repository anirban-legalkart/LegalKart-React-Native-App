import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Avatar, Box, Button, FormControl, HStack, Heading, Input, Modal, Radio, Stack, Switch, Text, VStack, WarningOutlineIcon } from "native-base";
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { TabBar, TabView } from 'react-native-tab-view';
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { onGetScheduleCallListDetailsSubmit } from '../redux/slicers/getScheduleCallListDetailsSlicer';
import { onGetTakeCallStatusSubmit } from '../redux/slicers/getTakeCallStatusSlicer';
import { onGetTalkZoneDetailsSubmit } from '../redux/slicers/getTalkZoneDetailsSlicer';
import { callAddCustomRateApi } from '../services/addCustomRateApi';
import { callChangeCallReceiveAvailabilityApi } from '../services/changeCallReceiveAvailabilityApi';
import { callGeneratePaymentLinkApi } from '../services/generatePaymentLinkApi';
import { callGetClientDetailsApi } from '../services/getClientDetailsApi';
import { callRescheduleCallApi } from '../services/rescheduleCallApi';
import { callViewLawyerProfileByTypeApi } from '../services/viewLawyerProfileByTypeApi';

const { width, height } = Dimensions.get('screen');

const TalkZoneScreen = () => {
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        { key: 'first', title: 'Recents Calls' },
        { key: 'second', title: 'Upcoming Calls' },
        { key: 'third', title: 'Request' },
    ])
    const [talkZoneData, setTalkZoneData] = useState({});
    const [isTakeCallsActive, setIsTakeCallsActive] = useState();
    const [recentsCallsInfo, setRecentsCallsInfo] = useState([]);
    const [upcomingCallsInfo, setUpcomingCallsInfo] = useState([]);
    const [requestCallsInfo, setRequestCallsInfo] = useState([]);
    const [originalCallRate, setOriginalCallRate] = useState('');
    const [raisePaymentModal, setRaisePaymentModal] = useState(false);
    const [customRateModal, setCustomRateModal] = useState(false);
    const [viewClientDetailsModal, setViewClientDetailsModal] = useState(false);
    const [viewFeedbackDetailsModal, setViewFeedbackDetailsModal] = useState(false);
    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [payload, setPayload] = useState({});
    const [pageRecentToCall, setPageRecentToCall] = useState(1);
    const [pageUpcomingToCall, setPageUpcomingToCall] = useState(1);
    const [pageRequestToCall, setPageRequestToCall] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const talkZoneDetailsInfo = useSelector(state => state.getTalkZoneDetailsReducer.data);
    const takeCallStatusInfo = useSelector(state => state.getTakeCallStatusReducer.data);
    const scheduleCallListDetailsInfo = useSelector(state => state.getScheduleCallListDetailsReducer.data);


    const { control, handleSubmit, setValue, getValues, clearErrors, watch, reset, trigger, formState: { isValid, errors } } = useForm({
        defaultValues: {
            payee: '',
            service: '',
            fees: '',
            offerRate: ''
        }
    });


    const _renderTabBar = props => (
        <TabBar
            {...props}
            // style={{ backgroundColor: '#fafafa' }}
            tabStyle={[{ height: 46, maxHeight: 50, minHeight: 38, padding: 0, }]}
            labelStyle={[styles.label, { color: '#fff', }]}
            indicatorStyle={{ borderBottomColor: 'blue', borderBottomWidth: 4.5 }}

        />
    );

    const callGetTalkZoneDetailApi = () => {
        setIsLoading(true)
        dispatch(onGetTalkZoneDetailsSubmit({
            "page": pageRecentToCall,
            "limitItem": 10
        }))
    }
    useEffect(() => {
        // dispatch(onGetTalkZoneDetailsSubmit({
        //     "page": pageRecentToCall,
        //     "limitItem": 10
        // }))
        callGetTalkZoneDetailApi()

        dispatch(onGetTakeCallStatusSubmit())
        getCurrentCallRate()
    }, [])


    const callGetUpcomingCallDetailApi = () => {
        setIsLoading(true)
        dispatch(onGetScheduleCallListDetailsSubmit({
            "page": pageUpcomingToCall,
            "scheduleCallType": 'A'
        }))
    }
    const callGetRequestCallDetailApi = () => {
        setIsLoading(true)
        dispatch(onGetScheduleCallListDetailsSubmit({
            "page": pageRequestToCall,
            "scheduleCallType": 'W'
        }))
    }

    useEffect(() => {
        setRequestCallsInfo([])//
            setPageRequestToCall(1)//

        if (index == 1) {
            // dispatch(onGetScheduleCallListDetailsSubmit({
            //     "page": pageRequestToCall,
            //     "scheduleCallType": 'A'
            // }))
            callGetUpcomingCallDetailApi()
        } else if (index == 2) {
            // dispatch(onGetScheduleCallListDetailsSubmit({
            //     "scheduleCallType": 'W'
            // }))
            callGetRequestCallDetailApi()
        }
    }, [index])

    useEffect(() => {
        if (index == 1) {
            if (upcomingCallsInfo?.length > 0) {
                // console.log('Inside 1st IFFF');
                setIsLoading(false)
                setUpcomingCallsInfo([...upcomingCallsInfo, ...scheduleCallListDetailsInfo?.scheduled_list])
            } else {
                // console.log('Inside 2nd IFFF');
                setIsLoading(false)
                setUpcomingCallsInfo(scheduleCallListDetailsInfo?.scheduled_list)

            }
        } else if (index == 2) {
            if (requestCallsInfo?.length > 0) {
                console.log('Inside 1st IFFF')
                setIsLoading(false)
                setRequestCallsInfo([...requestCallsInfo, ...scheduleCallListDetailsInfo?.scheduled_list])
            } else {
                console.log('Inside 2nd IFFF')
                setIsLoading(false)
                setRequestCallsInfo(scheduleCallListDetailsInfo?.scheduled_list)

            }

        }
    }, [scheduleCallListDetailsInfo])

    // useEffect(() => {
    //     if (pageRecentToCall > 1) {
    //         console.log(pageRecentToCall, 'api csallllleeddd--->>>----')

    //         callGetTalkZoneDetailApi()
    //     }

    // }, [pageRecentToCall])

    useEffect(() => {
        if (pageUpcomingToCall > 1) {
            // console.log(pageUpcomingToCall, 'api csallllleeddd--->>>----')

            callGetUpcomingCallDetailApi()
        }

    }, [pageUpcomingToCall])


    useEffect(() => {
        // console.log(pageRequestToCall, 'api csallllleeddd--->>>----')
        if (pageRequestToCall > 1) {
            console.log(pageRequestToCall, 'callGetRequestCallDetailApi csallllleeddd--->>>----')
            callGetRequestCallDetailApi()
        }

    }, [pageRequestToCall])

    useEffect(() => {

        setTalkZoneData(talkZoneDetailsInfo)

        if (recentsCallsInfo?.length > 0) {
            console.log('Inside 1st IFFF')
            setIsLoading(false)
            setRecentsCallsInfo([...recentsCallsInfo, ...talkZoneDetailsInfo?.calling_list])
        } else {
            console.log('Inside 2nd IFFF')
            setIsLoading(false)
            setRecentsCallsInfo(talkZoneDetailsInfo?.calling_list)

        }
        // console.log(talkZoneDetailsInfo, 'talkZoneDetailsInfo----')
    }, [talkZoneDetailsInfo])

    useEffect(() => {
        if (takeCallStatusInfo?.call_service_slot_details) {
            setIsTakeCallsActive(takeCallStatusInfo?.call_service_slot_details?.active_status)
        }
        // console.log(takeCallStatusInfo?.call_service_slot_details, 'talkZoneDetailsInfo----')
    }, [takeCallStatusInfo])

    const handelCallReceiveAvailability = () => {
        callChangeCallReceiveAvailabilityApi({ is_active: !isTakeCallsActive }).then((res) => {
            setIsTakeCallsActive(!isTakeCallsActive)
            // console.log(res,'resssss----')
        })
    }


    const getCurrentCallRate = async () => {

        await callViewLawyerProfileByTypeApi({ type: "Fees" })
            .then((res) => {
                // console.log(res?.lawyer.lawyer_fees[0]?.phn_consult_fees,'resssss---- fees')
                setOriginalCallRate(res?.lawyer?.lawyer_fees[0]?.phn_consult_fees)
            })

    }


    const handelGenerateLink = (val) => {
        let data = {
            payee_name: val?.payee,
            service_name: val?.service,
            fees: val?.fees,
            client_id: payload?.clientId,
            enq_id: 0,
            email: '',
            mobile: ''
        }

        console.log(data, 'data---');
        callGeneratePaymentLinkApi(data).then((res) => {
            console.log(res, 'resssss callGeneratePaymentLinkApi----')
            reset()
            setPayload({})
        })
    }

    const handelAddCustomRate = (val) => {
        let data = {
            client_id: payload?.clientId,
            rate: val?.offerRate
        }

        // console.log(data,'data---');
        callAddCustomRateApi(data).then((res) => {
            console.log(res, 'resssss callAddCustomRateApi----')
            reset()
            setPayload({})
        })
    }


    const handelViewClientDetails = (clientId) => {
        let dataSet = {
            clientId: clientId,
        }
        // console.log(clientId,'data---');
        callGetClientDetailsApi(clientId).then((res) => {
            setPayload({
                ...dataSet,
                ...res?.details,
            })
            // setPayload(res?.details)
            setViewClientDetailsModal(true)
            console.log(res, 'resssss callGetClientDetailsApi----')
        })
    }



    const handelReschedule = () => { // For Upcoming calls tab (Reschedule Modal)
        let data = {
            scheduled_id: payload?.scheduled_id,
            final_schedule_call: `${moment(selectedDate).format('DD-MM-YYYY')} ${moment(selectedTime).format('h:mm a')}`
        }

        // console.log(data,'data---');
        callRescheduleCallApi(data).then((res) => {
            dispatch(onGetScheduleCallListDetailsSubmit({
                "scheduleCallType": 'A'
            }))

            setPayload({})
            console.log(res, 'resssss callRescheduleCallApi----')
        })
    }

    const handelAcceptDatTime = (scheduled_id) => { // For Request calls tab (Accept Btn)
        let data = {
            scheduled_id: scheduled_id,
            // final_schedule_call: "Aug 10, 2023 9:00 AM"
            final_schedule_call: `${moment(payload?.selectedDate).format('DD-MM-YYYY')} ${moment(payload?.selectedTime).format('h:mm a')}`


        }

        console.log(data, 'data---');
        callRescheduleCallApi(data).then((res) => {
            console.log(res, 'resssss callRescheduleCallApi----')
            setRequestCallsInfo([])
            setPageRequestToCall(1)
            // callGetRequestCallDetailApi()
            setIsLoading(true)
            dispatch(onGetScheduleCallListDetailsSubmit({
                "page": 1,
                "scheduleCallType": 'W'
            }))

            setPayload({})
        })
    }


    // console.log(recentsCallsInfo, 'recentsCallsInfo----')

    // getCurrentCallRate(0).then((res) => { console.log(res,'--->') } )

    const RecentsCallsView = () => {

        const generatedRecentsCallsRow = (x, i) => (
            <Box key={i} marginTop={2} alignItems="center">
                <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                }} _web={{
                    shadow: 2,
                    borderWidth: 0
                }} _light={{
                    backgroundColor: "gray.50"
                }}>

                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <HStack alignItems="center" space={4} justifyContent="space-between">
                                <Heading size="md" ml="-1">
                                    {x.client_name}
                                </Heading>
                                <Box bg="blue.400" p={1.5} _text={{
                                    color: "warmGray.50",
                                    fontWeight: "700",
                                    fontSize: "xs"
                                }}>{x.type}</Box>
                            </HStack>

                            <HStack alignItems="center" space={4} mt={3} justifyContent="space-between">
                                <Text fontSize="xs" _light={{
                                    color: "gray.500"
                                }} fontWeight="semibold" ml="-0.5" mt="-1">
                                    {x.date_time}
                                </Text>

                                <Text fontSize="lg" _light={{
                                    color: "black"
                                }} fontWeight="bold" ml="-0.5" mt="-1">
                                    {x.lawyer_fees}
                                </Text>
                            </HStack>

                            <HStack alignItems="center" space={4} mt={3} justifyContent="space-between">

                                <Text fontSize="xs" _light={{
                                    color: "gray.500"
                                }} fontWeight="semibold" ml="-0.5" mt="-1">
                                    {x.minutes_spend}
                                </Text>


                                <Text fontSize="xs" _light={{
                                    color: "violet.500"
                                }} _dark={{
                                    color: "violet.400"
                                }} fontWeight="500" ml="-0.5" mt="-1" onPress={() => handelViewClientDetails(x.client_id)}>
                                    View details
                                </Text>
                            </HStack>
                        </Stack>


                        <HStack alignItems="center" space={4} mt={0} >
                            <View style={{ height: '5cm' }}>
                                <AirbnbRating
                                    count={5}
                                    defaultRating={x?.rating_value}
                                    size={30}
                                    isDisabled
                                    reviews={[]}
                                    ratingContainerStyle={{
                                        marginTop: 0,
                                        // height: "0.6%"
                                    }}
                                />
                            </View>
                            <Text fontSize="md" style={{ alignSelf: 'flex-end' }} _light={{
                                color: "black"
                            }} fontWeight="bold" onPress={() => { setViewFeedbackDetailsModal(true), setPayload({ rating_value: x?.rating_value, review: x?.review, client_name: x?.client_name }) }}>
                                Reviews
                            </Text>
                        </HStack>

                        <HStack alignItems="center" space={4} mt={3} justifyContent="space-between">
                            <Button onPress={() => { setRaisePaymentModal(true), setValue("payee", x.client_name), setPayload({ ...payload, clientId: x.client_id }) }} size="sm" variant="outline" style={{ width: width / 2.7 }}>
                                RAISE PAYMENT
                            </Button>

                            <Button onPress={() => { setCustomRateModal(true), setPayload({ ...payload, clientId: x.client_id, custom_rate: x.custom_rate }) }} style={{ width: width / 2.7 }} leftIcon={<AIcon name={`plus`} size={15} color='#fff' />}>
                                CUSTOM RATE
                            </Button>
                        </HStack>


                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }} fontWeight="400">
                                    {/* Your current rate : {getCurrentCallRate(x.custom_rate)} */}
                                    {/* Your current rate : {x.custom_rate == 0 ? x.custom_rate :getCurrentCallRate(x.custom_rate)} */}
                                    Your current rate : ₹{x.custom_rate == 0 ? originalCallRate : x.custom_rate}/min
                                </Text>
                            </HStack>
                        </HStack>

                    </Stack>
                </Box>
            </Box>
        )

        return (
            <>
                

                <FlatList
                    key={`recentsCallsList`}
                    data={recentsCallsInfo}
                    contentContainerStyle={{ backgroundColor: 'white' }}
                    renderItem={({ item, index }) => generatedRecentsCallsRow(item, index)}
                    onEndReached={() => {
                        index == 0 && setPageRecentToCall(pageRecentToCall + 1)
                        index == 0 && callGetTalkZoneDetailApi()
                    }}
                    onEndReachedThreshold={1}
                    keyExtractor={(item, index) => 'p' + index}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={<View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>No Data Available</Text>
                    </View>}
                />

                {isLoading ? (
                    <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text>Loading...</Text>
                        <ActivityIndicator />
                    </View>
                ) : null}


            </>
        )
    }


    const UpcomingCallsView = () => {

        const generatedUpcomingCallsRow = (x, i) => (
            <Box key={i} marginY={5} alignItems="center">
                <Box maxW="80" minW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                }} _web={{
                    shadow: 2,
                    borderWidth: 0
                }} _light={{
                    backgroundColor: "gray.50"
                }}>

                    <Stack p="4" space={2}>
                        <Heading size="md" ml="-1">
                            A call with {x.client_name} is scheduled on
                        </Heading>

                        <HStack alignItems="center" space={4} >
                            <Text fontSize="sm" _light={{
                                color: "gray.500"
                            }} fontWeight="semibold" ml="-0.5" mt="-1">
                                {x.final_schedule_time}
                            </Text>
                        </HStack>

                        <Button size="sm" variant="outline" style={{ width: width / 2.7 }} onPress={() => { setRescheduleModal(true), setPayload({ scheduled_id: x?.id }), setSelectedDate(moment(x?.final_schedule_time, 'll').toDate()), setSelectedTime(moment(x?.final_schedule_time, 'lll').toDate()) }}>
                            Reschedule
                        </Button>

                    </Stack>

                </Box>
            </Box>
        )

        return (
            <>
                

                <FlatList
                    key={`upcomingCallsList`}
                    data={upcomingCallsInfo}
                    contentContainerStyle={{ backgroundColor: 'white' }}
                    renderItem={({ item, index }) => generatedUpcomingCallsRow(item, index)}
                    onEndReached={() => {
                        // index == 1 && dispatch(resetScheduleCallListInfo())
                        index == 1 && setPageUpcomingToCall(pageUpcomingToCall + 1)
                        // index == 1 && callGetUpcomingCallDetailApi()
                    }}
                    onEndReachedThreshold={1}
                    keyExtractor={(item, index) => 'u' + index}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={<View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>No Data Available</Text>
                    </View>}
                />

                {isLoading ? (
                    <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text>Loading...</Text>
                        <ActivityIndicator />
                    </View>
                ) : null}

            </>
        )
    }


    const RequestCallsView = () => {
        const generatedRequestCallsRow = (x, i) => (
            <Box key={i} marginY={5} alignItems="center">
                <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                }} _web={{
                    shadow: 2,
                    borderWidth: 0
                }} _light={{
                    backgroundColor: "gray.50"
                }}>

                    <Stack p="4" space={2}>
                        <Heading size="md" ml="-1">
                            A call request from {x.client_name}
                        </Heading>

                        <HStack alignItems="center" space={4} >
                            <Text fontSize="sm" _light={{
                                color: "purple.500"
                            }} fontWeight="semibold" ml="-0.5" mt="-1">
                                Preferable date & timings
                            </Text>
                        </HStack>
                        <Radio.Group name="myRadioGroup" accessibilityLabel="Preferable date & timings" onChange={nextValue => { setPayload({ selectedDate: moment(nextValue, 'll').toDate(), selectedTime: moment(nextValue, 'lll').toDate() }) }} >
                            <Radio value={x.schedule_time_one} my={1}>
                                {x.schedule_time_one}
                            </Radio>
                            <Radio value={x.schedule_time_two} my={1}>
                                {x.schedule_time_two}
                            </Radio>
                        </Radio.Group>

                        <HStack alignItems="center" space={4} mt={3} justifyContent="space-between" pb={12}>
                            <Button size="sm" style={{ width: width / 2.7 }} backgroundColor={'green.700'} onPress={() => { handelAcceptDatTime(x?.id) }}>
                                Accept
                            </Button>

                            <Button size="sm" variant="outline" style={{ width: width / 2.7 }}>
                                Reschedule
                            </Button>

                        </HStack>

                    </Stack>

                </Box>
            </Box>
        )

        return (
            <>
                
                <FlatList
                    key={`requestCallsList`}
                    data={requestCallsInfo}
                    contentContainerStyle={{ backgroundColor: 'white' }}
                    renderItem={({ item, index }) => generatedRequestCallsRow(item, index)}
                    onEndReached={() => {
                        // console.log(scheduleCallListDetailsInfo?.scheduled_list?.length ,'Called --->>onEndReached ')//scheduleCallListDetailsInfo?.scheduled_list?.length > 0
                        index == 2 && scheduleCallListDetailsInfo?.scheduled_list?.length > 0 && setPageRequestToCall(pageRequestToCall + 1)
                        // index == 1 && dispatch(resetScheduleCallListInfo())
                        // index == 1 && callGetUpcomingCallDetailApi()
                    }}
                    onEndReachedThreshold={1.5}
                    keyExtractor={(item, index) => 'u' + index}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={<View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>No Data Available</Text>
                    </View>}
                />

                {isLoading ? (
                    <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text>Loading...</Text>
                        <ActivityIndicator />
                    </View>
                ) : null}

            </>
        )
    }


    return (
        <>
            {/* <View style={{ flex: 1 }}> */}
            <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 20 }}>
                {/* <ScrollView style={{  backgroundColor: '#ffffff', padding: 20 }}
                    showsVerticalScrollIndicator={false} >  */}
                <View style={{ backgroundColor: '#434bd2', padding: 8 }}>
                    <View style={{}}>
                        <Text fontSize="3xl" _light={{ color: "#fff" }} fontWeight="bold">{talkZoneData?.total_earning}</Text>
                        <Text fontSize="lg" _light={{ color: "#fff" }} fontWeight="500">Total Earning</Text>
                    </View>

                    <HStack alignItems="center" space={4} justifyContent="space-between" marginY={3}>
                        <View style={{ backgroundColor: '#5c62da', padding: 7, width: width / 4, height: '100%' }}>
                            <Text fontSize="md" _light={{ color: "#fff" }} fontWeight="medium">Consultation Minutes</Text>
                            <Text fontSize="lg" _light={{ color: "#fff" }} fontWeight="bold">{talkZoneData?.total_minutes}</Text>
                        </View>

                        <View style={{ backgroundColor: '#5c62da', padding: 7, width: width / 4, height: '100%' }}>
                            <Text fontSize="md" _light={{ color: "#fff" }} fontWeight="medium">Rating</Text>
                            <Text fontSize="lg" _light={{ color: "#fff" }} fontWeight="bold">{talkZoneData?.ratings}</Text>
                        </View>

                        <View style={{ backgroundColor: '#5c62da', padding: 7, width: width / 4, height: '100%' }}>
                            <Text fontSize="md" _light={{ color: "#fff" }} fontWeight="medium">No. of calls</Text>
                            <Text fontSize="lg" _light={{ color: "#fff" }} fontWeight="bold">{talkZoneData?.no_of_call_received}</Text>
                        </View>
                    </HStack>

                </View>


                <Box marginY={5} maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                }} _web={{
                    shadow: 2,
                    borderWidth: 0
                }} _light={{
                    backgroundColor: "gray.50"
                }}>
                    <HStack p="4" alignItems="center" space={4} justifyContent="space-between">
                        <Heading size="md" ml="-1">
                            Take Calls?
                        </Heading>

                        <HStack>
                            <Switch mr={4} size="lg" colorScheme="emerald" value={isTakeCallsActive} onValueChange={() => handelCallReceiveAvailability()} />
                            <Text fontSize="lg" _light={{
                                color: "black"
                            }} fontWeight="bold" >
                                {isTakeCallsActive ? 'Yes' : 'No'}
                            </Text>
                        </HStack>
                    </HStack>

                </Box>


                <TabView
                    navigationState={{ index, routes }}
                    // style={{ height: 1000 }}
                    renderTabBar={_renderTabBar}
                    onIndexChange={setIndex}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            case 'first':
                                return (<>
                                    <View style={{ flex: 1, backgroundColor: '#fff' }} >
                                        {RecentsCallsView()}
                                    </View>

                                </>);

                            case 'second':
                                return (<>
                                    <View style={{ flex: 1, backgroundColor: '#fff' }} >
                                        {UpcomingCallsView()}
                                    </View>

                                </>);

                            case 'third':
                                return (<>
                                    <View style={{ flex: 1, backgroundColor: '#fff' }} >
                                        {RequestCallsView()}
                                    </View>

                                </>);
                            default:
                                return null;


                        }
                    }}
                />


                {/* </ScrollView> */}
            </View>

            {/* Raise Payment Modal */}
            <Modal closeOnOverlayClick={false} isKeyboardDismissable={true} isOpen={raisePaymentModal} onClose={() => { setRaisePaymentModal(false), clearErrors(), setPayload({}), reset() }} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>Generate Payment Link</Modal.Header>
                    <Modal.Body>
                        <FormControl isRequired isInvalid={'payee' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Payee</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Enter Payee Name" onChangeText={onChange} onBlur={onBlur} />
                                )}
                                name="payee"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.payee?.type === 'required' && `Payee name is required`}

                            </FormControl.ErrorMessage>

                        </FormControl>

                        <FormControl mt={3} isRequired isInvalid={'service' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Service</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Service" onChangeText={onChange} onBlur={onBlur} />
                                )}
                                name="service"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.service?.type === 'required' && `Service name is required`}

                            </FormControl.ErrorMessage>

                        </FormControl>

                        <FormControl mt={3} isRequired isInvalid={'fees' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Fees</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{
                                            paddingRight: 10,
                                            fontWeight: 'bold',
                                            color: 'black'
                                        }}>INR</Text>
                                        <Input width={'80%'} autoCapitalize='none' value={value} maxLength={80} keyboardType='number-pad' variant="underlined" placeholder="Fees" onChangeText={onChange} onBlur={onBlur} />
                                    </View>
                                )}
                                name="fees"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.fees?.type === 'required' && `Fees is required`}

                            </FormControl.ErrorMessage>

                        </FormControl>

                    </Modal.Body>
                    <Modal.Footer mt={5} justifyContent="center" alignItems="center">
                        
                        <Button
                            style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', }]}
                            onPress={handleSubmit((d) => { setRaisePaymentModal(false), handelGenerateLink(d), console.log(d, '___124**') })}
                        >
                            Generate Link
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>


            {/* Custom Rate Modal */}
            <Modal closeOnOverlayClick={false} isOpen={customRateModal} onClose={() => { setCustomRateModal(false), clearErrors(), setPayload({}), reset() }} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>Add Custom Rate</Modal.Header>
                    <Modal.Body>

                        <Text fontSize="lg" _light={{
                            color: "green.800"
                        }} fontWeight="semibold" ml="-0.5" mt="-1">
                            Your current rate : ₹{payload?.custom_rate == 0 ? originalCallRate : payload?.custom_rate}/min
                        </Text>

                        <FormControl mt={3} isRequired isInvalid={'offerRate' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Offer Rate</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    max: originalCallRate
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='number-pad' variant="underlined" placeholder="Enter Offer Rate Per Min." onChangeText={onChange} onBlur={onBlur} />
                                )}
                                name="offerRate"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.offerRate?.type === 'required' && `Offer Rate is required`}
                                {errors.offerRate?.type === 'max' && `Rate can't be greater than base rate(${originalCallRate})! `}

                            </FormControl.ErrorMessage>

                        </FormControl>

                    </Modal.Body>
                    <Modal.Footer mt={5} justifyContent="center" alignItems="center">
                        
                        <Button
                            style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', }]}
                            onPress={handleSubmit((d) => { setCustomRateModal(false), handelAddCustomRate(d), console.log(d, '___124**') })}
                        >
                            Submit
                        </Button>

                        {getValues("offerRate") > 0 && <Text fontSize="sm" _light={{
                            color: "purple.400"
                        }} ml="-0.5" mt="6">
                            Final rate for this customer :  ₹<Text fontSize="sm" fontWeight="bold">{'2'}/min</Text>
                        </Text>}
                    </Modal.Footer>
                </Modal.Content>
            </Modal>



            {/* View Client Details Modal */}
            <Modal closeOnOverlayClick={false} isOpen={viewClientDetailsModal} onClose={() => { setViewClientDetailsModal(false), setPayload({}) }} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>Client Details</Modal.Header>
                    <Modal.Body>

                        <Heading size="md" ml="-1" mb={2}>
                            {payload?.client_name}
                        </Heading>
                        <Text fontSize="xs" style={{ marginBottom: 5 }} _light={{
                            color: "gray.500"
                        }} fontWeight="semibold" ml="-0.5" mt="-1">
                            Phone: {payload?.client_mobile}
                        </Text>
                        <Text style={{ marginBottom: 5 }} fontSize="xs" _light={{
                            color: "gray.500"
                        }} fontWeight="semibold" ml="-0.5" mt="-1">
                            Email: {payload?.client_email}
                        </Text>
                        <Text fontSize="xs" _light={{
                            color: "gray.500"
                        }} fontWeight="semibold" ml="-0.5" mt="-1">
                            Payable Amount: ₹{payload?.amount}
                        </Text>

                    </Modal.Body>
                    <Modal.Footer mt={5} justifyContent="center" alignItems="center">
                        <Button.Group space={2} >
                            <Button variant="outline" colorScheme="blueGray" onPress={() => {
                                setViewClientDetailsModal(false),
                                    setPayload({})
                            }}>
                                Cancel
                            </Button>
                            <Button
                                style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', }]}
                                onPress={() => { setViewClientDetailsModal(false), setRaisePaymentModal(true), setValue("payee", payload?.client_name) }}
                            >
                                Raise Payment
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>



            {/* Feedback Modal */}
            <Modal closeOnOverlayClick={false} isOpen={viewFeedbackDetailsModal} onClose={() => { setViewFeedbackDetailsModal(false), setPayload({}) }} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>Feedback</Modal.Header>
                    <Modal.Body>

                        <VStack alignItems="center" space={2}  >

                            <AirbnbRating
                                count={5}
                                defaultRating={payload?.rating_value}
                                size={33}
                                isDisabled
                                reviews={[]}
                                ratingContainerStyle={{
                                    marginTop: 8,
                                    height: "25%"
                                }}
                            />
                            <Text fontSize="xl" _light={{
                                color: "black"
                            }} fontWeight="bold" mt="5">
                                {payload?.rating_value}
                            </Text>

                            <Text fontSize="2xl" _light={{
                                color: "gray.500"
                            }} fontWeight="semibold" >
                                {payload?.review}
                            </Text>
                        </VStack>

                    </Modal.Body>
                    <Modal.Footer justifyContent="flex-start" alignItems="center">
                        <Avatar mr={3} bg="gray.500" source={{
                            uri: 'https://raw.githubusercontent.com/OlgaKoplik/CodePen/master/profile.jpg'
                        }} />
                        <Text fontSize="lg" _light={{
                            color: "gray.500"
                        }} fontWeight="semibold" >
                            {payload?.client_name}
                        </Text>

                    </Modal.Footer>
                </Modal.Content>
            </Modal>



            {/* ---- Upcoming calls tab (Reschedule Modal) */}

            <Modal closeOnOverlayClick={false} isKeyboardDismissable={true} isOpen={rescheduleModal} onClose={() => { setRescheduleModal(false) }} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>Schedule Availability</Modal.Header>
                    <Modal.Body>
                        <Button variant="outline" _text={{ color: "gray.400" }} endIcon={<AIcon name={`down`} size={21} color='gray' />} onPress={() => { setShowDatePicker(!showDatePicker), setTimeout(() => { setShowDatePicker(false) }, 6000) }}>{moment(selectedDate).format('DD-MM-YYYY')}</Button>
                        {showDatePicker && (
                            <RNDateTimePicker minimumDate={new Date()} value={selectedDate}
                                onChange={(event, value) => {
                                    setShowDatePicker(!showDatePicker);
                                    setSelectedDate(value);
                                }} />
                        )}

                        <Button mt={5} variant="outline" _text={{ color: "gray.400" }} endIcon={<AIcon name={`down`} size={21} color='gray' />} onPress={() => { setShowTimePicker(true), setTimeout(() => { setShowTimePicker(false) }, 6000) }}>{moment(selectedTime).format('h:mm a')}</Button>
                        {showTimePicker && (
                            <RNDateTimePicker mode="time" value={selectedTime}
                                onChange={(event, value) => {
                                    setShowTimePicker(!showTimePicker);
                                    setSelectedTime(value);
                                    // console.log(value,'value TimePicker')
                                }} />
                        )}

                    </Modal.Body>
                    <Modal.Footer mt={5} justifyContent="center" alignItems="center">
                        
                        <Button
                            style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', }]}
                            onPress={() => { setRescheduleModal(false), handelReschedule() }}
                        >
                            Set Schedule
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

        </>
    )
}

export default TalkZoneScreen

const styles = StyleSheet.create({
    label: {
        fontWeight: '600',
        fontSize: 13,
        flexWrap: 'wrap',
        // color: Colors.text,
        // minWidth: Dimensions.get('window').width < 375 ? '100%' : '60%'
    },
    top: {
        marginBottom: "auto",
        marginTop: 20
    },
})