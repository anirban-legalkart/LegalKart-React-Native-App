import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { onGetLawyerProfileDetailsSubmit } from '../redux/slicers/getLawyerProfileDetailsSlicer';

const HomeScreen = ({ navigation }) => {
    const { logout, test } = useContext(AuthContext);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    
    const lawyerProfileDetailsInfo = useSelector(state => state.getLawyerProfileDetailsReducer.data);
    
    useEffect(() => {
        dispatch(onGetLawyerProfileDetailsSubmit())
    }, [])

    useEffect(() => {
        if (lawyerProfileDetailsInfo?.success) {
            const parseData = JSON.parse(lawyerProfileDetailsInfo?.user)
            parseData?.login_first_status == 0 && navigation.navigate('RegisterProfile')
            setIsLoading(false)
        }

    }, [lawyerProfileDetailsInfo])

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 10000)
    }, [isLoading])

    return (
        <>

            <View>
                <Text style={{ fontSize: 50 }}>HomeScreen</Text>

                <TouchableOpacity style={{
                    alignItems: 'center',
                    backgroundColor: '#DDDDDD',
                    padding: 10,
                }} onPress={() => logout()}>
                    <Text>
                        Logout
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    alignItems: 'center',
                    backgroundColor: 'purple',
                    marginTop: 45,
                    padding: 10,
                }} onPress={() => navigation.navigate('TalkZone')}>
                    <Text style={{color:'#fff', fontWeight:'bold'}}>
                        Talk zone
                    </Text>
                </TouchableOpacity>
            </View>

            <Spinner visible={isLoading} />
        </>
    )
}

export default HomeScreen