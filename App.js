// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Picker } from "@react-native-picker/picker";

const Tab = createBottomTabNavigator();

const SaveSplitScreen = ({ onSaveSplit, savedSplits }) => {
  const [currentSplit, setCurrentSplit] = useState("");
  const [currentExercise, setCurrentExercise] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleSaveSplit = () => {
    const newSplit = {
      name: currentSplit,
      exercises: [...exercises], // Create a copy of the exercises array
    };
    onSaveSplit(newSplit);
    setCurrentSplit("");
    setExercises([]);
  };

  const handleAddExercise = () => {
    if (currentExercise.trim() !== "") {
      const newExercise = {
        name: currentExercise,
        logs: [
          {
            sets: 0,
            reps: 0,
            weight: 0,
          },
        ],
      };
      setExercises((prevExercises) => [...prevExercises, newExercise]);
      setCurrentExercise("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Save Split Screen</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gym Split:</Text>
        <TextInput
          style={styles.input}
          value={currentSplit}
          onChangeText={setCurrentSplit}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Exercise:</Text>
        <TextInput
          style={styles.input}
          value={currentExercise}
          onChangeText={setCurrentExercise}
        />
      </View>

      <Button title="Add Exercise" onPress={handleAddExercise} />

      <View style={styles.exerciseList}>
        <Text style={styles.subheader}>Exercises:</Text>
        {exercises.map((exercise, index) => (
          <Text key={index} style={styles.exerciseItem}>
            {exercise.name}
          </Text>
        ))}
      </View>

      <Button title="Save Split" onPress={handleSaveSplit} />

      <StatusBar style="auto" />
    </View>
  );
};

// UpdateWeightsScreen component
const UpdateWeightsScreen = ({ gymSplits, onUpdateExercise }) => {
  const [currentSplit, setCurrentSplit] = useState("");
  const [currentExercise, setCurrentExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState(0);

  const handleSaveExercise = () => {
    const newLog = {
      sets: sets,
      reps: reps,
      weight: weight,
    };

    const splitIndex = gymSplits.findIndex(
      (split) => split.name === currentSplit
    );
    if (splitIndex !== -1) {
      const updatedSplit = { ...gymSplits[splitIndex] };
      const exerciseIndex = updatedSplit.exercises.findIndex(
        (ex) => ex.name === currentExercise
      );
      if (exerciseIndex !== -1) {
        if (!updatedSplit.exercises[exerciseIndex].logs) {
          updatedSplit.exercises[exerciseIndex].logs = [];
        }
        updatedSplit.exercises[exerciseIndex].logs.unshift(newLog); // Prepend the new log // Prepend the new log
      } else {
        updatedSplit.exercises.push({
          name: currentExercise,
          logs: [newLog],
        });
      }
      onUpdateExercise(updatedSplit);
    }

    setCurrentExercise("");
    setSets("");
    setReps("");
    setWeight(0);
  };

  const handleSplitChange = (value) => {
    setCurrentSplit(value);
    setCurrentExercise("");
    setSets("");
    setReps("");
    setWeight(0);
  };

  const getSplitExercises = () => {
    const split = gymSplits.find((split) => split.name === currentSplit);
    if (split) {
      return split.exercises.map((exercise, index) => (
        <Picker.Item key={index} label={exercise.name} value={exercise.name} />
      ));
    }
    return null;
  };

  const handleWeightChange = (value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setWeight(parsedValue);
    } else {
      setWeight(0);
    }
  };

  const handleContainerPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.header}>Update Weights Screen</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gym Split:</Text>
          <Picker
            style={styles.input}
            selectedValue={currentSplit}
            onValueChange={handleSplitChange}
          >
            <Picker.Item label="Select a split" value="" />
            {gymSplits.map((split) => (
              <Picker.Item
                key={split.name}
                label={split.name}
                value={split.name}
              />
            ))}
          </Picker>
        </View>

        {currentSplit !== "" && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Exercise:</Text>
              <Picker
                style={styles.input}
                selectedValue={currentExercise}
                onValueChange={(value) => setCurrentExercise(value)}
              >
                <Picker.Item label="Select an exercise" value="" />
                {getSplitExercises()}
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sets:</Text>
              <TextInput
                style={styles.input}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
                blurOnSubmit={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reps:</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (kg):</Text>
              <TextInput
                style={styles.input}
                value={weight.toString()}
                onChangeText={handleWeightChange}
                keyboardType="numeric"
              />
            </View>

            <Button title="Save Exercise" onPress={handleSaveExercise} />
          </>
        )}

        <StatusBar style="auto" />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const ViewResultsScreen = ({ gymSplits }) => {
  const calculateWeightIncrease = (exercise) => {
    if (!exercise.logs || exercise.logs.length < 2) {
      return 0;
    }

    const lastIndex = exercise.logs.length - 1;
    const lastLog = exercise.logs[lastIndex];
    const previousLog = exercise.logs[lastIndex - 1];

    return lastLog.weight - previousLog.weight;
  };

  {
    gymSplits.map((split, splitIndex) =>
      split.exercises.map((exercise, exerciseIndex) => {
        const latestLog = exercise.logs[exercise.logs.length - 1];
        console.log("Latest log:", latestLog); // Debug log

        return (
          <View
            key={`${splitIndex}-${exerciseIndex}`}
            style={styles.exerciseContainer}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text>Log: {JSON.stringify(latestLog)}</Text>
          </View>
        );
      })
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>View Results Screen</Text>

      {gymSplits.map((split) => (
        <View key={split.name} style={styles.splitContainer}>
          <Text style={styles.splitName}>{split.name}</Text>
          <Text style={styles.subheader}>Previous Logs:</Text>
          {split.exercises.map((exercise) => {
            if (!exercise.logs) {
              console.error(`Exercise ${exercise.name} has no logs`);
              return null;
            }
            const latestLog = exercise.logs[0]; // Fetch the latest log
            const previousLog =
              exercise.logs.length > 1
                ? exercise.logs[1] // Fetch the second latest log
                : null;
            return (
              <View key={exercise.name} style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text>Sets: {latestLog.sets}</Text>
                <Text>Reps: {latestLog.reps}</Text>
                <Text>Weight: {latestLog.weight} kg</Text>
                <Text>
                  Increase:{" "}
                  {exercise.logs && exercise.logs.length > 1
                    ? calculateWeightIncrease(exercise)
                    : "N/A"}{" "}
                  kg from previous
                </Text>
              </View>
            );
          })}
        </View>
      ))}

      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  const [gymSplits, setGymSplits] = useState([]);

  const handleSaveSplit = (split) => {
    setGymSplits((prevSplits) => [...prevSplits, split]);
  };

  const handleUpdateExercise = (updatedSplit) => {
    setGymSplits((prevSplits) =>
      prevSplits.map((split) =>
        split.name === updatedSplit.name ? updatedSplit : split
      )
    );
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Save Split" options={{ tabBarLabel: "Save Split" }}>
            {() => (
              <SaveSplitScreen
                onSaveSplit={handleSaveSplit}
                savedSplits={gymSplits.map((split) => split.name)}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Update Weights"
            options={{ tabBarLabel: "Update Weights" }}
          >
            {() => (
              <UpdateWeightsScreen
                gymSplits={gymSplits}
                onUpdateExercise={handleUpdateExercise}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="View Results"
            options={{ tabBarLabel: "View Results" }}
          >
            {() => <ViewResultsScreen gymSplits={gymSplits} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  exerciseList: {
    marginTop: 16,
  },
  exerciseItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  splitContainer: {
    marginTop: 16,
  },
  splitName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exerciseContainer: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
