import React, { useEffect, useState } from 'react';
import { Box, HStack, Heading, Switch, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { callChangeCallReceiveAvailabilityApi } from '../services/changeCallReceiveAvailabilityApi';
import Toast from 'react-native-toast-message';
import { onGetTakeCallStatusSubmit } from '../redux/slicers/getTakeCallStatusSlicer';
import Spinner from './Spinner';


const TakeCallsScreen = (props) => {
    const dispatch = useDispatch();

    const [isTakeCallsActive, setIsTakeCallsActive] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const takeCallStatusInfo = useSelector(state => state.getTakeCallStatusReducer.data);

    useEffect(() => {
        setIsLoading(true)
        dispatch(onGetTakeCallStatusSubmit())
        return () => {
            dispatch(onGetTakeCallStatusSubmit())
          };
    }, [])

    useEffect(() => {
        if (takeCallStatusInfo?.call_service_slot_details) {
            setIsLoading(false)
            setIsTakeCallsActive(takeCallStatusInfo?.call_service_slot_details?.active_status)
        }
        // console.log(takeCallStatusInfo?.call_service_slot_details, 'talkZoneDetailsInfo----')
    }, [takeCallStatusInfo])

    const handelCallReceiveAvailability = () => {
        setIsTakeCallsActive(!isTakeCallsActive)
        callChangeCallReceiveAvailabilityApi({ is_active: !isTakeCallsActive }).then((res) => {
            Toast.show({
                type: 'success',
                text1: res?.message
            });
            console.log(res, 'resssss----')
        })
    }


  return (
    <>
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
                        <Switch mr={4} size="lg" colorScheme="emerald" value={isTakeCallsActive} onToggle={handelCallReceiveAvailability} />
                        <Text fontSize="lg" _light={{
                            color: "black"
                        }} fontWeight="bold" >
                            {isTakeCallsActive ? 'Yes' : 'No'}
                        </Text>
                    </HStack>
                </HStack>

            </Box>
            <Spinner visible={isLoading} />
    </>
  )
}

export default TakeCallsScreen