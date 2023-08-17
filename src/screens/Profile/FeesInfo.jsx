import { View } from 'react-native'
import React from 'react'
import { Text } from 'native-base'

const FeesInfo = ({lawyerFeesInfo}) => {
  return (
    <View>

      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
       Phone Consultation Fees:  <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerFeesInfo?.phn_consult_fees} </Text>
      </Text>

      <Text s fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Meeting Consultation Fees: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerFeesInfo?.video_conf_fees} </Text>
      </Text>
      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Email Consultation Fees: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerFeesInfo?.email_consult_fees} </Text>
      </Text>

      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Case Filing Fees: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerFeesInfo?.legal_notice_fees} </Text>
      </Text>

      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Per Appearance Fees: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerFeesInfo?.hearing_date_fees} </Text>
      </Text>

    </View>
  )
}

export default FeesInfo