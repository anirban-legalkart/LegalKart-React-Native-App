import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';

const AchivementsInfo = ({ achivementsInfo }) => {
  return (
    <View>
      {achivementsInfo.map((n, i) => (
        <View key={i}>
          <Text _light={{ color: "gray.500" }} fontWeight="semibold">{`\u25CF ${n?.name} in ${n?.year} `}</Text>

        </View>
      ))}

    </View>
  )
}

export default AchivementsInfo