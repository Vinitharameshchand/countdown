import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFinance } from '@/contexts/FinanceContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoansScreen() {
  const { loans, api, fetchData } = useFinance();
  const { currency } = useCurrency();
  const colorScheme = useColorScheme() ?? 'light';
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    tenureMonths: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async () => {
    if (!formData.loanAmount || !formData.interestRate || !formData.tenureMonths) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/loan', {
        loanAmount: Number(formData.loanAmount),
        interestRate: Number(formData.interestRate),
        tenureMonths: Number(formData.tenureMonths),
        startDate: formData.startDate
      });
      setFormData({
        loanAmount: '',
        interestRate: '',
        tenureMonths: '',
        startDate: new Date().toISOString().split('T')[0]
      });
      await fetchData();
      Alert.alert('Success', 'Loan created successfully!');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Debt Manager</ThemedText>
        <ThemedText style={styles.subtitle}>Consolidate and track your active loans.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.formCard}>
        <ThemedText style={styles.formTitle}>New Loan Details</ThemedText>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Principal Amount ({currency.symbol})</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="50000"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={formData.loanAmount}
            onChangeText={(text) => setFormData({ ...formData, loanAmount: text })}
          />
        </View>

        <View style={styles.grid}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <ThemedText style={styles.label}>Interest Rate (%)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="8.5"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={formData.interestRate}
              onChangeText={(text) => setFormData({ ...formData, interestRate: text })}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <ThemedText style={styles.label}>Tenure (Months)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="60"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={formData.tenureMonths}
              onChangeText={(text) => setFormData({ ...formData, tenureMonths: text })}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <ThemedText style={styles.addButtonText}>Add Loan</ThemedText>
              <IconSymbol name="calculator.fill" size={16} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.listSection}>
        <ThemedText style={styles.sectionTitle}>Active Portfolios</ThemedText>
        {loans.length > 0 ? (
          loans.map((loan: any) => {
             const progress = ((loan.loanAmount - loan.remainingBalance) / loan.loanAmount) * 100;
             return (
               <ThemedView key={loan._id} style={styles.loanCard}>
                 <View style={styles.loanCardHeader}>
                    <View style={styles.loanTitleRow}>
                       <IconSymbol name="chart.pie.fill" size={20} color="#10b981" />
                       <ThemedText style={styles.loanTitle}>Standard Loan</ThemedText>
                    </View>
                    <ThemedText style={styles.loanEmi}>EMI: {currency.symbol}{loan.emi.toLocaleString()}</ThemedText>
                 </View>

                  <View style={styles.metricsContainer}>
                    <View style={styles.metricItem}>
                       <ThemedText style={styles.metricLabel}>Remaining</ThemedText>
                       <ThemedText style={styles.metricValue}>{currency.symbol}{loan.remainingBalance.toLocaleString()}</ThemedText>
                    </View>

                    <View style={styles.progressContainer}>
                       <ThemedText style={styles.metricLabel}>Progress</ThemedText>
                       <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                       </View>
                    </View>
                  </View>

                 <View style={styles.loanFooter}>
                   <ThemedText style={styles.footerText}>{loan.interestRate}% Interest</ThemedText>
                   <ThemedText style={styles.footerText}>{loan.tenureMonths} Months Left</ThemedText>
                 </View>
               </ThemedView>
             );
          })
        ) : (
          <ThemedText style={styles.placeholderText}>No active loans found. Add one above.</ThemedText>
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
  formCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#f8fafc',
    backgroundColor: 'rgba(22, 28, 46, 0.5)',
  },
  addButton: {
    height: 48,
    backgroundColor: '#10b981',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  listSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'serif',
  },
  loanCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  loanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loanTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  loanEmi: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  metricsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  metricItem: {
    gap: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  loanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  placeholderText: {
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
