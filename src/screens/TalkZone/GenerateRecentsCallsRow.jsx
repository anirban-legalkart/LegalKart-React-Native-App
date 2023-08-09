import { Avatar, Box, Button, FormControl, HStack, Heading, Input, Stack, Text, VStack, WarningOutlineIcon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Dimensions, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Toast from 'react-native-toast-message';
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import { useSelector } from 'react-redux';
import TalkZoneModal from '../../components/TalkZoneModal';
import { callAddCustomRateApi } from '../../services/addCustomRateApi';
import { callGeneratePaymentLinkApi } from '../../services/generatePaymentLinkApi';
import { callGetClientDetailsApi } from '../../services/getClientDetailsApi';
const { width, height } = Dimensions.get('screen');

const GenerateRecentsCallsRow = ({ item, originalCallRate, recentsCallsInfo, setRecentsCallsInfo }, props) => {

    // console.log( recentsCallsInfo , 'props.recentsCallsInfo--->')

    const [raisePaymentModal, setRaisePaymentModal] = useState(false);
    const [customRateModal, setCustomRateModal] = useState(false);
    const [viewClientDetailsModal, setViewClientDetailsModal] = useState(false);
    const [viewFeedbackDetailsModal, setViewFeedbackDetailsModal] = useState(false);
    const [payload, setPayload] = useState({});
    const [callRatePercentage, setCallRatePercentage] = useState(0);

    const lawyerProfileDetailsInfo = useSelector(state => state.getLawyerProfileDetailsReducer.data);


    const { control, handleSubmit, setValue, getValues, clearErrors, watch, reset, trigger, formState: { isValid, errors } } = useForm({
        defaultValues: {
            payee: '',
            service: '',
            fees: '',
            offerRate: ''
        }
    });

    useEffect(() => {
        if (lawyerProfileDetailsInfo?.success) { //Get call_rate_percentage
            // console.log(lawyerProfileDetailsInfo?.call_rate_percentage,'--==++');
            setCallRatePercentage(lawyerProfileDetailsInfo?.call_rate_percentage)
        }

    }, [lawyerProfileDetailsInfo])
    

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

        // console.log(data, 'data---');
        callGeneratePaymentLinkApi(data).then((res) => {
            Toast.show({
                type: 'success',
                text1: res?.message,
            });

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
            Toast.show({
                type: res?.success ? 'success' : 'error',
                text1: res?.message,
            });

            const newArr = recentsCallsInfo.map(obj => {
                return { ...obj, custom_rate: val?.offerRate };
            });
            setRecentsCallsInfo(newArr)
            reset()
            setPayload({})
        })
    }


    const calculateCallRateBasedOnInput = () => {
        const calculated_call_rate = Math.ceil(watch("offerRate")) + (callRatePercentage / 100 * watch("offerRate"));
        return Math.ceil(calculated_call_rate);
    }

    const handelViewClientDetails = (clientId) => {
        let dataSet = {
            // clientId: payload?.clientId,
            clientId: clientId,
        }
        console.log(dataSet, 'data---');
        callGetClientDetailsApi(clientId).then((res) => {
            setPayload({
                ...dataSet,
                ...res?.details,
            })
            setViewClientDetailsModal(true)
            console.log(res, 'resssss callGetClientDetailsApi----')
        })
    }

    return (
        <>
            <Box key={props.key} marginTop={2} alignItems="center">
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
                                    {item.client_name}
                                </Heading>
                                <Box bg="blue.400" p={1.5} _text={{
                                    color: "warmGray.50",
                                    fontWeight: "700",
                                    fontSize: "xs"
                                }}>{item.type}</Box>
                            </HStack>

                            <HStack alignItems="center" space={4} mt={3} justifyContent="space-between">
                                <Text fontSize="xs" _light={{
                                    color: "gray.500"
                                }} fontWeight="semibold" ml="-0.5" mt="-1">
                                    {item.date_time}
                                </Text>

                                <Text fontSize="lg" _light={{
                                    color: "black"
                                }} fontWeight="bold" ml="-0.5" mt="-1">
                                    {item.lawyer_fees}
                                </Text>
                            </HStack>

                            <HStack alignItems="center" space={4} mt={3} justifyContent="space-between">

                                <Text fontSize="xs" _light={{
                                    color: "gray.500"
                                }} fontWeight="semibold" ml="-0.5" mt="-1">
                                    {item.minutes_spend}
                                </Text>


                                <Text fontSize="xs" _light={{
                                    color: "violet.500"
                                }} _dark={{
                                    color: "violet.400"
                                }} fontWeight="500" ml="-0.5" mt="-1" onPress={() => { handelViewClientDetails(item.client_id) }}>
                                    View details
                                </Text>
                            </HStack>
                        </Stack>


                        <HStack alignItems="center" space={4} mt={0} >
                            <View style={{ height: '5cm' }}>
                                <AirbnbRating
                                    count={5}
                                    defaultRating={item?.rating_value}
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
                            }} fontWeight="bold" onPress={() => { setViewFeedbackDetailsModal(true), setPayload({ rating_value: item?.rating_value, review: item?.review, client_name: item?.client_name }) }}>
                                Reviews
                            </Text>
                        </HStack>

                        <HStack alignItems="center" space={4} mt={3} justifyContent="space-between">
                            <Button onPress={() => { setRaisePaymentModal(true), setValue("payee", item.client_name), setPayload({ ...payload, clientId: item.client_id }) }} size="sm" variant="outline" style={{ width: width / 2.7 }}>
                                RAISE PAYMENT
                            </Button>

                            <Button onPress={() => { setCustomRateModal(true), setPayload({ ...payload, clientId: item.client_id, custom_rate: item.custom_rate }) }} style={{ width: width / 2.7 }} leftIcon={<AIcon name={`plus`} size={15} color='#fff' />}>
                                CUSTOM RATE
                            </Button>
                        </HStack>


                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }} fontWeight="400">
                                    Your current rate : ₹{item.custom_rate == 0 ? originalCallRate : item.custom_rate}/min
                                </Text>
                            </HStack>
                        </HStack>

                    </Stack>
                </Box>
            </Box>




            {/* Raise Payment Modal */}
            <TalkZoneModal isOpen={raisePaymentModal} mHeader={'Generate Payment Link'} onClose={() => { setRaisePaymentModal(false), clearErrors(), setPayload({}), reset() }} submitBtnText={'Generate Link'}
                onSubmitPress={handleSubmit((d) => { setRaisePaymentModal(false), handelGenerateLink(d), console.log(d, '___124**') })}
                mBody={
                    <>
                        <FormControl isRequired isInvalid={'payee' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Payee</FormControl.Label>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={50} keyboardType='default' variant="underlined" placeholder="Enter Payee Name" onChangeText={onChange} onBlur={onBlur} />
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

                                    <Input autoCapitalize='none' value={value} maxLength={50} keyboardType='default' variant="underlined" placeholder="Service" onChangeText={onChange} onBlur={onBlur} />
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
                                        <Input width={'80%'} autoCapitalize='none' value={value} maxLength={5} keyboardType='number-pad' variant="underlined" placeholder="Fees" onChangeText={onChange} onBlur={onBlur} />
                                    </View>
                                )}
                                name="fees"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.fees?.type === 'required' && `Fees is required`}

                            </FormControl.ErrorMessage>

                        </FormControl>
                    </>
                }
            />


            {/* Custom Rate Modal */}
            <TalkZoneModal isOpen={customRateModal} mHeader={'Add Custom Rate'} onClose={() => { setCustomRateModal(false), clearErrors(), setPayload({}), reset() }} submitBtnText={'Submit'}
                onSubmitPress={handleSubmit((d) => { setCustomRateModal(false), handelAddCustomRate(d), console.log(d, '___124**') })}
                mBody={
                    <>
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
                                    max: originalCallRate - 1
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (

                                    <Input autoCapitalize='none' value={value} maxLength={5} keyboardType='number-pad' variant="underlined" placeholder="Enter Offer Rate Per Min." onChangeText={onChange} onBlur={onBlur} />
                                )}
                                name="offerRate"
                            />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.offerRate?.type === 'required' && `Offer Rate is required`}
                                {errors.offerRate?.type === 'max' && `Rate can't be greater than or equal to base rate(${originalCallRate})! `}

                            </FormControl.ErrorMessage>

                        </FormControl>
                    </>
                }
                footerText={
                    <>
                        {getValues("offerRate") > 0 && <Text fontSize="sm" _light={{
                            color: "purple.400"
                        }} ml="-0.5" mt="6">
                            Final rate for this customer :  ₹<Text fontSize="sm" fontWeight="bold">{calculateCallRateBasedOnInput()}/min</Text>
                        </Text>}
                    </>
                }
            />



            {/* View Client Details Modal */}
            <TalkZoneModal isOpen={viewClientDetailsModal} mHeader={'Client Details'} onClose={() => { setViewClientDetailsModal(false), setPayload({}) }} submitBtnText={'Raise Payment'}
                onSubmitPress={() => { setViewClientDetailsModal(false), setRaisePaymentModal(true), setValue("payee", payload?.client_name) }}
                onCancelPress={() => { setViewClientDetailsModal(false), setPayload({}) }}
                mBody={
                    <>
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
                    </>
                }
            />


            {/* Feedback Modal */}
            <TalkZoneModal isOpen={viewFeedbackDetailsModal} mHeader={'Feedback'} onClose={() => { setViewFeedbackDetailsModal(false), setPayload({}) }}
                mBody={
                    <>
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
                    </>
                }
                footerText={
                    <>
                        <Avatar mr={3} bg="gray.500" source={{
                            uri: 'https://raw.githubusercontent.com/OlgaKoplik/CodePen/master/profile.jpg'
                        }} />
                        <Text fontSize="lg" _light={{
                            color: "gray.500"
                        }} fontWeight="semibold" >
                            {payload?.client_name}
                        </Text>
                    </>
                }
            />

        </>
    )
}

export default GenerateRecentsCallsRow