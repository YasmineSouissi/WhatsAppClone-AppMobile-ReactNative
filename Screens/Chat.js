import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  SectionList
} from "react-native";
import React, { useState, useEffect } from "react";
import { fonts, layout, colors } from "../Styles/styles";
import firebase from "../Config";

import Icon from 'react-native-vector-icons/FontAwesome5'; // Ou FontAwesome pour la version plus ancienne


const database = firebase.database();
const ref_lesdiscussions = database.ref("lesdiscussions");


export default function Chat(props) {
  const currentUser = props.route.params.currentUser;
  const secondUser = props.route.params.secondUser;
  const [imageUri, setImageUri] = useState(null); // Pour stocker l'image sélectionnée

  

  const iddisc =
    currentUser.id > secondUser.id
      ? currentUser.id + secondUser.id
      : secondUser.id + currentUser.id;
  const ref_unediscussion = ref_lesdiscussions.child(iddisc);
  const ref_currentIsTyping = ref_unediscussion.child(
    `${currentUser.id}isTyping`
  );
  const ref_secondIsTyping = ref_unediscussion.child(
    `${secondUser.id}isTyping`
  );
  const [isSecondUserTyping, setIsSecondUserTyping] = useState(false);

  const [Msg, setMsg] = useState("");
  const [data, setdata] = useState([]);

  const getProfileImageSource = (isCurrentUser) => {
    const uriImage = isCurrentUser ? currentUser.uriImage : secondUser.uriImage;
    const isDefaultImage = !uriImage;
    return isDefaultImage
      ? require("../assets/profil.png") // Image par défaut
      : { uri: uriImage }; // Image utilisateur
  };
  
  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri); // Enregistrer l'URI de l'image sélectionnée
      } else {
        Alert.alert('Erreur', 'Aucune image sélectionnée');
      }
    });
  };
  

  useEffect(() => {
    ref_unediscussion.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
  
        if (message.body && message.sender && message.receiver && message.time) {
          d.push(message);
        }
      });
      setdata(d);
    });
  
    return () => {
      ref_unediscussion.off();
    };
  }, []);
  

  const handleSend = () => {
  const key = ref_unediscussion.push().key;
  const ref_unmsg = ref_unediscussion.child(key);
  ref_unmsg.set({
    body: Msg,
    time: new Date().toLocaleString(),
    sender: currentUser.id,
    receiver: secondUser.id,
    imageUri: imageUri, // Ajouter l'image à l'envoi
  });

  setMsg("");  // Réinitialiser le champ de texte
  setImageUri(null); // Réinitialiser l'image après envoi
};

useEffect(() => {
  // Écouter l'état de "isTyping" pour l'autre utilisateur
  const secondUserTypingListener = ref_secondIsTyping.on(
    "value",
    (snapshot) => {
      setIsSecondUserTyping(snapshot.val() || false);
    }
  );

  return () => {
    // Nettoyer l'écouteur à la désactivation du composant
    ref_secondIsTyping.off("value", secondUserTypingListener);
  };
}, []);

// Mise à jour de isTyping quand l'utilisateur actuel est en train de taper
const handleFocus = () => {
  ref_currentIsTyping.set(true); 
};

const handleBlur = () => {
  ref_currentIsTyping.set(false); 
};

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.container}
      >
      <View style={styles.headerContainer}>

      <View style={styles.headerContainer}>
  {/* <Image
    source={getProfileImageSource(false)}
    style={{
      borderRadius: 25, // Moitié de la hauteur/largeur pour un cercle
      height: 50,
      width: 50,
      marginRight: 10, // Espacement entre l'image et le texte
    }}
  /> */}
  <Text style={styles.headerText}>Chat avec {secondUser.nom}</Text>
</View>

        
</View>


<FlatList
  style={styles.messagesContainer}
  data={data}
  renderItem={({ item, index }) => {
    const isCurrentUser = item.sender === currentUser.id;
    const color = isCurrentUser ? "#FFF" : "#444";
    const textColor = isCurrentUser ? colors.buttonColor : "#fff";

    // Utilisation de la fonction getProfileImageSource
    const profileImage = getProfileImageSource(isCurrentUser);

    const showProfileImage =
      index === 0 || item.sender !== data[index - 1].sender;

    return (
      <View
        style={[
          styles.messageContainer,
          {
            flexDirection: isCurrentUser ? "row-reverse" : "row",
          },
        ]}
      >
        {showProfileImage && profileImage ? (
          <Image
            source={profileImage} // Utilisation de l'URI retournée par getProfileImageSource
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImage} />
        )}
        <View style={[styles.message, { backgroundColor: color }]}>
          <View style={styles.messageContent}>
            <Text style={[styles.messageText, { color: textColor }]}>
              {item.body}
            </Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  }}
  ListFooterComponent={
    isSecondUserTyping && (
      <Text style={styles.typingIndicator}>
        {secondUser.nom} is typing...
      </Text>
    )
  }
/>


        
        <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setMsg(text)}
          onFocus={() => ref_currentIsTyping.set(true)}
          onBlur={() => ref_currentIsTyping.set(false)}
          value={Msg}
          placeholderTextColor="#ccc"
          placeholder="Write a message"
          style={styles.textinput}
        />
        <TouchableHighlight
          activeOpacity={0.5}
          underlayColor="#555"
          style={styles.sendButton}
          onPress={handleSend}
        >
          {/* Icône seule comme enfant de TouchableHighlight */}
          <Icon name="paper-plane" size={30} color="#fff" />
        </TouchableHighlight>
      </View>


      </ImageBackground>
    </View>
    
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 0,
  },
  headerText: {
    marginTop: 50,
    fontSize: 25,
    fontWeight: "bold",
    color: "#57acac",
  },
  typingIndicator: {
    fontSize: 18,
    color: "#ccc",
    fontStyle: "italic",
    marginBottom: 5,
    marginLeft: 30

  },
  messagesContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "95%",
    borderRadius: 10,
    marginVertical: 20,
    padding: 0,
    paddingTop: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  message: {
    padding: 10,
    marginVertical: 0,
    borderRadius: 8,
    maxWidth: "80%",
  },
  messageContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  profileImage: {
    width: 40, // Taille de l'image, ajustez selon votre besoin
    height: 40, // Taille de l'image, ajustez selon votre besoin
    borderRadius: 20, // Pour un cercle
    marginRight: 10, // Espacement entre l'image et le texte
    marginLeft: 10, // Espacement à gauche pour l'utilisateur actuel
    marginTop: 5,
  },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  textinput: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    height: 50,
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.buttonColor,
    borderRadius: 26,
    height: 50,
    width: 50, 
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: 'row', // Alignement horizontal
    alignItems: 'center', // Alignement vertical centré
    marginTop: 10, // Espacement supérieur
    marginBottom: 0, // Espacement inférieur
  },
  
  headerProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 0,
  },
  
});
