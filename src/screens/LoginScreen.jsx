import { Button, FormControl, Input } from "native-base";
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OtpScreen from '../components/OtpScreen';
import { AuthContext } from '../context/AuthContext';
import { onUserLoginSubmit } from '../redux/slicers/loginSlicer';
import { onResendOTPSubmit } from '../redux/slicers/resendPhoneOTPSlicer';
import { onVerifyOTPSubmit } from '../redux/slicers/verifyPhoneOTPSlicer';

const { width, height } = Dimensions.get('screen');


const LoginScreen = ({ navigation }) => {
    let timer = 0;
    const { login, logout, test } = useContext(AuthContext);

    const dispatch = useDispatch();
    const [showPass, setShowPass] = useState(false);
    const [formData, setData] = useState({});
    const [errors, setErrors] = useState({});
    const [isValidMobileNo, setIsValidMobileNo] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [enteredOTP, setEnteredOTP] = useState();
    const [isLoginBtnClick, setIsLoginBtnClick] = useState(false);

    const [resendOTP, setResendOTP] = useState(false);
    const [disableTimer, setDisableTimer] = useState(120);
  
    const loginUserInfo = useSelector(state => state.loginReducer.data);
    const verifiedOtpInfo = useSelector(state => state.verifyPhoneOTPReducer.data);

    // const { test } = useContext(AuthContext); 
    // const test = useContext(AuthContext);

    const getPhoneOTP = () => {
        setIsLoginBtnClick(true)
        dispatch(onUserLoginSubmit({
            "email": formData.uId,
            "password": "",
            "fcm_id": "Development",
            "login_type": "mobile"
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
        dispatch(onVerifyOTPSubmit({
            "client_id": loginUserInfo?.info,
            "otp": enteredOTP,
            "section_type": "user",
            "_csrf": loginUserInfo?._csrf

        }))
    }

    const callResendPhoneOTPApi = () => {
        dispatch(onResendOTPSubmit({
            "mobile_number": formData.uId,

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


    const submitLoginFrom = () => {
        // console.log('Clicked -->');
        dispatch(onUserLoginSubmit({
            "email": formData.uId,
            "password": formData.password,
            "fcm_id": "Development",
            "login_type": "email"
        }))

    }


    useEffect(() => {

        if (loginUserInfo?.token && isValidEmail) {

            console.log(loginUserInfo, 'loginUserInfo -->');
            login(loginUserInfo?.token)
        }

    }, [loginUserInfo])

    useEffect(() => {

        if (verifiedOtpInfo?.token && isValidMobileNo) {

            console.log(verifiedOtpInfo, 'verifiedOtpInfo -->');
            login(verifiedOtpInfo?.token)
        }

    }, [verifiedOtpInfo])

    useEffect(() => {
        const indianNoRegex = /^[6-9]{1}[0-9]{9}$/;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        if (formData?.uId) {

            if (emailRegex.test(formData?.uId) === true) {
                console.log('It is a valid email -->');
                setIsValidEmail(true)
                setIsValidMobileNo(false)
            } else if (indianNoRegex.test(formData?.uId) === true) {
                setIsValidMobileNo(true)
                setIsValidEmail(false)
                console.log('It is a valid Mobile no -->');
            } else {
                setIsValidMobileNo(false)
                setIsValidEmail(false)
            }

        }
    }, [formData?.uId])






    return (
        <>


            {!isLoginBtnClick ? <ScrollView style={{ flex: 1, backgroundColor: '#ffffff', marginTop: 10 }}
                showsVerticalScrollIndicator={false}>


                <View style={{ padding: 40 }}>
                    <Text style={{ color: '#4632A1', fontSize: 34 }}>Login From</Text>

                    {/*From input  */}
                    <View style={{ marginTop: 50 }}>


                        <FormControl isInvalid={'uId' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Enter email/ Mobile no.</FormControl.Label>

                            <Input keyboardType='default' variant="underlined" placeholder="Enter email/ Mobile no." onChangeText={value => setData({
                                ...formData,
                                uId: value
                            })} />
                            {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.name}
                                </FormControl.ErrorMessage> */}

                        </FormControl>

                        {isValidEmail && <FormControl mt={5} isInvalid={'password' in errors} w="100%" maxW="300px"  >
                            <FormControl.Label>Enter Password</FormControl.Label>

                            <Input keyboardType='default' variant="underlined" placeholder="Enter your Password" onChangeText={value => setData({
                                ...formData,
                                password: value
                            })} type={showPass ? "text" : "password"} InputRightElement={<Button size="xs" rounded="none" w="1/6" h="full" onPress={() => setShowPass(!showPass)}>
                                {showPass ? "Hide" : "Show"}
                            </Button>} />
                            {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.name}
                                </FormControl.ErrorMessage> */}
                        </FormControl>}

                    </View>

                    {/*Login button isValidMobileNo*/}
                    <Button isDisabled={isValidEmail ? false : isValidMobileNo ? false : true} onPress={() => { isValidMobileNo ? getPhoneOTP() : submitLoginFrom() }} rounded={20} style={[styles.shadowBtn, { shadowColor: '#00acee', alignSelf: 'center', backgroundColor: '#4632A1', width: width / 2, justifyContent: 'center', marginTop: 80 }]}>
                        <Text style={{ color: '#fff', }}>Login</Text>
                    </Button>

                    <Button style={{ alignSelf: 'center', width: width / 2, marginTop: 80 }} onPress={() => navigation.navigate('Register')}>Register</Button>


                </View>


            </ScrollView>

                : <OtpScreen resendOTP={resendOTP} disableTimer={disableTimer} setEnteredOTP={setEnteredOTP} number={formData?.uId} myOnpress={() => verifyPhoneOTP()}  callResendPhoneOTPApi={() => callResendPhoneOTPApi()}  />
            }

            
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

export default LoginScreen