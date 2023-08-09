import { Text } from 'native-base';
import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

const CommonTabsContentFlatList  = (props) => {
    

    return (
        <>


            <FlatList
                data={props.itemArray}
                contentContainerStyle={{ backgroundColor: 'white' }}
                renderItem={props.renderItem}
                onEndReached={props.fetchMoreCalls}
                onEndReachedThreshold={0.2}

                keyExtractor={(item, index) => index}
                // initialNumToRender={10}
                // maxToRenderPerBatch={10}
                ListEmptyComponent={<View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 11 }}>No Data Available</Text>
                </View>}
            />

            {props.isLoading ? (
                <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Text>Loading...</Text>
                    <ActivityIndicator />
                </View>
            ) : null}


        </>
    )
}

export default CommonTabsContentFlatList 

