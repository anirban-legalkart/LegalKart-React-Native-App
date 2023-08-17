import moment from 'moment';
import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';

const ExperienceInfo = ({ lawyerExperiencesInfo }) => {
    return (
        <View>

            {lawyerExperiencesInfo.map((n, i) => (
                <View key={i}>
                    <Text _light={{ color: "gray.500" }} fontWeight="semibold">{`\u25CF ${n?.practice_name}  (${moment(n?.from_date).format('MMMM YYYY')} - ${moment(n?.to_date).format('MMMM YYYY')})  `}</Text>

                </View>
            ))}
        </View>
    )
}

export default ExperienceInfo