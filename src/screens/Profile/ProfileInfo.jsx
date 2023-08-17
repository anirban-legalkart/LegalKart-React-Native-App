import { Flex, Text, VStack, Box, Divider, Heading, Stack, FormControl, WarningOutlineIcon, Button, Input, Select } from 'native-base';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Controller, useForm } from "react-hook-form";
import ProfileInfoUpdateModal from '../../components/ProfileInfoUpdateModal';

const ProfileInfo = ({ lawyerProfileInfo, lawyerKnownLang }) => {

    const [profileInfoEditModal, setProfileInfoEditModal] = useState(false);

    const { control, handleSubmit, setValue, getValues, watch, trigger, formState: { isValid, errors } } = useForm({
        defaultValues: {

            profileHeadline: '',
            designation: '',
            yearOfExp: '',

        }
    });

    return (
        <>
            <View style={{ display: 'flex', alignSelf: 'flex-end', paddingRight: 15, marginBottom: 10 }} >

                <Text
                    fontSize="md" _light={{
                        color: "violet.500"
                    }} _dark={{
                        color: "violet.400"
                    }} fontWeight="extrabold" ml="-0.5" mt="-1" onPress={() => { setProfileInfoEditModal(true) }}>
                    Edit
                </Text>
            </View>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Few Lines About You: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.profile_headline} </Text>
            </Text>

            <Text s fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Designation: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.designation} </Text>
            </Text>
            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Professional Summary: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.professional_summary} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Practicing Since: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.practicing_since} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Profile URL: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.profile_url} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Address: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.address} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Your Chamber Address: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.chamber_address} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Languages Known:   {lawyerKnownLang.map((n, i) => <Text _light={{ color: "gray.500" }} fontWeight="semibold">{n?.language_list?.name} {i == 0 && ','}  </Text>)}
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Facebook: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.address} </Text>
            </Text>

            <Text fontSize="sm" style={{ marginBottom: 5, maxWidth: 300 }} _light={{
                color: "black"
            }} fontWeight="bold" ml="-0.5" mt="-1">
                Twitter: <Text _light={{ color: "gray.500" }} fontWeight="semibold">{lawyerProfileInfo?.address} </Text>
            </Text>


            <ProfileInfoUpdateModal isOpen={profileInfoEditModal} mHeader={'Profile Information'} onClose={() => { setProfileInfoEditModal(false) }} submitBtnText={'Set Schedule'}
                onSubmitPress={() => { setProfileInfoEditModal(false) }}
                mBody={
                    <>

                        <Box padding={5} marginY={5} maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                            borderColor: "coolGray.600",
                            backgroundColor: "gray.700"
                        }} _web={{
                            shadow: 2,
                            borderWidth: 0
                        }} _light={{
                            backgroundColor: "gray.50"
                        }}>

                            <FormControl isRequired isInvalid={'profileHeadline' in errors} w="100%" maxW="300px"  >
                                <FormControl.Label>Few Lines About You</FormControl.Label>

                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (

                                        <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Please Enter Few Lines About You " onChangeText={onChange} onBlur={onBlur} />
                                    )}
                                    name="profileHeadline"
                                />

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.profileHeadline?.type === 'required' && `Please Enter Few Lines About You `}

                                </FormControl.ErrorMessage>

                            </FormControl>

                            <FormControl isRequired isInvalid={'designation' in errors} w="100%" maxW="300px"  >
                                <FormControl.Label>Designation</FormControl.Label>

                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (

                                        <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Please Enter Designation " onChangeText={onChange} onBlur={onBlur} />
                                    )}
                                    name="designation"
                                />

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.designation?.type === 'required' && ` Designation is required`}

                                </FormControl.ErrorMessage>

                            </FormControl>

                            <FormControl isRequired isInvalid={'yearOfExp' in errors} w="100%" maxW="300px"  >
                                <FormControl.Label>Year Of Experience</FormControl.Label>

                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (

                                        <Input autoCapitalize='none' value={value} maxLength={80} keyboardType='default' variant="underlined" placeholder="Please Enter Experience " onChangeText={onChange} onBlur={onBlur} />
                                    )}
                                    name="yearOfExp"
                                />

                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {errors.yearOfExp?.type === 'required' && ` Year Of Experience is required`}

                                </FormControl.ErrorMessage>

                            </FormControl>


                           




                            <Button
                                style={[{ display: 'flex', alignSelf: 'center', justifyContent: 'center', backgroundColor: 'orange', marginTop: 15 }]}
                                onPress={() => { }}
                            >
                                Update
                            </Button>

                        </Box>
                    </>
                }
            />

        </>
    )
}

export default ProfileInfo