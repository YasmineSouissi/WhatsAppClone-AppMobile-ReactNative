import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ou FontAwesome pour la version plus ancienne

import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { fonts, colors } from "../../Styles/styles";
import firebase from "../../Config";

const database = firebase.database();
const ref_tableProfils = database.ref("TableProfils");

export default function ListProfil({ route, navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { currentId } = route.params;

  // Récupération des profils et de l'utilisateur actuel
  useEffect(() => {
    const listener = ref_tableProfils.on("value", async (snapshot) => {
      const profilesArray = [];
      const promises = [];
  
      snapshot.forEach((childSnapshot) => {
        const profile = childSnapshot.val();
        if (profile.id === currentId) {
          setCurrentUser(profile);
        } else {
          profilesArray.push(profile);
  
          // Identifier la discussion
          const iddisc =
            currentId > profile.id
              ? currentId + profile.id
              : profile.id + currentId;
  
          // Charger le dernier message
          const promise = firebase
            .database()
            .ref(`lesdiscussions/${iddisc}`)
            .orderByKey()
            .limitToLast(1)
            .once("value")
            .then((messageSnapshot) => {
              if (messageSnapshot.exists()) {
                const lastMessage = Object.values(messageSnapshot.val())[0];
                profile.lastMessage = lastMessage.body || "Aucun message";
                profile.lastMessageTime = lastMessage.time || "";
              } else {
                profile.lastMessage = "Aucun message";
                profile.lastMessageTime = "";
              }
            });
  
          promises.push(promise);
        }
      });
  
      // Attendre que toutes les promesses soient terminées
      await Promise.all(promises);
      setProfiles(profilesArray);
    });
  
    // Nettoyage
    return () => ref_tableProfils.off("value");
  }, [currentId]);
  
  
  

  // Composant de rendu pour chaque profil
  const renderProfileItem = ({ item }) => (
    <View style={styles.profileCard}>
      <View
        style={[
          styles.connectionStatus,
          { backgroundColor: item.isConnected ? "#08DA08" : "#FF0909" },
        ]}
      ></View>
      <Image
        source={
          item.uriImage
            ? { uri: item.uriImage }
            : require("../../assets/profil.png")
        }
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.profilePseudo}>
          {item.pseudo || "Pseudo indisponible"}
        </Text>
        <Text style={styles.profileName}>{item.nom || "Nom indisponible"}</Text>
        {/* Affichage du dernier message */}
        <Text style={styles.lastMessage}>
          {item.lastMessage || "Chargement..."}
        </Text>
        <Text style={styles.lastMessageTime}>
          {item.lastMessageTime || ""}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() =>
          navigation.navigate("Chat", {
            currentUser,
            secondUser: item,
          })
        }
      >
        <Icon name="comment" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
  

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={[fonts.title, styles.title]}>Profils</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfileItem}
        style={styles.list}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    marginTop: 60,
    marginBottom: 20,
  },
  list: {
    width: "90%",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  connectionStatus: {
    width: 15,
    height: 15,
    borderRadius: 50,
    marginRight: 10,  // Décalage pour que le cercle soit juste à côté de l'image
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profilePseudo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 14,
    color: "#cdcdcd",
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 5,
  },
  lastMessageTime: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "right",
  },
  
});
