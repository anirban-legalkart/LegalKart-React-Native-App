
import { Modal } from 'native-base';
import React from 'react';
import { ActivityIndicator } from "react-native";

function Spinner({ visible }) {
    return (
        <>

            <Modal isOpen={visible} isKeyboardDismissable={false} >
                <Modal.Content maxWidth="500px" height={"100px"} style={{ display:'flex', justifyContent:'center' }}>
                <ActivityIndicator size="large"  />

                </Modal.Content>
            </Modal>

        </>
    )
}

export default Spinner;