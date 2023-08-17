import { Modal } from 'native-base'
import React from 'react'
import { StyleSheet } from 'react-native'

const ProfileInfoUpdateModal = (props) => {
    return (
        <>
            <Modal closeOnOverlayClick={false} isKeyboardDismissable={true} isOpen={props.isOpen} onClose={props.onClose} safeAreaTop={true}>
                <Modal.Content minWidth="345" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>{props.mHeader}</Modal.Header>
                    <Modal.Body style={{backgroundColor:'#f5f7fa'}}>
                        {props.mBody}
                    </Modal.Body>
                    {/* <Modal.Footer mt={5} justifyContent="center" alignItems="center"> */}
                       
                    {/* </Modal.Footer> */}
                </Modal.Content>
            </Modal>
        </>
    )
}

export default ProfileInfoUpdateModal

const styles = StyleSheet.create({

    top: {
        marginBottom: "auto",
        marginTop: 20
    },
})