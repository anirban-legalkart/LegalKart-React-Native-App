import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Box, Button, HStack, Heading, Radio, Stack, Text } from 'native-base';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import TalkZoneModal from '../../components/TalkZoneModal';
import { callRescheduleCallApi } from '../../services/rescheduleCallApi';
const { width, height } = Dimensions.get('screen');

const GeneratedRequestCallsRow = ({ item, requestCallsInfo, setRequestCallsInfo }, props) => {

    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [payload, setPayload] = useState({});


    const handelAcceptDatTime = (matchSelectedId) => { // For Request calls tab (Accept Btn)
        let data = {
            scheduled_id: payload?.scheduled_id,
            // final_schedule_call: "Aug 10, 2023 9:00 AM"
            final_schedule_call: `${moment(payload?.selectedDate).format('DD-MM-YYYY')} ${moment(payload?.selectedTime).format('h:mm a')}`


        }

        if (matchSelectedId !== payload?.scheduled_id) {
            Toast.show({
                type: 'error',
                text1: 'At first Select a Preferable Date & time'
            });

        } else {

            // console.log(payload, 'payload---');
            callRescheduleCallApi(data).then((res) => {
                console.log(res, 'resssss callRescheduleCallApi----')
                Toast.show({
                    type: 'success',
                    text1: res?.message
                });

                const newRequestCallsList = requestCallsInfo.filter((x) => x.id !== payload?.scheduled_id);

                setRequestCallsInfo(newRequestCallsList);

                setPayload({})
            })
        }
    }


    const handelRescheduleForRequest = () => { //For Request calls tab (Reschedule Btn)
        let data = {
            scheduled_id: payload?.scheduled_id,
            final_schedule_call: `${moment(selectedDate).format('DD-MM-YYYY')} ${moment(selectedTime).format('h:mm a')}`
        }

        // console.log(data,'data  index 2---');
        callRescheduleCallApi(data).then((res) => {

            Toast.show({
                type: 'success',
                text1: res?.message
            });
            
            const newRequestCallsList = requestCallsInfo.filter((x) => x.id !== payload?.scheduled_id);

            setRequestCallsInfo(newRequestCallsList);

            setPayload({})
            setSelectedDate(new Date())
            setSelectedTime(new Date())
            console.log(res, 'resssss callRescheduleCallApi----')
        })
    }


    return (
        <>
            <Box key={props?.key} marginY={5} alignItems="center">
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
                            A call request from {item.client_name}
                        </Heading>

                        <HStack alignItems="center" space={4} >
                            <Text fontSize="sm" _light={{
                                color: "purple.500"
                            }} fontWeight="semibold" ml="-0.5" mt="-1">
                                Preferable date & timings
                            </Text>
                        </HStack>

                        <Radio.Group name="myRadioGroup" value={payload.selectedVal} accessibilityLabel="Preferable date & timings" onChange={(nextValue) => { setPayload({ scheduled_id: item?.id, selectedVal: nextValue, selectedDate: moment(nextValue, 'll').toDate(), selectedTime: moment(nextValue, 'lll').toDate() }), console.log(nextValue, 'nextValue----->') }} >
                            <Radio value={item.schedule_time_one} my={1}>
                                {item.schedule_time_one}
                            </Radio>
                            <Radio value={item.schedule_time_two} my={1}>
                                {item.schedule_time_two}
                            </Radio>
                        </Radio.Group>

                        <HStack alignItems="center" space={4} mt={3} justifyContent="space-between" pb={12}>
                            <Button size="sm" style={{ width: width / 2.7 }} backgroundColor={'green.700'} onPress={() => { handelAcceptDatTime(item?.id) }}>
                                Accept
                            </Button>

                            {/* <Button size="sm" variant="outline" style={{ width: width / 2.7 }} onPress={() => { props.setRescheduleModal(true), props.setPayload({ scheduled_id: item?.id }), props.setSelectedDate(moment(item?.final_schedule_time, 'll').toDate()), props.setSelectedTime(moment(item?.final_schedule_time, 'lll').toDate()) }}> */}
                            <Button size="sm" variant="outline" style={{ width: width / 2.7 }} onPress={() => { setRescheduleModal(true), setPayload({ scheduled_id: item?.id }) }}>
                                Reschedule
                            </Button>

                        </HStack>

                    </Stack>

                </Box>
            </Box>

            {/* ---- Upcoming calls tab (Reschedule Modal) */}
            <TalkZoneModal isOpen={rescheduleModal} mHeader={'Schedule Availability'} onClose={() => { setRescheduleModal(false) }} submitBtnText={'Set Schedule'}
                onSubmitPress={() => { setRescheduleModal(false), handelRescheduleForRequest() }}
                mBody={
                    <>
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

                    </>
                }
            />

        </>
    )
}

export default GeneratedRequestCallsRow