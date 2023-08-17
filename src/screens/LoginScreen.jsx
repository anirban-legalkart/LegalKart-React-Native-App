import { Button, FormControl, Input } from "native-base";
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OtpScreen from '../components/OtpScreen';
import { AuthContext } from '../context/AuthContext';
import { onUserLoginSubmit } from '../redux/slicers/loginSlicer';
import { onResendOTPSubmit } from '../redux/slicers/resendPhoneOTPSlicer';
import { onVerifyOTPSubmit, resetVerifyInfo } from '../redux/slicers/verifyPhoneOTPSlicer';
import { onGetLawyerProfileDetailsSubmit } from "../redux/slicers/getLawyerProfileDetailsSlicer";
import Carousel from 'react-native-reanimated-carousel';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get('screen');

const carouselData = [
    {
        title: 'Case Updates',
        subText: 'Just add your case in simple and never miss a Case update',
        imgUri: require("../assets/images/login-bg1.png")
    },
    {
        title: 'Clients',
        subText: 'Manage and aquire new clients today. update them with real-time updates like never before',
        imgUri: require("../assets/images/login-bg1.png")
    },
    {
        title: 'Legalkart Services',
        subText: 'Just add your case in simple and never miss a Case update',
        imgUri: require("../assets/images/login-bg1.png")
    }
]

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
    const [isWelcomeBtnClick, setIsWelcomeBtnClick] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

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

            dispatch(onGetLawyerProfileDetailsSubmit())

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



    useEffect(() => {
        enteredOTP?.length > 5 && verifyPhoneOTP()
        dispatch(resetVerifyInfo())
    }, [enteredOTP])



    return (
        <>


            <KeyboardAwareScrollView
                extraScrollHeight={250} enableOnAndroid={true}
                keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>


                <View style={styles.container}>
                    <View style={{ marginTop: 30, paddingLeft: 22, paddingRight: 22, }}>

                        <View style={{ flex: 1 }}>
                            <Carousel
                                loop
                                width={width}
                                height={width + 30}
                                autoPlay={true}
                                data={carouselData}
                                scrollAnimationDuration={1000}
                                onSnapToItem={(index) => setCarouselIndex(index)}
                                // sliderWidth={width}
                                // itemWidth={width / 3}
                                renderItem={({ item, index }) => (
                                    <View
                                        style={{
                                            width: '85%'
                                        }}>
                                        <Text style={{ fontSize: 26, fontWeight: 600, fontFamily: 'Rubik', color: '#222124' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 400, fontFamily: 'Rubik', marginTop: 16, color: 'rgba(34, 33, 36, 0.90)', lineHeight: 21.52 }}>
                                            {item.subText}
                                        </Text>
                                        {/* <Image style={styles.sliderLogo} source={require("../assets/images/login-bg1.png")} /> */}
                                        <Image style={styles.sliderLogo} source={item.imgUri} />

                                    </View>

                                )}
                            />
                            <View style={{ marginTop: 15, alignItems: 'center' }}>

                                <AnimatedDotsCarousel
                                    length={carouselData.length}
                                    currentIndex={carouselIndex}
                                    maxIndicators={4}
                                    interpolateOpacityAndColor={true}
                                    activeIndicatorConfig={{
                                        color: 'red',
                                        margin: 3,
                                        opacity: 1,
                                        size: 8,
                                    }}
                                    inactiveIndicatorConfig={{
                                        color: 'gray',
                                        margin: 3,
                                        opacity: 0.5,
                                        size: 8,
                                    }}
                                    decreasingDots={[
                                        {
                                            config: { color: 'gray', margin: 3, opacity: 0.5, size: 6 },
                                            quantity: 1,
                                        },
                                        {
                                            config: { color: 'gray', margin: 3, opacity: 0.5, size: 4 },
                                            quantity: 1,
                                        },
                                    ]}
                                />
                            </View>
                        </View>

                    </View>

                    {/*From input  */}
                    {/* <View style={{ marginTop: 50 }}> */}
                    {!isLoginBtnClick ? <View style={styles.commoncard}>

                        {/* first step */}
                        {!isWelcomeBtnClick ? <View style={styles.cmncard}>
                            <Text style={{ fontSize: 15, fontWeight: 500, fontFamily: 'Rubik', color: 'rgba(34, 33, 36, 0.90)', paddingLeft: 108, }}>Welcome to</Text>
                            <Image style={styles.lkLogo} source={require("../assets/images/logo.png")} />
                            <Button style={styles.commonLoginBtn} onPress={() => { setIsWelcomeBtnClick(true) }}>
                                <Text style={{ color: '#fff', fontWeight: 600, fontSize: 16, fontFamily: 'Rubik' }}>Login/Signup</Text>
                            </Button>
                            <Text style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Rubik', color: 'rgba(34, 33, 36, 0.70)', textAlign: 'center' }}>By continuing you accept our <Text style={{ color: '#FFA100' }}>T&C</Text> and <Text style={{ color: '#FFA100' }}>Privacy policy</Text></Text>
                        </View>
                            /* first step */

                            : <View style={styles.cmncard}>
                                <FormControl isInvalid={'uId' in errors} w="100%" maxW="300px"  >
                                    <FormControl.Label style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Rubik', marginBottom: 16, color: 'rgba(34, 33, 36, 0.90)' }}>Enter email/ Mobile no.</FormControl.Label>

                                    <Input style={styles.inputBox} autoCapitalize='none' value={formData?.uId} maxLength={formData?.uId?.length > 4 && /^\d+$/.test(formData?.uId) ? 10 : 80} keyboardType='default' variant="unstyled" placeholder="Enter email/ Mobile no." onChangeText={value => setData({
                                        ...formData,
                                        uId: value
                                    })} />
                                    {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.name}
                                </FormControl.ErrorMessage> */}

                                </FormControl>

                                {isValidEmail && <View style={{ marginTop: 14 }}>
                                    <FormControl mt={5} isInvalid={'password' in errors} w="100%" maxW="300px"  >
                                        <FormControl.Label style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Rubik', marginBottom: 16, color: 'rgba(34, 33, 36, 0.90)' }}>Enter Password</FormControl.Label>

                                        <Input style={styles.inputBox} keyboardType='default' variant="unstyled" placeholder="Enter your Password" onChangeText={value => setData({
                                            ...formData,
                                            password: value
                                        })} type={showPass ? "text" : "password"} InputRightElement={<Button style={styles.password} size="xs" rounded="none" w="1/6" h="full" onPress={() => setShowPass(!showPass)}>
                                            {showPass ? "Hide" : "Show"}
                                        </Button>} />
                                        {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.name}
                                </FormControl.ErrorMessage> */}
                                    </FormControl>
                                </View>}

                                <Button style={styles.commonLoginBtn} isDisabled={isValidEmail ? false : isValidMobileNo ? false : true} onPress={() => { isValidMobileNo ? getPhoneOTP() : submitLoginFrom() }}>
                                    <Text style={{ color: '#fff', fontWeight: 600, fontSize: 16, fontFamily: 'Rubik' }}>Login</Text>
                                </Button>
                                <Text style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Rubik', color: 'rgba(34, 33, 36, 0.70)', textAlign: 'center' }}>New to Legalkart ? <Text style={{ color: '#FFA100' }} onPress={() => navigation.navigate('Register')}
                                >Sign up</Text></Text>

                            </View>}


                    </View>
                        : <View style={styles.commoncard}>
                            <OtpScreen verifiedOtpInfo={verifiedOtpInfo} disableVerifyBtn={enteredOTP?.length > 5 ? false : true} resendOTP={resendOTP} disableTimer={disableTimer} setEnteredOTP={setEnteredOTP} number={formData?.uId} goToLogin={() => { setIsLoginBtnClick(false), setIsValidMobileNo(false), setData({}) }} myOnpress={() => verifyPhoneOTP()} callResendPhoneOTPApi={() => callResendPhoneOTPApi()} />
                        </View>
                    }


                </View>


            </KeyboardAwareScrollView>
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

    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingLeft: 22,
        // paddingRight: 22,
        paddingTop: 16,
    },
    sliderLogo: {
        // width: 335,
        // height: 291,
        marginTop: 50,
        width: "100%", height: 250,
    },
    cmnFont: {
        fontFamily: 'Rubik',
    },
    primaryColor: {
        color: '#222124',
    },
    lkLogo: {
        width: 246,
        height: 48,
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    commoncard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 34,
        marginBottom: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 17,
        overflow: 'hidden',
        elevation: 20,
        marginTop: 62,
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
    inputBox: {
        height: 50,
        borderColor: 'rgba(254, 185, 65, 0.70)',
        borderWidth: 0.6,
        borderStyle: 'solid',
        borderRadius: 6,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    password: {
        // backgroundColor: 'transparent',
        // color: '#000000',
        position: 'absolute',
        right: 0,
    }
});

export default LoginScreen