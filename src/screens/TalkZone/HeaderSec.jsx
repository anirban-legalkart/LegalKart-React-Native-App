import { HStack, Text } from 'native-base';
import React from 'react';
import { Dimensions, View } from 'react-native';
import TakeCallsScreen from '../../components/TakeCallsScreen';

const { width, height } = Dimensions.get('screen');

const HeaderSec = (props) => {
    const { talkZoneData, params, navigation } = props;
    // const { route: { params } } = props;

    // console.log(params,'Passed Data----');
    // console.log(navigation,'navigation Data----');


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


            <TakeCallsScreen />
        </>
    )
}

export default HeaderSec