
import { Box, Button, FormControl, HStack, Heading, Input, Modal, VStack } from "native-base";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhoneInput from "react-native-phone-number-input";
import AIcon from 'react-native-vector-icons/dist/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import OtpScreen from '../components/OtpScreen';
import Spinner from '../components/Spinner';
import { AuthContext } from "../context/AuthContext";
import { countryCodeWithSvgFlagData } from "../model/data";
import { onGetLawyerProfileDetailsSubmit } from "../redux/slicers/getLawyerProfileDetailsSlicer";
import { onUserRegisterSubmit, resetRegisterInfo } from '../redux/slicers/registerSlicer';
import { onResendOTPSubmit } from '../redux/slicers/resendPhoneOTPSlicer';
import { onVerifyRegisterOTPSubmit } from '../redux/slicers/verifyRegisterPhoneOTPSlicer';

const { width, height } = Dimensions.get('screen');


const RegisterScreen = ({ navigation }) => {
  let timer = 0;
  const { login, logout, test } = useContext(AuthContext);
  const phoneInput = useRef(null);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setData] = useState({});
  const [isValidMobileNo, setIsValidMobileNo] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [countryCode, setCountryCode] = useState('+91');
  const [errors, setErrors] = useState({});
  const [isRegisterBtnClick, setIsRegisterBtnClick] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState();
  const [showModal, setShowModal] = useState(false);

  const [resendOTP, setResendOTP] = useState(false);
  const [disableTimer, setDisableTimer] = useState(120);

  const registerUserInfo = useSelector(state => state.registerReducer.data);
  const registerVerifiedOtpInfo = useSelector(state => state.verifyRegisterPhoneOTPReducer.data);

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

  useEffect(() => {
    enteredOTP?.length > 5 && verifyPhoneOTP()
  }, [enteredOTP])

  useEffect(() => {
    const indianNoRegex = /^[6-9]{1}[0-9]{9}$/;

    if (formData?.mobileNumber) {

      if (indianNoRegex.test(formData?.mobileNumber) === true) {
        setIsValidMobileNo(true)
        console.log('It is a valid Mobile no -->');
      } else {
        setIsValidMobileNo(false)
      }

    }

    dispatch(resetRegisterInfo())
  }, [formData?.mobileNumber])

  const onPressList = (item, index) => {
    setCountryCode(item.number)
    setShowModal(false)
  }

  useEffect(() => {

    if (registerVerifiedOtpInfo?.token && isValidMobileNo) {
      dispatch(onGetLawyerProfileDetailsSubmit())

      login(registerVerifiedOtpInfo?.token)
    }
  }, [registerVerifiedOtpInfo])


  function handleBackButtonClick() {
    navigation.goBack()
    setIsRegisterBtnClick(false)
    return true;
  }
  
  useEffect(() => {
    // console.log('BackHandler called---');
    setIsRegisterBtnClick(false)
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [])

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
                marginTop: 10
              }}>
               
                {/* <Button mr={3} endIcon={<AIcon name={`down`} size={15} color='#fff' />} onPress={() => setShowModal(true)}>{countryCode}</Button> */}

                <PhoneInput
                  ref={phoneInput}
                  defaultCode='IN'
                  layout="first"
                  onChangeText={(text) => {
                    // console.log(text,'text --->')
                    setData({
                      ...formData,
                      mobileNumber: text
                    })
                  }}
                  onChangeFormattedText={(text) => {
                    // setFormattedValue(text);
                  }}
                  withShadow
                  autoFocus
                />

                {/* <Input keyboardType='number-pad' maxLength={10} width={'80%'} variant="underlined" placeholder={'Enter Mobile no.'} onChangeText={value => setData({
                  ...formData,
                  mobileNumber: value
                })} /> */}
              </View>
              {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.mobileNumber}
              </FormControl.ErrorMessage> */}

            </FormControl>

          </View>


          {registerUserInfo?.success == false && <Text style={{ color: 'red', marginTop: 15 }}>{registerUserInfo?.message}</Text>}


          <Button isDisabled={isValidMobileNo ? false : true} onPress={() => { submitRegisterFrom() }} rounded={20} style={[styles.shadowBtn, { shadowColor: '#00acee', alignSelf: 'center', backgroundColor: '#4632A1', width: width / 2, justifyContent: 'center', marginTop: 80 }]}>
            <Text style={{ color: '#fff', }}>Register</Text>
          </Button>

          <Button style={{ alignSelf: 'center', width: width / 2, marginTop: 80 }} onPress={() => navigation.navigate('Login')}>Login</Button>


        </View>



      </ScrollView>

        : <OtpScreen disableVerifyBtn={enteredOTP?.length > 5 ? false : true} countryCode={countryCode} resendOTP={resendOTP} disableTimer={disableTimer} setEnteredOTP={setEnteredOTP} number={formData?.mobileNumber} myOnpress={() => verifyPhoneOTP()} callResendPhoneOTPApi={() => callResendPhoneOTPApi()} />
      }


      {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <VStack p={6} >
            
            <Input my={7} placeholder="Search by country name..." width="100%" borderRadius="4" py="3" px="3" fontSize="14" InputLeftElement={<AIcon name={`search1`} size={22} color='gray' />} onChangeText={value => setSearchText(value)} />

            <Heading fontSize="lg">Select your country</Heading>
            <FlatList data={countryCodeWithSvgFlagData.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase()))} renderItem={({ item, index }) => <Box borderBottomWidth="1" _dark={{
              borderColor: "gray.600"
            }} borderColor="coolGray.200" py="2"  >
              <TouchableOpacity
                onPress={() => onPressList(item, index)}
              >
                <HStack mb={2} justifyContent="space-between" style={{ display: 'flex', justifyContent: 'space-between' }}>

                  <Text color="coolGray.700" bold >
                    {item?.name}
                  </Text>

                  <Text style={styles.itemStyle} color="coolGray.800" bold >
                    {item?.number}
                  </Text>
                </HStack>
              </TouchableOpacity>
            </Box>} keyExtractor={item => item.number} />

          </VStack>
        </Modal.Content>
      </Modal> */}


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
  },

  itemStyle: {
    // maxWidth: 250,
    // marginLeft: 20,
    // position: "absolute",
    // right: 0
  }
});

export default RegisterScreen