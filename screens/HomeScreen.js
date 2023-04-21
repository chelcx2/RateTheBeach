import {StyleSheet, Text, View, Image, ScrollView, Button} from 'react-native';
import React, {useState, useEffect} from 'react';
import Poll from '../components/Poll';
import CreatePoll from '../components/CreatePoll';
import addPoll from '../components/CreatePoll';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../firebase';

const HomeScreen = () => {
  //data for home screen to load
  const [feedData, setFeedData] = useState([]);

  //page number for pagination
  const [page, setPage] = useState(1);

  //state to show/hide the create poll form
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  const loadMoreData = async () => {
    newData = [];

    // Fetch data from your collection
    const pollsRef = collection(db, 'polls');
    const snapshot = await getDocs(pollsRef);

    // Map over the array of documents to create an array of objects
    snapshot.forEach(doc => {
      const pollData = doc.data();
      const options = Object.values(pollData.options);

      newData.push({
        question: pollData.question,
        options: options,
      });
    });

    setFeedData([...feedData, ...newData]);
    setPage(page + 1);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <ScrollView>
      <Text>HomeScreen</Text>
      <Image source={require('../RateTheBeach.png')} style={styles.logo} />
      {/*  Show the create poll form if showCreatePoll is true */}
      {showCreatePoll ? (
        <View style={styles.pollContainer}>
          <CreatePoll addPoll={addPoll} setShowCreatePoll={setShowCreatePoll} />
        </View>
      ) : (
        <Button title="Add Poll" onPress={() => setShowCreatePoll(true)} />
      )}
      {feedData.map((item, index) => (
        <View key={index} style={styles.pollContainer}>
          <Poll question={item.question} options={item.options} />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Load More" onPress={loadMoreData} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: 550,
    height: 250,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  pollContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 50,
  },
});
