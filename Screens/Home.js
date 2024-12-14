import React, { useState, useRef, useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Group from "./Home/Group";
import ListProfil from "./Home/ListProfil";
import MyProfil from "./Home/MyProfil";
import { colors } from "../Styles/styles";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { setStatusBarStyle } from "expo-status-bar";
import firebase from "../Config";

const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentId = props.route.params.currentId;



  const handleLogout = () => {
    // Logique de déconnexion (par exemple, suppression de session)
    
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: () => {
            const ref_tableProfils = firebase.database().ref("TableProfils").child(currentId);
            ref_tableProfils
              .update({ isConnected: false })
              .then(() => {
                console.log("isConnected mis à jour avec succès: false");
                // Rediriger vers la page Home après mise à jour
                navigation.replace("Home", { currentId });
              })
            props.navigation.replace("Authentification");
          } // Remplacer par l'écran d'authentification

        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        barStyle={{
          backgroundColor: colors.buttonColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Tab.Screen
          name="ListProfil"
          component={ListProfil}
          initialParams={{ currentId }}
          options={{
            tabBarLabel: "Profils",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-multiple"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Group"
          component={Group}
          initialParams={{ currentId }} // Passe currentId ici
          options={{
            tabBarLabel: "Groupes",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-group"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyProfil"
          component={MyProfil}
          
          initialParams={{ currentId }}
          options={{
            tabBarLabel: "Mon Profil",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Bouton de déconnexion */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          backgroundColor: colors.buttonColor,
          padding: 12,
          borderRadius: 80,
          elevation: 5,
        }}
      >
        <MaterialCommunityIcons name="logout" color="#fff" size={24} />
        
      </TouchableOpacity>
    </View>
  );
}
