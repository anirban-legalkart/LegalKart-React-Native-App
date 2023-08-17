import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';

const ExpertiseInfo = ({expertiseInfo}) => {
    return (
        <View>

            {expertiseInfo.map((n, i) => (
                <View key={i}>
                    <Text _light={{ color: "gray.500" }} fontWeight="semibold">{`\u25CF ${n?.sub_pacticearea?.name}  `}</Text>

                </View>
            ))}
        </View>
    )
}

export default ExpertiseInfo