
import { Button, CheckIcon, FormControl, Input, Select } from "native-base";
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OtpScreen from '../components/OtpScreen';
import Spinner from '../components/Spinner';
import { onUserRegisterSubmit } from '../redux/slicers/registerSlicer';
import { onResendOTPSubmit } from '../redux/slicers/resendPhoneOTPSlicer';
import { onVerifyRegisterOTPSubmit } from '../redux/slicers/verifyRegisterPhoneOTPSlicer';

const { width, height } = Dimensions.get('screen');


const RegisterScreen = ({ navigation }) => {
  let timer = 0;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setData] = useState({});
  const [countryCode, setCountryCode] = useState();
  const [errors, setErrors] = useState({});
  const [isRegisterBtnClick, setIsRegisterBtnClick] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState();

  const [resendOTP, setResendOTP] = useState(false);
  const [disableTimer, setDisableTimer] = useState(120);

  const registerUserInfo = useSelector(state => state.registerReducer.data);

  // const { test } = useContext(AuthContext); 
  // const test = useContext(AuthContext);

  const callResendPhoneOTPApi = () => {
    // console.log('Clicked -->');
    dispatch(onResendOTPSubmit({
      "mobile_number": formData.mobileNumber,

    }))

    // Otp timer funcitonality
    setResendOTP(true);
    setDisableTimer(60);
    timer = setInterval(() => {
      return setDisableTimer((prev) => prev - 1);
    }, 1000);


    setTimeout(() => {
      setResendOTP(false);
      setDisableTimer(60);
      clearInterval(timer);
    }, 60000)
  }


  const verifyPhoneOTP = () => {
    dispatch(onVerifyRegisterOTPSubmit({
      "user_id": registerUserInfo?.user_id,
      "otp": enteredOTP,
      "_csrf": registerUserInfo?._csrf
    }))

  }

  const submitRegisterFrom = () => {
    console.log('Clicked -->');
    setIsLoading(true)
    dispatch(onUserRegisterSubmit({
      "mobile": formData?.mobileNumber,
      "device_fcm_id": "Development"
    }))

  }

  useEffect(() => {
    setIsLoading(false)
    if (registerUserInfo?.success) {

      setIsRegisterBtnClick(true)

      // Otp timer funcitonality
      setResendOTP(true);
      setDisableTimer(60);
      timer = setInterval(() => {
        return setDisableTimer((prev) => prev - 1);
      }, 1000);


      setTimeout(() => {
        setResendOTP(false);
        setDisableTimer(60);
        clearInterval(timer);
      }, 60000)
    }

  }, [registerUserInfo])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 60000)
  // }, [isLoading])

  return (
    <>


      {!isRegisterBtnClick ? <ScrollView style={{ flex: 1, backgroundColor: '#ffffff', marginTop: 10 }}
        showsVerticalScrollIndicator={false}>


        <View style={{ padding: 40 }}>
          <Text style={{ color: '#4632A1', fontSize: 34 }}>Register From</Text>

          {/*From input  */}
          <View style={{ marginTop: 50 }}>

            <FormControl isInvalid={'mobileNumber' in errors} w="100%" maxW="300px"  >
              <FormControl.Label>Enter Mobile no.</FormControl.Label>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                {/* <Text style={{
                  paddingRight: 10,
                  fontWeight: 'bold',
                  color: 'black'
                }}>+91</Text> */}

                <Select mr={3} defaultValue='+91' selectedValue={countryCode} width="90" accessibilityLabel="Choose Country Code" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="2" st />
                }} mt={1} onValueChange={itemValue => setCountryCode(itemValue)}>
                  <Select.Item label="+91" value="+91" />
                  <Select.Item label="+1" value="+1" />
                </Select>

                <Input width={'80%'} keyboardType='number-pad' variant="underlined" placeholder={'Enter Mobile no.'} onChangeText={value => setData({
                  ...formData,
                  mobileNumber: value
                })} />
              </View>
              {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.mobileNumber}
              </FormControl.ErrorMessage> */}

            </FormControl>

          </View>


          {registerUserInfo?.success == false && <Text style={{ color: 'red', marginTop: 15 }}>{registerUserInfo?.message}</Text>}


          <Button onPress={() => { submitRegisterFrom() }} rounded={20} style={[styles.shadowBtn, { shadowColor: '#00acee', alignSelf: 'center', backgroundColor: '#4632A1', width: width / 2, justifyContent: 'center', marginTop: 80 }]}>
            <Text style={{ color: '#fff', }}>Register</Text>
          </Button>

          <Button style={{ alignSelf: 'center', width: width / 2, marginTop: 80 }} onPress={() => navigation.navigate('Login')}>Login</Button>


        </View>



      </ScrollView>

        : <OtpScreen resendOTP={resendOTP} disableTimer={disableTimer} setEnteredOTP={setEnteredOTP} number={formData?.mobileNumber} myOnpress={() => verifyPhoneOTP()} callResendPhoneOTPApi={() => callResendPhoneOTPApi()} />
      }



      <Spinner visible={isLoading} />
    </>
  )
}

const styles = StyleSheet.create({

  shadowBtn: {
    elevation: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: "#00008B",
    shadowOpacity: 0.3,
    shadowRadius: 2.54,
  },

  otpInputBox: {
    borderColor: "#FF1493",
    color: '#000',
  },
  higlightOnpress: {
    borderColor: "#03DAC6",
  }
});

export default RegisterScreen