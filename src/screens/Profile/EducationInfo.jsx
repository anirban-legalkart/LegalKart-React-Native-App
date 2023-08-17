import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';

const EducationInfo = ({ educationInfo }) => {
  return (
    <View>

      {educationInfo.map((n, i) => (
        <View key={i}>
          <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
            color: "black"
          }} fontWeight="bold" ml="-0.5" mt="-1"> {n?.degree} </Text>
          <Text _light={{ color: "gray.500" }} fontWeight="semibold">{n?.university}</Text>
          <Text _light={{ color: "gray.500" }} fontWeight="semibold">{n?.year}</Text>

        </View>
      ))}

      

    </View>
  )
}

export default EducationInfo