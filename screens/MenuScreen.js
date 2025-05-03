import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const STORAGE_ICONS = {
  frigo:   require('../assets/frigo.png'),
  congelo: require('../assets/congelo.png'),
  placard: require('../assets/placard.png'),
  quick:   require('../assets/quick.png'),
};

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 40 - 16) / 2;

export default function MenuScreen() {
  const nav = useNavigation();

  const items = [
    {
      key: 'frigo',
      label: 'Frigo',
      bgColor: '#F7E1A8',
      onPress: () => nav.navigate('InventaireScreen', { storageType: 'frigo' }),
    },
    {
      key: 'congelo',
      label: 'Congélo',
      bgColor: '#a6c297',
      onPress: () => nav.navigate('InventaireScreen', { storageType: 'congelo' }),
    },
    {
      key: 'quick',
      label: 'À consommer\nrapidement',
      bgColor: '#a6c297',
      onPress: () => nav.navigate('QuickConsoScreen'),
    },
    {
      key: 'placard',
      label: 'Placard',
      bgColor: '#F7E1A8',
      onPress: () => nav.navigate('InventaireScreen', { storageType: 'placard' }),
    },
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Ma cuisine</Text>

      <View style={styles.grid}>
        {items.map(({ key, label, bgColor, onPress }) => {
          const isYellow = bgColor === '#F7E1A8';
          return (
            <TouchableOpacity
              key={key}
              style={[styles.card, { backgroundColor: bgColor }]}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Image source={STORAGE_ICONS[key]} style={styles.icon} />
              <Text
                style={[
                  styles.cardLabel,
                  { color: isYellow ? '#204825' : '#FFFFFF' }
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.alertButton, styles.rappel]}
        onPress={() => nav.navigate('RappelConsoScreen')}
      >
        <Text style={styles.alertText}>Mes rappels conso DGCCRF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recipeButton}
        onPress={() => nav.navigate('RecipesScreen')}
      >
        <Text style={styles.recipeText}>Idées recettes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FCF6EC',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffb64b',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  alertButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rappel: {
    backgroundColor: '#EF6F5E',
    marginBottom: 24,
  },
  alertText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recipeButton: {
    backgroundColor: '#eee3cc',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 70,
  },
  recipeText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
