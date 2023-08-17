import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import AIcon from 'react-native-vector-icons/AntDesign';
import { callViewLawyerProfileDetailsApi } from '../../services/viewLawyerProfileDetailsApi';
import BarCouncilInfo from './BarCouncilInfo';
import ProfileInfo from './ProfileInfo';
import ExperienceInfo from './ExperienceInfo';
import EducationInfo from './EducationInfo';
import ExpertiseInfo from './ExpertiseInfo';
import AchivementsInfo from './AchivementsInfo';
import BankInfo from './BankInfo';
import FeesInfo from './FeesInfo';



const ProfileMain = () => {

  // Ddefault active selector
  const [activeSections, setActiveSections] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    callViewLawyerProfileDetailsApi().then((res) => {
      // const stringifyData = JSON.parse(res?.lawyer)
      setProfileData(res.lawyer)
      console.log(res.lawyer, 'resssss----')
    })
  }, [])
  // console.log(profileData.id, 'profileData----')


  const CONTENT = [
    {
      title: 'Bar Council Information',
      // content: <BarCouncilInfo lawyers={profileData?.lawyers ? profileData?.lawyers[0] : {} }/>,
      content:  profileData?.lawyers && <BarCouncilInfo lawyers={profileData?.lawyers[0] }/>,
    },
    {
      title: 'Profile Information',
      content:  profileData?.lawyer_profile_details && <ProfileInfo lawyerProfileInfo={profileData?.lawyer_profile_details[0] } lawyerKnownLang={profileData?.lawyer_language_knowns}/> ,
    },
    {
      title: 'Experience',
      content:  profileData?.lawyer_experiences && <ExperienceInfo lawyerExperiencesInfo={profileData?.lawyer_experiences } /> ,
      
    },
    {
      title: 'Education',
      content:  profileData?.education && <EducationInfo educationInfo={profileData?.education } /> ,
  
    },
    {
      title: 'Expertise', 
      content:  profileData?.practice_area_to_lawyers && <ExpertiseInfo expertiseInfo={profileData?.practice_area_to_lawyers } /> ,
    
    },
    {
      title: 'Achievements',
      content:  profileData?.lawyer_achivements && <AchivementsInfo achivementsInfo={profileData?.lawyer_achivements } /> ,
    },
    {
      title: 'Bank Details',
      content:  profileData?.lawyer_bank_details && <BankInfo lawyerBankInfo={profileData?.lawyer_bank_details[0] }/>,

    },
    {
      title: 'Your Charges/Fees',
      content:  profileData?.lawyer_fees && <FeesInfo lawyerFeesInfo={profileData?.lawyer_fees[0] }/>,
    },
  ];


  const setSections = (sections) => {
    //setting up a active section state
    // console.log(sections,'sections---->');
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    return (
      <View
        style={[styles.header, isActive ? styles.active : styles.inactive]} >
        <Text style={styles.headerText}>{section.title}</Text>
        <AIcon name={isActive ? 'up' : `down`} size={21} color='gray' />
      </View>
    );
  };

  const renderContent = (section, _, isActive) => {
    //Accordion Content view
    return (
      <View
        style={[styles.content, isActive ? styles.active : styles.inactive]} >
        {/* <Text
          style={{ textAlign: 'center' }}> */}
          {section.content}
        {/* </Text> */}
      </View>
    );
  };



  return (
    <>
      <Text>Profile</Text>


      <Accordion
        activeSections={activeSections}
        //for any default active section
        sections={CONTENT}
        //title and content of accordion
        touchableComponent={TouchableOpacity}
        expandMultiple={false}
        renderHeader={renderHeader}
        //Header Component(View) to render
        renderContent={renderContent}
        //Content Component(View) to render
        duration={400}
        onChange={setSections}
      />


    </>
  )
}

export default ProfileMain

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#F5FCFF',
  //   paddingTop: 30,
  // },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //  paddingHorizontal: 10 ,
    backgroundColor: '#F5FCFF',
    padding: 10,
    marginVertical: 5
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 14,
    // paddingVertical: 10,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },

});