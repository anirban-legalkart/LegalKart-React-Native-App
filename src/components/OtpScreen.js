import OTPInputView from '@twotalltotems/react-native-otp-input'
import { Button, FormControl, Input } from 'native-base'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function OtpScreen(props) {
  return (
    <>
      <View style={styles.cmncard}>
        <FormControl w="100%">

          <View>
            <Text style={{ color: 'rgba(34, 33, 36, 0.90', fontWeight: 600, fontSize: 16, fontFamily: 'Rubik' }}>Enter OTP</Text>
            <Text style={{ color: 'rgba(34, 33, 36, 0.70)', fontWeight: 400, fontSize: 12, fontFamily: 'Rubik', marginTop: 10 }}>
              Please enter the one time password (OTP) that has been
              sent to <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>{props.countryCode ? props.countryCode : '+91 '}{props.number}</Text>
            </Text>
          </View>
          <View style={{ marginTop: 14 }}>

            <FormControl>
              {/* <OTPInputView
                style={{ width: '100%', height: 100, alignSelf: 'center' }}
                pinCount={6}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.otpInputBox}
                codeInputHighlightStyle={styles.higlightOnpress}
                onCodeFilled={(code => {
                  props.setEnteredOTP(code)
                  console.log(`Code is ${code}, you are good to go!`)
                })} /> */}
              <Input autoCapitalize='none' style={{borderColor: '#FFA100', borderWidth: 0.6, borderRadius: 6,}} maxLength={6} marginY={4} keyboardType='number-pad' variant="unstyled" placeholder="Enter OTP" onChangeText={(code => {
                props.setEnteredOTP(code)
                console.log(`Code is ${code}, you are good to go!`)
              })} />
            </FormControl>

            {props.resendOTP ? <Text style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Rubik', color: 'rgba(34, 33, 36, 0.70)', }}>
              Didn’t received OTP?
              <Text style={{ color: props.resendOTP ? "#808080" : '#000', marginLeft: 5, }}> Resend in 00:{props.disableTimer}</Text>
            </Text>

              : <Text style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Rubik', color: 'rgba(34, 33, 36, 0.70)', }}>
                Didn’t received OTP?
                <Text onPress={props.callResendPhoneOTPApi} style={{ color: '#FFA100', marginLeft: 5, fontWeight: 'bold', }}>  Resend OTP</Text>
              </Text>}

            {props.verifiedOtpInfo?.success == false && <Text style={{ color: 'red', marginTop: 15 }}>{props.verifiedOtpInfo?.message}</Text>}

          </View>

        </FormControl>

        <Button isDisabled={props.disableVerifyBtn} style={styles.commonLoginBtn} onPress={props.myOnpress}>
          <Text style={{ color: '#fff', fontWeight: 600, fontSize: 16, fontFamily: 'Rubik' }}>Continue</Text>
        </Button>

        {props.goToLogin && <Text style={{ marginTop: 10, textAlign: 'center' }}>
          Go to
          <Text onPress={props.goToLogin} style={{ fontWeight: 'bold', color: '#FFA100', fontSize: 19, textAlign: 'center' }}>  {`Login >`} </Text>
        </Text>}

      </View>
    </>
  )
}


const styles = StyleSheet.create({

  otpInputBox: {
    // borderColor: "#FF1493",
    borderRadius: 13,
    color: '#000',
  },
  higlightOnpress: {
    borderColor: "#FFA100",
  },

  commonLoginBtn: {
    backgroundColor: '#FFA100',
    borderRadius: 6,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: -7,
    marginTop: 25,
    height: 48,
  },
});