import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
    const { logout, test } = useContext(AuthContext);

    return (
        <View>
            <Text style={{fontSize:50}}>HomeScreen</Text>

            <TouchableOpacity style={{
                alignItems: 'center',
                backgroundColor: '#DDDDDD',
                padding: 10,
            }} onPress={() => logout()}>
                <Text>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen