import React, { useState, useEffect, useCallback } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((res) => {
      setRepositories(res.data);
    });
  }, []);

  const handleLikeRepository = useCallback(
    async (id) => {
      const { data: updatedRepo } = await api.post(`repositories/${id}/like`);

      const nextState = repositories.map((repo) =>
        repo.id === id ? updatedRepo : repo
      );

      setRepositories(nextState);
    },
    [repositories, setRepositories]
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.likesContainer}>
          <FlatList
            data={repositories}
            keyExtractor={(repo) => String(repo.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: repo }) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{repo.title}</Text>

                <FlatList
                  data={repo.techs}
                  style={styles.techsContainer}
                  keyExtractor={(tech) => String(tech)}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: tech }) => (
                    <Text style={styles.tech}>{tech}</Text>
                  )}
                />

                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.id}`}
                >
                  {repo.likes} curtidas
                </Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repo.id)}
                  testID={`like-button-${repo.id}`}
                >
                  <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
