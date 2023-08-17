import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner';
import { onGetScheduleCallListDetailsSubmit } from '../../redux/slicers/getScheduleCallListDetailsSlicer';
import { onGetTakeCallStatusSubmit } from '../../redux/slicers/getTakeCallStatusSlicer';
import { onGetTalkZoneDetailsSubmit } from '../../redux/slicers/getTalkZoneDetailsSlicer';
import { callViewLawyerProfileByTypeApi } from '../../services/viewLawyerProfileByTypeApi';
import TabsContentFlatList from '../../components/TabsContentFlatList';
import GenerateRecentsCallsRow from './GenerateRecentsCallsRow';
import GeneratedRequestCallsRow from './GeneratedRequestCallsRow';
import GeneratedUpcomingCallsRow from './GeneratedUpcomingCallsRow';
import HeaderSec from './HeaderSec';
const { width, height } = Dimensions.get('screen');


const initialLayout = { width: Dimensions.get('window').width };






const MainScreen = (props) => {
  const dispatch = useDispatch();
  const { route: { params }, navigation } = props;

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'first', title: 'Recents Calls' },
    { key: 'second', title: 'Upcoming Calls' },
    { key: 'third', title: 'Request' },
  ])
  const [isTakeCallsActive, setIsTakeCallsActive] = useState();
  const [talkZoneData, setTalkZoneData] = useState({});
  const [originalCallRate, setOriginalCallRate] = useState('');
  const [recentsCallsInfo, setRecentsCallsInfo] = useState([]);
  const [upcomingCallsInfo, setUpcomingCallsInfo] = useState([]);
  const [requestCallsInfo, setRequestCallsInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const [pageRecentToCall, setPageRecentToCall] = useState({
    page: 1,
    totalPage: 0,
    isLoadMoreData: false
  });
  const [pageUpcomingToCall, setPageUpcomingToCall] = useState({
    page: 1,
    totalPage: 0,
    isLoadMoreData: false
  });
  const [pageRequestToCall, setPageRequestToCall] = useState({
    page: 1,
    totalPage: 0,
    isLoadMoreData: false
  });



  const talkZoneDetailsInfo = useSelector(state => state.getTalkZoneDetailsReducer.data);
  // const takeCallStatusInfo = useSelector(state => state.getTakeCallStatusReducer.data);
  const scheduleCallListDetailsInfo = useSelector(state => state.getScheduleCallListDetailsReducer.data);


  
  const callGetTalkZoneDetailApi = () => {
    // console.log('api is callled----');
    dispatch(onGetTalkZoneDetailsSubmit({
      "page": pageRecentToCall.page,
      "limitItem": 10
    }))
  }

  const callGetUpcomingCallDetailApi = (resetPg) => {
    dispatch(onGetScheduleCallListDetailsSubmit({
      "page": resetPg || pageUpcomingToCall.page,
      "scheduleCallType": 'A'
    }))
  }

  const callGetRequestCallDetailApi = () => {
    dispatch(onGetScheduleCallListDetailsSubmit({
      "page": pageRequestToCall.page,
      "scheduleCallType": 'W'
    }))
  }

  const getCurrentCallRate = async () => {
    await callViewLawyerProfileByTypeApi({ type: "Fees" })
      .then((res) => {
        // console.log(res?.lawyer.lawyer_fees[0]?.phn_consult_fees, 'resssss---- fees')
        setOriginalCallRate(res?.lawyer?.lawyer_fees[0]?.phn_consult_fees)
      })

  }


  useEffect(() => {
    setIsLoading(true)
    // console.log('useEffect is called------??');
    callGetTalkZoneDetailApi()
    // dispatch(onGetTakeCallStatusSubmit())
    getCurrentCallRate()
  }, [])


  useEffect(() => {
    // setRecentsCallsInfo([])//
    // setPageRecentToCall({
    //   ...pageRecentToCall,
    //   page: 1,
    // });//


    setUpcomingCallsInfo([])//
    setPageUpcomingToCall({
      ...pageUpcomingToCall,
      page: 1,
    });//

    setRequestCallsInfo([])//
    setPageRequestToCall({
      ...pageRequestToCall,
      page: 1,
    });//

    if (index == 1) {
      setIsLoading(true)
      callGetUpcomingCallDetailApi()
    } else if (index == 2) {
      setIsLoading(true)
      callGetRequestCallDetailApi()
    }
  }, [index])


  useEffect(() => {

    setTalkZoneData(talkZoneDetailsInfo)
    setPageRecentToCall({ ...pageRecentToCall, totalPage: talkZoneDetailsInfo?.total_pages })

    if (recentsCallsInfo?.length > 0 && pageRecentToCall.isLoadMoreData) {
      // console.log('Inside 1st IFFF')
      setRecentsCallsInfo([...recentsCallsInfo, ...talkZoneDetailsInfo?.calling_list])
      setPageRecentToCall({
        ...pageRecentToCall,
        isLoadMoreData: false
      });//
    } else {
      // console.log('Inside 2nd IFFF')
      setRecentsCallsInfo(talkZoneDetailsInfo?.calling_list)
      setIsLoading(false)
    }
    // console.log(talkZoneDetailsInfo, 'talkZoneDetailsInfo----')
  }, [talkZoneDetailsInfo])


  useEffect(() => {
    if (index == 1) {
      setPageUpcomingToCall({ ...pageUpcomingToCall, totalPage: scheduleCallListDetailsInfo?.total_pages })
      if (upcomingCallsInfo?.length > 0) {
        // console.log('Inside 1st IFFF');
        setUpcomingCallsInfo([...upcomingCallsInfo, ...scheduleCallListDetailsInfo?.scheduled_list])
      } else {
        // console.log('Inside 2nd IFFF');
        setUpcomingCallsInfo(scheduleCallListDetailsInfo?.scheduled_list)
        setIsLoading(false)
      }
    } else if (index == 2) {
      setPageRequestToCall({ ...pageRequestToCall, totalPage: scheduleCallListDetailsInfo?.total_pages })
      if (requestCallsInfo?.length > 0) {
        // console.log('Inside 1st IFFF')
        setRequestCallsInfo([...requestCallsInfo, ...scheduleCallListDetailsInfo?.scheduled_list])
      } else {
        // console.log('Inside 2nd IFFF')
        setRequestCallsInfo(scheduleCallListDetailsInfo?.scheduled_list)
        setIsLoading(false)
      }

    }
    // console.log(scheduleCallListDetailsInfo, 'scheduleCallListDetailsInfo');
  }, [scheduleCallListDetailsInfo])

  // useEffect(() => {
  //   if (takeCallStatusInfo?.call_service_slot_details) {
  //     setIsTakeCallsActive(takeCallStatusInfo?.call_service_slot_details?.active_status)
  //     setIsLoading(false)
  //   }
  //   // console.log(takeCallStatusInfo?.call_service_slot_details, 'talkZoneDetailsInfo----')
  // }, [takeCallStatusInfo])

  
  useEffect(() => {
    if (pageRecentToCall.isLoadMoreData) {
      console.log(pageRecentToCall, 'api csallllleeddd--->>>----')

      callGetTalkZoneDetailApi()
      // setPageRecentToCall({
      //   ...pageRecentToCall,
      //   isLoadMoreData: false
      // });
    }

    if (pageUpcomingToCall.isLoadMoreData) {
      // console.log(pageUpcomingToCall, 'api csallllleeddd--->>>----')

      callGetUpcomingCallDetailApi()
      setPageUpcomingToCall({
        ...pageUpcomingToCall,
        isLoadMoreData: false
      });
    }

    if (pageRequestToCall.isLoadMoreData) {
      // console.log(pageRequestToCall, 'api csallllleeddd--->>>----')

      callGetRequestCallDetailApi()
      setPageRequestToCall({
        ...pageRequestToCall,
        isLoadMoreData: false
      });
    }

  }, [pageRecentToCall.page, pageUpcomingToCall.page, pageRequestToCall.page])


  const fetchMoreCalls = () => {

    if (index == 0 && pageRecentToCall.totalPage > pageRecentToCall.page) {

      pageRecentToCall.page++;

      setPageRecentToCall({
        ...pageRecentToCall,
        page: pageRecentToCall.page,
        isLoadMoreData: true
      });

    }

    if (index == 1 && pageUpcomingToCall.totalPage > pageUpcomingToCall.page) {

      pageUpcomingToCall.page++;

      setPageUpcomingToCall({
        ...pageUpcomingToCall,
        page: pageUpcomingToCall.page,
        isLoadMoreData: true
      });

    }

    if (index == 2 && pageRequestToCall.totalPage > pageRequestToCall.page) {

      pageRequestToCall.page++;

      setPageRequestToCall({
        ...pageRequestToCall,
        page: pageRequestToCall.page,
        isLoadMoreData: true
      });

    }


  };

  
  const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]} >

      <TabsContentFlatList
        itemArray={recentsCallsInfo}
        renderItem={({ item }) => (

          <GenerateRecentsCallsRow
            item={item}
            key={item.client_id}
            originalCallRate={originalCallRate}
            recentsCallsInfo={recentsCallsInfo}
            setRecentsCallsInfo={setRecentsCallsInfo}
          />
          // console.log(item,'item--->')
        )}

        fetchMoreCalls={() => fetchMoreCalls()}
        isLoading={pageRecentToCall.isLoadMoreData}

      />
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]} >

      <TabsContentFlatList
        itemArray={upcomingCallsInfo}
        renderItem={({ item }) => (

          <GeneratedUpcomingCallsRow
            item={item}
            key={item.id}
            setUpcomingCallsInfo={setUpcomingCallsInfo}
            setPageUpcomingToCall={setPageUpcomingToCall}
            pageUpcomingToCall={pageUpcomingToCall}
            callGetUpcomingCallDetailApi={() => callGetUpcomingCallDetailApi()}
          />
          // console.log(item,'item--->')
        )}
        isLoading={pageUpcomingToCall.isLoadMoreData}

      />
    </View>
  );

  const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]} >

      <TabsContentFlatList
        itemArray={requestCallsInfo}
        renderItem={({ item }) => (

          <GeneratedRequestCallsRow
            item={item}
            key={item.id}
            requestCallsInfo={requestCallsInfo}
            setRequestCallsInfo={setRequestCallsInfo}
          />
          // console.log(item,'item--->')
        )}
        isLoading={pageRequestToCall.isLoadMoreData}
      />

    </View>
  );


  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    <>
      <SafeAreaProvider>

        {/* <View style={{ flex: 1 }}> */}
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 20 }}>
          {/* <ScrollView style={{  backgroundColor: '#ffffff', padding: 20 }}
         showsVerticalScrollIndicator={false} >  */}
          <SafeAreaView
            edges={['top']}>

            <HeaderSec talkZoneData={talkZoneData} params={params} navigation={navigation}/>

          </SafeAreaView>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
          // style={styles.container}
          />

        </View>
      </SafeAreaProvider>

      <Spinner visible={isLoading} />

      
    </>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    fontSize: 13,
    flexWrap: 'wrap',
    // color: Colors.text,
    // minWidth: Dimensions.get('window').width < 375 ? '100%' : '60%'
  },
  scene: {
    flex: 1,
  },

  top: {
    marginBottom: "auto",
    marginTop: 20
  },
})