import { View } from 'react-native'
import React from 'react'
import { Text } from 'native-base'

const BankInfo = ({lawyerBankInfo}) => {
  return (
    <View>


      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Account Number:  <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerBankInfo?.account_number} </Text>
      </Text>

      <Text s fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Account Holder: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerBankInfo?.account_holder} </Text>
      </Text>
      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        Bank Name: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerBankInfo?.bank_name} </Text>
      </Text>

      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        IFSC Code: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerBankInfo?.ifsc_code} </Text>
      </Text>

      <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
        color: "black"
      }} fontWeight="bold" ml="-0.5" mt="-1">
        PAN Number: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerBankInfo?.pan_no} </Text>
      </Text>

    </View>
  )
}

export default BankInfo