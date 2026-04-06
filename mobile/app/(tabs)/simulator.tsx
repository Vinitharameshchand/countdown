import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFinance } from '@/contexts/FinanceContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Slider from '@react-native-community/slider';

const screenWidth = Dimensions.get('window').width;

export default function SimulatorScreen() {
  const { loans, api } = useFinance();
  const { currency } = useCurrency();
  const colorScheme = useColorScheme() ?? 'light';
  
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [extraPayment, setExtraPayment] = useState(100);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loans.length > 0 && !selectedLoan) {
      setSelectedLoan(loans[0]);
    }
  }, [loans]);

  const handleSimulate = async () => {
    if (!selectedLoan) return;
    setLoading(true);
    try {
      // The API endpoint for simulation
      const res = await api.post(`/loan/${selectedLoan._id}/simulate`, {
        extraMonthlyPayment: extraPayment
      });
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Simulation failed. Ensure backend supports /simulate endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Loan Simulator</ThemedText>
        <ThemedText style={styles.subtitle}>See how extra payments accelerate your freedom.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.controlsCard}>
        <ThemedText style={styles.label}>Select Loan</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.loanSelector}>
          {loans.map((loan: any) => (
            <TouchableOpacity 
              key={loan._id} 
              style={[
                styles.loanOption, 
                selectedLoan?._id === loan._id && styles.selectedLoanOption,
                { borderColor: selectedLoan?._id === loan._id ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }
              ]}
              onPress={() => setSelectedLoan(loan)}
            >
              <ThemedText style={[styles.loanOptionText, selectedLoan?._id === loan._id && styles.selectedLoanOptionText]}>
                {currency.symbol}{loan.loanAmount.toLocaleString()} ({loan.interestRate}%)
              </ThemedText>
            </TouchableOpacity>
          ))}
          {loans.length === 0 && <ThemedText style={styles.placeholderText}>No active loans found</ThemedText>}
        </ScrollView>

        <View style={styles.sliderContainer}>
          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>Extra Monthly Payment</ThemedText>
            <ThemedText style={styles.valueDisplay}>{currency.symbol}{extraPayment}</ThemedText>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={2000}
            step={50}
            value={extraPayment}
            onValueChange={setExtraPayment}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
            thumbTintColor="#10b981"
          />
        </View>

        <TouchableOpacity 
          style={[styles.simulateButton, (!selectedLoan || loading) && styles.disabledButton]} 
          onPress={handleSimulate}
          disabled={loading || !selectedLoan}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol name="zap.fill" size={18} color="#fff" />
              <ThemedText style={styles.buttonText}>Run Simulation</ThemedText>
            </>
          )}
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.resultsContainer}>
        <ThemedText style={styles.sectionTitle}>Simulation Results</ThemedText>
        {result ? (
          <ThemedView style={styles.resultCard}>
            <View style={styles.metricCompare}>
              <View style={styles.metricBox}>
                <ThemedText style={styles.metricBoxLabel}>Original</ThemedText>
                <ThemedText style={styles.metricBoxValue}>{result.standardPayoffMonths} Months</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={24} color="#94a3b8" />
              <View style={[styles.metricBox, styles.optimizedBox]}>
                <ThemedText style={[styles.metricBoxLabel, { color: '#10b981' }]}>Optimized</ThemedText>
                <ThemedText style={[styles.metricBoxValue, { color: '#10b981' }]}>{result.optimizedPayoffMonths} Months</ThemedText>
              </View>
            </View>

            <View style={styles.savingsHighlight}>
               <View style={styles.savingsRow}>
                  <IconSymbol name="chart.bar.fill" size={20} color="#10b981" />
                  <ThemedText style={styles.savingsText}>
                    Time Saved: <ThemedText style={styles.bold}>{result.monthsSaved} Months</ThemedText>
                  </ThemedText>
               </View>
            </View>

            <ThemedView style={styles.insightBox}>
              <ThemedText style={styles.insightText}>
                By paying an extra <ThemedText style={styles.bold}>{currency.symbol}{result.extraMonthlyPayment}</ThemedText>, you will become debt-free 
                <ThemedText style={styles.bold}> {Math.floor(result.monthsSaved / 12)} years</ThemedText> and 
                <ThemedText style={styles.bold}> {result.monthsSaved % 12} months</ThemedText> faster!
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView style={styles.placeholderResults}>
             <IconSymbol name="zap.fill" size={48} color="rgba(255, 255, 255, 0.1)" />
             <ThemedText style={styles.placeholderResultsText}>Adjust parameters and run simulation to see impact.</ThemedText>
          </ThemedView>
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
  },
  controlsCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  loanSelector: {
    marginBottom: 24,
  },
  loanOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedLoanOption: {
    backgroundColor: '#10b98120',
  },
  loanOptionText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  selectedLoanOptionText: {
    color: '#10b981',
    fontWeight: '700',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueDisplay: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  simulateButton: {
    height: 52,
    backgroundColor: '#10b981',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'serif',
  },
  resultCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#10b98140',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  metricCompare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  optimizedBox: {
    backgroundColor: '#10b98115',
  },
  metricBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricBoxValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  savingsHighlight: {
    marginBottom: 20,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: '800',
  },
  insightBox: {
    marginTop: 12,
  },
  insightText: {
    color: '#94a3b8',
    lineHeight: 22,
    textAlign: 'center',
  },
  placeholderResults: {
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    gap: 16,
  },
  placeholderResultsText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
  },
  placeholderText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  }
});
