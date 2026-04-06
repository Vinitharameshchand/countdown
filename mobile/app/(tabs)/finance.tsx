import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFinance } from '@/contexts/FinanceContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FinanceScreen() {
  const { incomes, expenses, api, fetchData } = useFinance();
  const { currency } = useCurrency();
  const colorScheme = useColorScheme() ?? 'light';
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async () => {
    if (!formData.amount || (!formData.source && !formData.category)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const endpoint = activeTab === 'income' ? '/income' : '/expense';
      const payload = activeTab === 'income' 
        ? { amount: Number(formData.amount), source: formData.source, date: formData.date }
        : { amount: Number(formData.amount), category: formData.category, date: formData.date };
      
      await api.post(endpoint, payload);
      setFormData({ amount: '', source: '', category: '', date: new Date().toISOString().split('T')[0] });
      await fetchData();
      Alert.alert('Success', `${activeTab === 'income' ? 'Income' : 'Expense'} added!`);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const listData = activeTab === 'income' ? incomes : expenses;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Finance Tracker</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your revenue and spending.</ThemedText>
      </ThemedView>

      <View style={styles.tabSwitcher}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'income' && styles.activeTab]} 
          onPress={() => setActiveTab('income')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'income' && styles.activeTabText]}>Income</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expense' && styles.activeTab]} 
          onPress={() => setActiveTab('expense')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'expense' && styles.activeTabText]}>Expenses</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={styles.formCard}>
        <ThemedText style={styles.formTitle}>Add New {activeTab === 'income' ? 'Income' : 'Expense'}</ThemedText>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>{activeTab === 'income' ? 'Source' : 'Category'}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder={activeTab === 'income' ? "e.g. Salary, Freelance" : "e.g. Rent, Groceries"}
            placeholderTextColor="#94a3b8"
            value={activeTab === 'income' ? formData.source : formData.category}
            onChangeText={(text) => setFormData({ ...formData, [activeTab === 'income' ? 'source' : 'category']: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Amount ({currency.symbol})</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
          />
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
              <ThemedText style={styles.addButtonText}>Add {activeTab === 'income' ? 'Income' : 'Expense'}</ThemedText>
              <IconSymbol name="paperplane.fill" size={16} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.listSection}>
        <ThemedText style={styles.sectionTitle}>Transaction History</ThemedText>
        {listData.length > 0 ? (
          listData.map((item: any) => (
            <ThemedView key={item._id} style={styles.listItem}>
              <View style={styles.itemMain}>
                <View style={[styles.iconBox, { backgroundColor: activeTab === 'income' ? '#10b98120' : '#ef444420' }]}>
                  <IconSymbol 
                    name={activeTab === 'income' ? 'wallet.fill' : 'chart.pie.fill'} 
                    size={20} 
                    color={activeTab === 'income' ? '#10b981' : '#ef4444'} 
                  />
                </View>
                <View>
                  <ThemedText style={styles.itemTitle}>{activeTab === 'income' ? item.source : item.category}</ThemedText>
                  <ThemedText style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.itemAmount, { color: activeTab === 'income' ? '#10b981' : '#ef4444' }]}>
                {activeTab === 'income' ? '+' : '-'}{currency.symbol}{item.amount.toLocaleString()}
              </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.placeholderText}>No entries recorded yet.</ThemedText>
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
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#10b981',
  },
  tabText: {
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#fff',
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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    backgroundColor: 'rgba(22, 28, 46, 0.4)',
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemDate: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  itemAmount: {
    fontWeight: '700',
    fontSize: 16,
  },
  placeholderText: {
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
