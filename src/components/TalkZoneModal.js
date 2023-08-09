import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Button, Modal } from 'native-base'

const TalkZoneModal = (props) => {
    return (
        <>
            <Modal closeOnOverlayClick={false} isKeyboardDismissable={true} isOpen={props.isOpen} onClose={props.onClose} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles['top']}>
                    <Modal.CloseButton />
                    <Modal.Header>{props.mHeader}</Modal.Header>
                    <Modal.Body>
                        {props.mBody}
                    </Modal.Body>
                    <Modal.Footer mt={5} justifyContent="center" alignItems="center">
                        <Button.Group space={6} >
                            {props.onCancelPress && <Button variant="outline" colorScheme="blueGray" onPress={props.onCancelPress}>
                                {props.cancelBtnText ? props.cancelBtnText : 'Cancel'}
                            </Button>}

                            {props.onSubmitPress && <Button
                                style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', }]}
                                onPress={props.onSubmitPress}
                            >
                                {props.submitBtnText}
                            </Button>}
                        </Button.Group>
                        {props.footerText}
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default TalkZoneModal

const styles = StyleSheet.create({

    top: {
        marginBottom: "auto",
        marginTop: 20
    },
})