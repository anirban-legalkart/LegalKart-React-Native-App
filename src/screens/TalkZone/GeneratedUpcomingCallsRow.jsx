import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Box, Button, HStack, Heading, Stack, Text } from 'native-base';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import TalkZoneModal from '../../components/TalkZoneModal';
import { callRescheduleCallApi } from '../../services/rescheduleCallApi';
const { width, height } = Dimensions.get('screen');

function GeneratedUpcomingCallsRow({ item, setUpcomingCallsInfo, pageUpcomingToCall, setPageUpcomingToCall, callGetUpcomingCallDetailApi }, props) {

    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [payload, setPayload] = useState({});


    const handelRescheduleForUpcoming = () => { // For Upcoming calls tab (Reschedule Modal)
        let data = {
            scheduled_id: payload?.scheduled_id,
            final_schedule_call: `${moment(selectedDate).format('DD-MM-YYYY')} ${moment(selectedTime).format('h:mm a')}`
        }

        // console.log(data,'data---');
        callRescheduleCallApi(data).then((res) => {
            Toast.show({
                type: 'success',
                text1: res?.message
            });

            // console.log(res?.socket_data?.schedule_id,'data -----');
            // const newArr = upcomingCallsInfo.map(obj => {
            // upcomingCallsInfo.map(obj => {

            //     if (obj.id === res?.socket_data?.schedule_id) {
            //         //    return { ...obj, custom_rate: val?.offerRate };
            //         console.log('Matched');
            //     }

            //     // return obj;
            // });


            setUpcomingCallsInfo([])//
            setPageUpcomingToCall({
                ...pageUpcomingToCall,
                page: 1,
            });//

            callGetUpcomingCallDetailApi()
            setPayload({})
            console.log(res, 'resssss callRescheduleCallApi----')
        })
    }

    return (
        <>
            <Box key={props?.key} marginY={5} alignItems="center">
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
                            A call with {item.client_name} is scheduled on
                        </Heading>

                        <HStack alignItems="center" space={4} >
                            <Text fontSize="sm" _light={{
                                color: "gray.500"
                            }} fontWeight="semibold" ml="-0.5" mt="-1">
                                {item.final_schedule_time}
                            </Text>
                        </HStack>

                        <Button size="sm" variant="outline" style={{ width: width / 2.7 }} onPress={() => { setRescheduleModal(true), setPayload({ scheduled_id: item?.id }), setSelectedDate(moment(item?.final_schedule_time, 'll').toDate()), setSelectedTime(moment(item?.final_schedule_time, 'lll').toDate()) }}>
                            Reschedule
                        </Button>

                    </Stack>

                </Box>
            </Box>



            {/* ---- Upcoming calls tab (Reschedule Modal) */}
            <TalkZoneModal isOpen={rescheduleModal} mHeader={'Schedule Availability'} onClose={() => { setRescheduleModal(false) }} submitBtnText={'Set Schedule'}
                onSubmitPress={() => { setRescheduleModal(false), handelRescheduleForUpcoming() }}
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
                                }} />
                        )}

                    </>
                }
            />

        </>
    )
}

export default GeneratedUpcomingCallsRow