import OTPInputView from '@twotalltotems/react-native-otp-input'
import { Button, FormControl } from 'native-base'
import React from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'

export default function OtpScreen(props) {
  return (
    <SafeAreaView style={{ marginTop: 15, display: 'flex', alignItems: 'center', paddingHorizontal: 25 }}>

      <Text style={{

        fontSize: 26,
        //  lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        //  color: 'white',
        //  alignSelf: 'center',
        // justifyContent: 'center',
      }}>
        Validate OTP
      </Text>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        Please enter the verification code we've sent you on <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>{props.countryCode ? props.countryCode : '+91 '}{props.number}</Text>
      </Text>

      <FormControl>
        <OTPInputView
          style={{ width: '90%', height: 100, alignSelf: 'center' }}
          pinCount={6}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.otpInputBox}
          codeInputHighlightStyle={styles.higlightOnpress}
          onCodeFilled={(code => {
            props.setEnteredOTP(code)
            console.log(`Code is ${code}, you are good to go!`)
          })} />

      </FormControl>

      {props.resendOTP ? <Text style={{ color: props.resendOTP ? "#808080" : '#000', fontSize: 20 }}> 00:{props.disableTimer}</Text>

        : <Text >
          Didn't receive code?
          <Text onPress={props.callResendPhoneOTPApi} style={{ fontWeight: 'bold', }}>  Resend OTP</Text>
        </Text>}

      {props.verifiedOtpInfo?.success == false && <Text style={{ color: 'red', marginTop: 15 }}>{props.verifiedOtpInfo?.message}</Text>}

      <Button isDisabled={props.disableVerifyBtn} style={{ width: '50%', marginTop: 80 }} onPress={props.myOnpress}>
        Verify
      </Button>


      {props.goToLogin && <Text style={{ marginTop: 22 }}>
        Go to
        <Text onPress={props.goToLogin} style={{ fontWeight: 'bold', color: '#ff6600', fontSize: 19, textAlign: 'center' }}>  {`Login >`} </Text>
      </Text>}

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({

  otpInputBox: {
    borderColor: "#FF1493",
    color: '#000',
  },
  higlightOnpress: {
    borderColor: "#03DAC6",
  }
});