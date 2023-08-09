import { Box, HStack, Heading, Switch, Text } from 'native-base';
import React from 'react';
import { Dimensions, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { callChangeCallReceiveAvailabilityApi } from '../../services/changeCallReceiveAvailabilityApi';

const { width, height } = Dimensions.get('screen');

const HeaderSec = ({setIsTakeCallsActive, isTakeCallsActive, talkZoneData },props) => {

    const handelCallReceiveAvailability = () => {
          setIsTakeCallsActive(!isTakeCallsActive)
        callChangeCallReceiveAvailabilityApi({ is_active: !isTakeCallsActive }).then((res) => {
            Toast.show({
                type: 'success',
                text1: res?.message
            });
          console.log(res,'resssss----')
        })
      }

    return (
        <>
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
                        <Switch mr={4} size="lg" colorScheme="emerald" value={isTakeCallsActive} onToggle={handelCallReceiveAvailability} />
                        <Text fontSize="lg" _light={{
                            color: "black"
                        }} fontWeight="bold" >
                            {isTakeCallsActive ? 'Yes' : 'No'}
                        </Text>
                    </HStack>
                </HStack>

            </Box>
        </>
    )
}

export default HeaderSec