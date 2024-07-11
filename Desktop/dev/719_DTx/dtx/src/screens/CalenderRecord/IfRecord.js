import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground } from 'react-native';
import GoBackGeneralHeader from '../../components/GoBackGeneralHeader';

const IfRecord = () => {
  return (
    <ScrollView style={styles.ScrollView}>
      <GoBackGeneralHeader />
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 달 음주 현황</Text>
          <View style={styles.currentStatusContainer}>
            <Image style={styles.sojuimg} source={require('../../assets/minisoju.png')} />
            <Text style={styles.highlightedText}> 5.5</Text>
            <Text style={styles.statusText}> / 10 병</Text>
          </View>
        </View>
        <View style={[styles.section,{marginBottom:70}]}>
          <View style={{borderBottomWidth:1, borderBlockColor:'#DADADA', marginBottom:10, marginHorizontal:0}}>
            <Text style={styles.sectionTitle}>월 별 통계</Text>
          </View>
          <Text style={styles.yearText}>2024년도</Text>
          <View style={styles.statsContainer}>
            <Image style={styles.chart} source={require('../../assets/chart.png')}></Image>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{borderBottomWidth:1, borderBlockColor:'#DADADA', marginBottom:10, marginHorizontal:10}}>
            <Text style={styles.sectionTitle}>술을 마시지 않았더라면...</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statTitle,{fontSize:9}]}><Text style={{fontSize:14,fontWeight:700}}>소주를 안 먹었더라면..</Text></Text>
              <Text style={styles.value}><Text style={styles.statValue}>3,240,500</Text> 원 저축</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statTitle,{fontWeight:700}]}>람보르기니 1대</Text>
              <Text style={styles.value}><Text style={styles.statValue}>0.810</Text> %</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statTitle,{fontWeight:700,marginRight:38}]}>10일 우주여행</Text>
              <Text style={styles.value}><Text style={styles.statValue}>0.000526</Text> %</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statTitle,{fontWeight:700}]}>3분 카레</Text>
              <Text style={styles.value}><Text style={styles.statValue}>3,522</Text> 개 제조</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  sojuimg: {
    width: 13,
    height: 29,
    resizeMode: 'cover',
  },
  titlesection: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  ScrollView: {
    backgroundColor: '#fff',
  },
  chart:{
    width:'90%',
    height:240,
    marginVertical:35
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedText: {
    fontSize: 23,
    fontWeight: '700',
    color: '#84A2BB',
  },
  statusText: {
    fontSize: 22,
    color: '#000',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
    shadowColor: '#000',
    alignItems:'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  yearText: {
    fontSize: 16,
    marginBottom: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 16,
    height: 200,
  },
  chartBarContainer: {
    alignItems: 'center',
  },
  chartBar: {
    width: 20,
    marginVertical: 4,
  },
  chartBarFill: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#000',
    marginBottom: -2.5,
  },
  horizontalLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#84A2BB',
  },
  value: {
    marginRight: 35,
  },
  chartBarText: {
    fontSize: 14,
    marginBottom: 4,
  },
  chartMonthText: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    textAlign: 'right',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'left',
  },
  statValue: {
    fontSize: 16,
    marginHorizontal:0,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#84A2BB',
  },
});

export default IfRecord;
