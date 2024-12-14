import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StyleSheet,
  TextInput,
} from "react-native";
import firebase from "../../Config";
import { useRef } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ou FontAwesome pour la version plus ancienne



const database = firebase.database();
const ref_groups = database.ref("groupDiscussions");

export default function Group(props) {
  const currentId = props.route.params.currentId; // Récupérer l'ID utilisateur depuis les props
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ref_tableProfils = database.ref("TableProfils").child(currentId);
    ref_tableProfils.once("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData(data);
      } else {
        console.error("Utilisateur non trouvé dans la base de données.");
      }
      setLoading(false);
    });
  }, [currentId]);


const flatListRef = useRef(null);
 
useEffect(() => {
  if (flatListRef.current && messages.length > 0) {
    flatListRef.current.scrollToEnd({ animated: true });
  }
}, [messages]);


  useEffect(() => {
    ref_groups.on("value", (snapshot) => {
      const groupList = [];
      snapshot.forEach((childSnapshot) => {
        groupList.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setGroups(groupList);
    });

    return () => ref_groups.off();
  }, []);

  const handleCreateGroup = () => {
    if (newGroupName.trim() !== "") {
      const newGroupRef = ref_groups.push();
      newGroupRef.set({
        name: newGroupName,
        messages: [],
        createdBy: userData.id,
      });
      setNewGroupName("");
    }
  };

  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
    const messagesRef = ref_groups.child(group.id).child("messages");

    messagesRef.on("value", (snapshot) => {
      const msgList = [];
      snapshot.forEach((childSnapshot) => {
        msgList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setMessages(msgList);
    });

    return () => messagesRef.off();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && selectedGroup) {
      const messagesRef = ref_groups.child(selectedGroup.id).child("messages");
      const newMessageRef = messagesRef.push();
      newMessageRef.set({
        text: newMessage,
        sender: userData.nom,
        timestamp: new Date().toLocaleString(),
      });
      setNewMessage("");
    }
  };

  if (selectedGroup) {
    return (
      <ImageBackground
        source={require("../../assets/background.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { marginBottom: 10 }]}>
            Discussion : {selectedGroup.name}
          </Text>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.messageCard}>
                <Text style={styles.messageSender}>{item.sender}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.timestamp}</Text>
              </View>
            )}
            style={styles.messageList}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Écrire un message..."
              placeholderTextColor="#aaa"
              value={newMessage}
              onChangeText={setNewMessage}
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Icon name="paper-plane" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() => setSelectedGroup(null)}
          >
            <Text style={styles.leaveButtonText}>Quitter le groupe</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Groupes</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nom du groupe"
            placeholderTextColor="#aaa"
            value={newGroupName}
            onChangeText={setNewGroupName}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createButtonText}>Créer</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              <Text style={styles.groupName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinGroup(item)}
              >
                <Text style={styles.joinButtonText}>Rejoindre</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.groupList}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Ajouter un effet sombre
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 60, // Ajout du paddingTop
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  groupList: {
    marginTop: 10,
  },
  groupCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    color: "#fff",
  },
  joinButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageCard: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageSender: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 5,
  },
  messageTime: {
    fontSize: 12,
    color: "#aaa",
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    width: 80
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  leaveButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
  },
  leaveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: "#ccc",
    marginTop: 5,
    textAlign: "right",
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
